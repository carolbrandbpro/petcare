import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function RemindersList(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  useEffect(()=>{
    async function load(){
      if(!petId) return;
      setLoading(true);
      try{
        const r = await axios.get(`/api/reminders/${petId}`);
        setItems(r.data || []);
      } finally { setLoading(false); }
    }
    load();
  },[petId]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{fontSize:18, fontWeight:600}}>Lembretes</div>
      {!petId && <div style={{color:'#c00'}}>Informe o Pet ID no topo.</div>}
      {loading && <div>Carregando...</div>}
      {items.map(i=> (
        <div key={i.id} style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
          <div style={{fontWeight:600}}>{i.title}</div>
          <div style={{fontSize:12, color:'#555'}}>{i.type} • Próximo {i.next_trigger || '-'}</div>
          {i.description && <div style={{fontSize:12}}>{i.description}</div>}
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button onClick={async()=>{ const r=await axios.post(`/api/reminders/${i.id}/complete`); setItems(items.map(x=>x.id===i.id?r.data:x)); }} style={{background:'#e8ffe8', color:'#0a0', padding:'6px 10px', borderRadius:8}}>Concluir</button>
            <button onClick={async()=>{ const r=await axios.post(`/api/reminders/${i.id}/snooze`, { days: 7 }); setItems(items.map(x=>x.id===i.id?r.data:x)); }} style={{background:'#fff7e6', color:'#a06000', padding:'6px 10px', borderRadius:8}}>Adiar 7d</button>
          </div>
        </div>
      ))}
      {!loading && items.length===0 && petId && <div style={{color:'#555'}}>Sem lembretes.</div>}
    </div>
  );
}