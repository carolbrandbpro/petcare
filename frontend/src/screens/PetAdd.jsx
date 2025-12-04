import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { showAlert } from '../lib/alert';

export default function PetAdd(){
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [birth, setBirth] = useState('');
  const [photo, setPhoto] = useState(null);
  const [sex, setSex] = useState('');
  const [coat, setCoat] = useState('');
  const [color, setColor] = useState('');
  const [neutered, setNeutered] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const id = params.get('id');
    if(id){
      setEditingId(id);
      (async ()=>{
        try{
          const r = await api.get(`/api/pets/${id}`);
          const p = r.data||{};
          setName(p.name||'');
          setSpecies(p.species||'');
          setBreed(p.breed||'');
          setBirth(p.birth_date||'');
          setSex(p.sex||'');
          setCoat(p.coat||'');
          setColor(p.color||'');
          setNeutered(!!p.neutered);
        }catch{}
      })();
    }
  },[]);

  async function save(){
    try{
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      let birthIso = null;
      if(birth){
        if(/\//.test(birth)){
          const [d,m,y] = birth.split('/');
          if(d && m && y) birthIso = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        }else{
          birthIso = birth;
        }
      }
      const payload = { name, species, breed, birth_date: birthIso, sex, coat, color, neutered };
      const r = editingId ? await api.put(`/api/pets/${editingId}`, payload) : await api.post('/api/pets', payload);
      const pet = r.data;
      localStorage.setItem('petId', pet.id);
      if(photo){
        const dataUrl = await new Promise((resolve, reject)=>{ const fr = new FileReader(); fr.onload = ()=>resolve(fr.result); fr.onerror = reject; fr.readAsDataURL(photo); });
        await api.post(`/api/pets/${pet.id}/avatar`, { dataUrl });
      }
      showAlert(editingId ? 'Pet atualizado' : 'Pet criado', 'success');
      window.location.href = '/vaccines';
    }catch(err){
      showAlert('Erro ao salvar pet (verifique login)', 'error');
    }
  }

  async function remove(){
    if(!editingId) return;
    const ok = typeof window !== 'undefined' ? window.confirm('Tem certeza que deseja excluir este pet?') : false;
    if(!ok) return;
    try{
      await api.delete(`/api/pets/${editingId}`);
      showAlert('Pet excluído', 'success');
      window.location.href = '/dashboard';
    }catch(err){
      showAlert('Erro ao excluir pet', 'error');
    }
  }

  return (
    <div className="page-center">
      <div className="card form-wrap">
        <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>{editingId ? 'Editar Pet' : 'Cadastrar Pet'}</div>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Foto (opcional)</span>
          <input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0]||null)} />
        </label>
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
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Sexo</span>
          <select value={sex} onChange={e=>setSex(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
            <option value="">Selecione</option>
            <option value="Fêmea">Fêmea</option>
            <option value="Macho">Macho</option>
          </select>
        </label>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Pelagem</span>
          <select value={coat} onChange={e=>setCoat(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}}>
            <option value="">Selecione</option>
            <option value="Curta">Curta</option>
            <option value="Longa">Longa</option>
            <option value="Dupla Pelagem">Dupla Pelagem</option>
            <option value="Sem pelo">Sem pelo</option>
            <option value="Ondulada">Ondulada</option>
          </select>
        </label>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Cor</span>
          <input value={color} onChange={e=>setColor(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:8}}>
          <label style={{display:'flex', gap:6, alignItems:'center'}}>
            <input type="checkbox" checked={neutered} onChange={e=>setNeutered(e.target.checked)} />
            <span>Castrado</span>
          </label>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
          <div style={{display:'flex', gap:8}}>
            <button onClick={save} className="btn btn-primary">Salvar</button>
            <a href="/dashboard" className="btn btn-outline-primary">Cancelar</a>
          </div>
          {editingId && (
            <button onClick={remove} className="btn btn-danger" style={{marginLeft:'auto'}}>Excluir</button>
          )}
        </div>
      </div>
    </div>
  );
}