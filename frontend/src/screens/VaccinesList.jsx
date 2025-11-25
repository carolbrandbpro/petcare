import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function VaccinesList(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  useEffect(()=>{
    async function load(){
      if(!petId) return;
      setLoading(true);
      try{
        const r = await api.get(`/api/vaccines/${petId}`);
        setItems(r.data || []);
      } finally { setLoading(false); }
    }
    load();
  },[petId]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:18, fontWeight:600}}>Vacinas</div>
        <a href="/vaccines/new" className="btn btn-primary">Adicionar</a>
      </div>
      {!petId && <div style={{color:'#c00'}}>Informe o Pet ID no topo.</div>}
      {loading && <div>Carregando...</div>}
      {items.map(i=>(
        <div key={i.id} style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:600}}>{i.name}</div>
            <div style={{fontSize:12, color:'#555'}}>Aplicada {i.applied_date} • Próxima {i.next_due_date}</div>
            {i.notes && <div style={{fontSize:12}}>{i.notes}</div>}
          </div>
          <div style={{padding:'4px 10px', borderRadius:8, background:new Date(i.next_due_date) < new Date() ? '#fee' : '#e6ffee', color:new Date(i.next_due_date) < new Date() ? '#a00' : '#107010'}}>
            {new Date(i.next_due_date) < new Date() ? 'atrasada' : 'ok'}
          </div>
        </div>
      ))}
      {!loading && items.length===0 && petId && <div className="card" style={{color:'#555'}}>Sem registros de vacina.</div>}
    </div>
  );
}