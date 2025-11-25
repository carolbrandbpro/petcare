import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function BathAdd(){
  const [bathDate, setBathDate] = useState('');
  const [place, setPlace] = useState('');
  const [notes, setNotes] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ alert('Informe o Pet ID no topo'); return; }
    await axios.post(`/api/bath/${petId}`, { bath_date: bathDate, place, notes });
    alert('Banho salvo'); window.location.href = '/bath';
  }

  return (
    <div style={{maxWidth:560, background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Banho</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data</span>
        <input type="date" value={bathDate} onChange={e=>setBathDate(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Local</span>
        <input value={place} onChange={e=>setPlace(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Notas</span>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={save} style={{background:'#FF7A00', color:'#fff', padding:'8px 12px', borderRadius:8}}>Salvar</button>
        <a href="/bath" style={{background:'#fff', border:'1px solid #ddd', padding:'8px 12px', borderRadius:8}}>Cancelar</a>
      </div>
    </div>
  );
}