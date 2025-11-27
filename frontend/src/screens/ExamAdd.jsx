import React, { useState } from 'react';
import axios from 'axios';
import { showAlert } from '../lib/alert';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function ExamAdd(){
  const [title, setTitle] = useState('Exame');
  const [examDate, setExamDate] = useState('');
  const [notes, setNotes] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ showAlert('Informe o Pet ID no topo','error'); return; }
    if(!title){ showAlert('Preencha o título','error'); return; }
    await axios.post(`/api/exams/${petId}`, { title, exam_date: examDate, notes });
    showAlert('Exame salvo','success'); window.location.href = '/exams';
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Exame</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Título</span>
        <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data</span>
        <input type="date" value={examDate} onChange={e=>setExamDate(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
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