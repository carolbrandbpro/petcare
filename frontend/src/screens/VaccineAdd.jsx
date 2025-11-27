import React, { useState } from 'react';
import api from '../lib/api';
import { showAlert } from '../lib/alert';

export default function VaccineAdd(){
  const [vaccineId, setVaccineId] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ showAlert('Informe o Pet ID no topo','error'); return; }
    if(!vaccineId || !appliedDate){ showAlert('Preencha vacina e data','error'); return; }
    await api.post(`/api/vaccines/${petId}`, { vaccine_catalog_id: vaccineId, applied_date: appliedDate, notes });
    showAlert('Vacina salva','success'); window.location.href = '/vaccines';
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Vacina</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Vaccine Catalog ID</span>
        <input value={vaccineId} onChange={e=>setVaccineId(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data aplicada</span>
        <input type="date" value={appliedDate} onChange={e=>setAppliedDate(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Notas</span>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={save} className="btn btn-primary">Salvar</button>
        <a href="/dashboard" className="btn btn-outline">Cancelar</a>
      </div>
      </div>
    </div>
  );
}