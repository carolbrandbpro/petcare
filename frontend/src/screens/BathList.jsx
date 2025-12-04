import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function BathList(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ bath_date:'', place:'', notes:'' });
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  useEffect(()=>{
    async function load(){
      if(!petId) return;
      setLoading(true);
      try{
        const r = await axios.get(`/api/bath/${petId}`);
        setItems(r.data || []);
      } finally { setLoading(false); }
    }
    load();
  },[petId]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:18, fontWeight:600}}>Banho</div>
        <a href="/bath/new" className="btn btn-primary">Adicionar</a>
      </div>
      {!petId && <div style={{color:'#c00'}}>Informe o Pet ID no topo.</div>}
      {loading && <div>Carregando...</div>}
      {items.map(i=> (
        <div key={i.id} style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
          <div style={{fontWeight:600}}>{i.bath_date || '-'}</div>
          <div style={{fontSize:12, color:'#555'}}>{i.place || ''}</div>
          {i.notes && <div style={{fontSize:12}}>{i.notes}</div>}
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button onClick={()=>{ setEditing(i.id); setForm({ bath_date:i.bath_date||'', place:i.place||'', notes:i.notes||'' }); }} style={{background:'#fff', border:'1px solid #ddd', padding:'6px 10px', borderRadius:8}}>Editar</button>
            <button onClick={async()=>{ if(!confirm('Excluir este banho?')) return; await axios.delete(`/api/bath/${i.id}`); setItems(items.filter(x=>x.id!==i.id)); }} style={{background:'#ffe6e6', color:'#a00', padding:'6px 10px', borderRadius:8}}>Excluir</button>
          </div>
          {editing===i.id && (
            <div style={{marginTop:12, display:'grid', gap:8}}>
              <label>
                <span style={{fontSize:12}}>Data</span>
                <input type="date" value={form.bath_date} onChange={e=>setForm({...form, bath_date:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Local</span>
                <input value={form.place} onChange={e=>setForm({...form, place:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <label>
                <span style={{fontSize:12}}>Notas</span>
                <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
              </label>
              <div style={{display:'flex', gap:8}}>
                <button onClick={async()=>{ const r=await axios.put(`/api/bath/${i.id}`, form); setItems(items.map(x=>x.id===i.id?r.data:x)); setEditing(null); }} style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8}}>Salvar</button>
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