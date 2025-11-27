import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function ExamsList(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', exam_date:'', notes:'' });
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  useEffect(()=>{
    async function load(){
      if(!petId) return;
      setLoading(true);
      try{
        const r = await api.get(`/api/exams/${petId}`);
        setItems(r.data || []);
      } finally { setLoading(false); }
    }
    load();
  },[petId]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:18, fontWeight:600}}>Exames</div>
        <a href="/exams/new" style={{background:'#FF7A00', color:'#fff', padding:'8px 12px', borderRadius:8}}>Adicionar</a>
      </div>
      {!petId && <div style={{color:'#c00'}}>Informe o Pet ID no topo.</div>}
      {loading && <div>Carregando...</div>}
      {items.map(i=> (
        <div key={i.id} style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
          <div style={{fontWeight:600}}>{i.title}</div>
          <div style={{fontSize:12, color:'#555'}}>Data {i.exam_date || '-'}</div>
          {i.notes && <div style={{fontSize:12}}>{i.notes}</div>}
          {Array.isArray(i.files) && i.files.length>0 && (
            <div style={{marginTop:8}}>
              <div style={{fontSize:12, color:'#555'}}>Anexos</div>
              <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
                {i.files.map(f=> {
                  const abs = (u)=> (u && u.startsWith('/')) ? `${api.defaults.baseURL||''}${u}` : u;
                  const href = abs(f.url);
                  return (
                  <div key={f.name} style={{display:'grid', gap:6, alignContent:'start'}}>
                    {String(f.mime||'').startsWith('image/') ? (
                      <a href={href} target="_blank" rel="noreferrer"><img src={href} alt={f.name} style={{width:120, height:90, objectFit:'cover', borderRadius:8, border:'1px solid #eee'}} /></a>
                    ) : (
                      <a href={href} target="_blank" rel="noreferrer" style={{fontSize:12, background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8, display:'inline-block'}}>{f.name}</a>
                    )}
                    <button onClick={async()=>{ const r=await api.delete(`/api/exams/${i.id}/files`, { data: { name: f.name }}); setItems(items.map(x=>x.id===i.id?r.data:x)); }} style={{fontSize:12, background:'#ffe6e6', color:'#a00', padding:'6px 10px', borderRadius:8}}>Remover</button>
                  </div>
                )})}
              </div>
            </div>
          )}
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button onClick={()=>{ setEditing(i.id); setForm({ title:i.title||'', exam_date:i.exam_date||'', notes:i.notes||'' }); }} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Editar</button>
            <button onClick={async()=>{ if(!confirm('Excluir este exame?')) return; await api.delete(`/api/exams/${i.id}`); setItems(items.filter(x=>x.id!==i.id)); }} style={{background:'#ffe6e6', color:'#a00', padding:'6px 10px', borderRadius:8}}>Excluir</button>
          </div>
          <div style={{display:'grid', gap:6, marginTop:8}}>
            <div style={{fontSize:12}}>Adicionar arquivo</div>
            <input type="file" onChange={e=>{
              const f = e.target.files?.[0]||null; 
              if(f && f.size > 8*1024*1024){ alert('Arquivo maior que 8MB'); e.target.value=''; return; }
              if(f && !['image/jpeg','image/png','application/pdf'].includes(f.type)){ alert('Tipo de arquivo não suportado'); e.target.value=''; return; }
              setUploadFile(f);
            }} />
            <input value={uploadName} onChange={e=>setUploadName(e.target.value)} placeholder="Nome do arquivo" style={{padding:6, border:'1px solid #ddd', borderRadius:8}} />
            <div style={{display:'flex', gap:8}}>
              <button onClick={async()=>{
                if(!uploadFile || !uploadName){ alert('Selecione o arquivo e informe o nome'); return; }
                const fr = new FileReader();
                fr.onload = async ()=>{
                  const content = fr.result;
                  const r = await api.post(`/api/exams/${i.id}/files`, { name: uploadName, content });
                  setItems(items.map(x=>x.id===i.id?r.data:x));
                  setUploadFile(null); setUploadName('');
                };
                fr.readAsDataURL(uploadFile);
              }} style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8}}>Enviar</button>
            </div>
          </div>
          {editing===i.id && (
            <div style={{marginTop:12, display:'grid', gap:8}}>
              <label>
                <span style={{fontSize:12}}>Título</span>
                <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Data</span>
                <input type="date" value={form.exam_date} onChange={e=>setForm({...form, exam_date:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Notas</span>
                <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <div style={{display:'flex', gap:8}}>
                <button onClick={async()=>{ const r=await api.put(`/api/exams/${i.id}`, form); setItems(items.map(x=>x.id===i.id?r.data:x)); setEditing(null); }} style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8}}>Salvar</button>
                <button onClick={()=>setEditing(null)} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {!loading && items.length===0 && petId && <div style={{color:'#555'}}>Sem registros de exames.</div>}
    </div>
  );
}