import React, { useState } from 'react';
import axios from 'axios';
import { showAlert } from '../lib/alert';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function MedicationAdd(){
  const [medicationId, setMedicationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ showAlert('Informe o Pet ID no topo','error'); return; }
    if(!medicationId || !startDate){ showAlert('Preencha medicamento e data inicial','error'); return; }
    await axios.post(`/api/medications/${petId}`, { medication_catalog_id: medicationId, start_date: startDate, notes });
    showAlert('Medicamento salvo','success'); window.location.href = '/medications';
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Medicamento</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Medication Catalog ID</span>
        <input value={medicationId} onChange={e=>setMedicationId(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data inicial</span>
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
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