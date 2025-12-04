import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function ConsultationsList(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', start_at:'', location:'', description:'' });
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  useEffect(()=>{
    async function load(){
      if(!petId) return;
      setLoading(true);
      try{
        const r = await api.get(`/api/appointments/${petId}`);
        setItems(r.data || []);
      } finally { setLoading(false); }
    }
    load();
  },[petId]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:18, fontWeight:600}}>Consultas</div>
        <a href="/consultations/new" className="btn btn-primary">Adicionar</a>
      </div>
      {!petId && <div style={{color:'#c00'}}>Informe o Pet ID no topo.</div>}
      {loading && <div>Carregando...</div>}
      {items.map(i=> (
        <div key={i.id} style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
          <div style={{fontWeight:600}}>{i.title}</div>
          <div style={{fontSize:12, color:'#555'}}>Início {i.start_at || '-'} {i.location?`• ${i.location}`:''}</div>
          {i.description && <div style={{fontSize:12}}>{i.description}</div>}
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button onClick={()=>{ setEditing(i.id); setForm({ title:i.title||'', start_at:i.start_at?i.start_at.slice(0,16):'', location:i.location||'', description:i.description||'' }); }} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Editar</button>
            <button onClick={async()=>{ if(!confirm('Excluir esta consulta?')) return; await api.delete(`/api/appointments/${i.id}`); setItems(items.filter(x=>x.id!==i.id)); }} style={{background:'#ffe6e6', color:'#a00', padding:'6px 10px', borderRadius:8}}>Excluir</button>
          </div>
          {editing===i.id && (
            <div style={{marginTop:12, display:'grid', gap:8}}>
              <label>
                <span style={{fontSize:12}}>Título</span>
                <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Data/hora</span>
                <input type="datetime-local" value={form.start_at} onChange={e=>setForm({...form, start_at:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Local</span>
                <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Descrição</span>
                <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <div style={{display:'flex', gap:8}}>
                <button onClick={async()=>{ const r=await api.put(`/api/appointments/${i.id}`, form); setItems(items.map(x=>x.id===i.id?r.data:x)); setEditing(null); }} style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8}}>Salvar</button>
                <button onClick={()=>setEditing(null)} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      ))}
      {!loading && items.length===0 && petId && <div style={{color:'#555'}}>Sem registros de consultas.</div>}
    </div>
  );
}