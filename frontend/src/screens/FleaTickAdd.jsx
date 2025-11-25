import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function FleaTickAdd(){
  const [product, setProduct] = useState('');
  const [status, setStatus] = useState('aplicada');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');
  const petId = typeof window !== 'undefined' ? localStorage.getItem('petId') || '' : '';

  async function save(){
    if(!petId){ alert('Informe o Pet ID no topo'); return; }
    if(!product){ alert('Preencha o produto'); return; }
    await axios.post(`/api/fleas/${petId}`, { product, status, applied_date: appliedDate, notes });
    alert('Registro salvo'); window.location.href = '/fleas';
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Adicionar Antipulgas/Carrapatos</div>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Produto</span>
        <input value={product} onChange={e=>setProduct(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Status</span>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
          <option value="aplicada">Aplicada</option>
          <option value="programada">Programada</option>
        </select>
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Data</span>
        <input type="date" value={appliedDate} onChange={e=>setAppliedDate(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <label style={{display:'block', marginBottom:8}}>
        <span style={{display:'block', fontSize:12, marginBottom:4}}>Notas</span>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
      </label>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={save} className="btn btn-primary">Salvar</button>
        <a href="/fleas" className="btn btn-outline">Cancelar</a>
      </div>
      </div>
    </div>
  );
}