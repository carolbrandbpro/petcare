import React, { useState } from 'react';
import api from '../lib/api';
import { showAlert } from '../lib/alert';

export default function ConsultationAdd(){
  const [title, setTitle] = useState('Consulta');
  const [startAt, setStartAt] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ showAlert('Informe o Pet ID no topo','error'); return; }
    if(!title || !startAt){ showAlert('Preencha título e data/hora','error'); return; }
    await api.post(`/api/appointments/${petId}`, { title, description, start_at: startAt, location });
    showAlert('Consulta salva','success'); window.location.href = '/consultations';
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Consulta</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Título</span>
        <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data/hora</span>
        <input type="datetime-local" value={startAt} onChange={e=>setStartAt(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Local</span>
        <input value={location} onChange={e=>setLocation(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Descrição</span>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={save} className="btn btn-primary">Salvar</button>
        <a href="/dashboard" className="btn btn-outline">Cancelar</a>
      </div>
      </div>
    </div>
  );
}