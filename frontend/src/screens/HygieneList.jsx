import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function HygieneList(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kind:'orelhas', status:'realizada', event_date:'', notes:'' });
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  useEffect(()=>{
    async function load(){
      if(!petId) return;
      setLoading(true);
      try{
        const r = await axios.get(`/api/hygiene/${petId}`);
        setItems(r.data || []);
      } finally { setLoading(false); }
    }
    load();
  },[petId]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:18, fontWeight:600}}>Higiene</div>
        <a href="/hygiene/new" className="btn btn-primary">Adicionar</a>
      </div>
      {!petId && <div style={{color:'#c00'}}>Informe o Pet ID no topo.</div>}
      {loading && <div>Carregando...</div>}
      {items.map(i=> (
        <div key={i.id} style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
          <div style={{fontWeight:600}}>{i.kind}</div>
          <div style={{fontSize:12, color:'#555'}}>{i.status} • {i.event_date || '-'}</div>
          {i.notes && <div style={{fontSize:12}}>{i.notes}</div>}
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button onClick={()=>{ setEditing(i.id); setForm({ kind:i.kind||'orelhas', status:i.status||'realizada', event_date:i.event_date||'', notes:i.notes||'' }); }} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Editar</button>
            <button onClick={async()=>{ if(!confirm('Excluir este registro de higiene?')) return; await axios.delete(`/api/hygiene/${i.id}`); setItems(items.filter(x=>x.id!==i.id)); }} style={{background:'#ffe6e6', color:'#a00', padding:'6px 10px', borderRadius:8}}>Excluir</button>
          </div>
          {editing===i.id && (
            <div style={{marginTop:12, display:'grid', gap:8}}>
              <label>
                <span style={{fontSize:12}}>Tipo</span>
                <select value={form.kind} onChange={e=>setForm({...form, kind:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
                  <option value="orelhas">Orelhas</option>
                  <option value="unhas">Unhas</option>
                  <option value="dentes">Dentes</option>
                </select>
              </label>
              <label>
                <span style={{fontSize:12}}>Status</span>
                <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
                  <option value="realizada">Realizada</option>
                  <option value="agendada">Agendada</option>
                </select>
              </label>
              <label>
                <span style={{fontSize:12}}>Data</span>
                <input type="date" value={form.event_date} onChange={e=>setForm({...form, event_date:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Notas</span>
                <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <div style={{display:'flex', gap:8}}>
                <button onClick={async()=>{ const r=await axios.put(`/api/hygiene/${i.id}`, form); setItems(items.map(x=>x.id===i.id?r.data:x)); setEditing(null); }} style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8}}>Salvar</button>
                <button onClick={()=>setEditing(null)} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {!loading && items.length===0 && petId && <div style={{color:'#555'}}>Sem registros.</div>}
    </div>
  );
}