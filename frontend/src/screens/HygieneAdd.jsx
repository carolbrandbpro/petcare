import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function HygieneAdd(){
  const [kind, setKind] = useState('orelhas');
  const [status, setStatus] = useState('realizada');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ alert('Informe o Pet ID no topo'); return; }
    await axios.post(`/api/hygiene/${petId}`, { kind, status, event_date: eventDate, notes });
    alert('Higiene salva'); window.location.href = '/hygiene';
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Higiene</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Tipo</span>
        <select value={kind} onChange={e=>setKind(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
          <option value="orelhas">Orelhas</option>
          <option value="unhas">Unhas</option>
          <option value="dentes">Dentes</option>
        </select>
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Status</span>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
          <option value="realizada">Realizada</option>
          <option value="agendada">Agendada</option>
        </select>
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data</span>
        <input type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Notas</span>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={save} className="btn btn-primary">Salvar</button>
        <a href="/hygiene" className="btn btn-outline">Cancelar</a>
      </div>
      </div>
    </div>
  );
}