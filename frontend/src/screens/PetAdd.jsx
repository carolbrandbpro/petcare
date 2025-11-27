import React, { useState } from 'react';
import api from '../lib/api';
import { showAlert } from '../lib/alert';

export default function PetAdd(){
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [birth, setBirth] = useState('');

  async function save(){
    try{
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await api.post('/api/pets', { name, species, breed, birth_date: birth });
      const pet = r.data;
      localStorage.setItem('petId', pet.id);
      showAlert('Pet criado', 'success');
      window.location.href = '/vaccines';
    }catch(err){
      showAlert('Erro ao criar pet (verifique login)', 'error');
    }
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
        <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Cadastrar Pet</div>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Nome</span>
          <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Espécie</span>
          <input value={species} onChange={e=>setSpecies(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Raça</span>
          <input value={breed} onChange={e=>setBreed(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Nascimento</span>
          <input type="date" value={birth} onChange={e=>setBirth(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button onClick={save} className="btn btn-primary">Salvar</button>
          <a href="/dashboard" className="btn btn-outline">Cancelar</a>
        </div>
      </div>
    </div>
  );
}