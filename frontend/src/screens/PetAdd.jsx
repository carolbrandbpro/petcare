import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function PetAdd(){
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [birth, setBirth] = useState('');

  async function save(){
    try{
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const r = await axios.post('/api/pets', { name, species, breed, birth_date: birth }, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
      const pet = r.data;
      localStorage.setItem('petId', pet.id);
      alert('Pet criado');
      window.location.href = '/vaccines';
    }catch(err){
      alert('Erro ao criar pet (verifique login)');
    }
  }

  return (
    <div style={{maxWidth:560, background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
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
        <a href="/" className="btn btn-outline">Cancelar</a>
      </div>
    </div>
  );
}