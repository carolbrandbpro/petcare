import React, {useState} from 'react';
import axios from 'axios';
import { showAlert } from '../lib/alert';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function VaccineForm({petId, onSaved}) {
  const [vaccineId, setVaccineId] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    if(!petId){ showAlert('Informe o Pet ID','error'); return; }
    try{
      await axios.post(`/api/vaccines/${petId}`, { vaccine_catalog_id: vaccineId, applied_date: appliedDate, notes });
      setVaccineId(''); setAppliedDate(''); setNotes('');
      if(onSaved) onSaved();
      showAlert('Vacina registrada','success');
    }catch(err){
      showAlert('Erro ao salvar (backend não rodando?)','error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{padding:16, border:'1px solid #eee', borderRadius:8, maxWidth:480}}>
      <label style={{display:'block', marginBottom:8}}>
        Vacina
        <input value={vaccineId} onChange={e=>setVaccineId(e.target.value)} required style={{width:'100%', padding:8, marginTop:6}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        Data aplicada
        <input type="date" value={appliedDate} onChange={e=>setAppliedDate(e.target.value)} required style={{width:'100%', padding:8, marginTop:6}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        Notas
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%', padding:8, marginTop:6}} />
      </label>
      <button className="btn btn-primary">Salvar</button>
    </form>
  );
}
