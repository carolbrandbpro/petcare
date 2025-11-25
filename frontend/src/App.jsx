import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import VaccinesList from './screens/VaccinesList';
import VaccineAdd from './screens/VaccineAdd';
import MedicationsList from './screens/MedicationsList';
import MedicationAdd from './screens/MedicationAdd';
import Login from './screens/Login';
import Home from './screens/Home';
import ExamsList from './screens/ExamsList';
import ExamAdd from './screens/ExamAdd';
import FleaTickList from './screens/FleaTickList';
import FleaTickAdd from './screens/FleaTickAdd';
import BathList from './screens/BathList';
import BathAdd from './screens/BathAdd';
import ShareSettings from './screens/ShareSettings';
import ConsultationsList from './screens/ConsultationsList';
import WeightControl from './screens/WeightControl';
import HygieneList from './screens/HygieneList';
import HygieneAdd from './screens/HygieneAdd';
import PetAdd from './screens/PetAdd';
import RemindersList from './screens/RemindersList';
import ConsultationAdd from './screens/ConsultationAdd';

export default function App(){ 
  const [petId, setPetId] = useState('');
  const [user, setUser] = useState(null);
  useEffect(()=>{ 
    const v = localStorage.getItem('petId'); if(v) setPetId(v);
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    const envBase = import.meta.env.VITE_API_URL;
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    let apiBase = envBase || `http://${host}:4001`;
    if(host.startsWith('172.')) apiBase = 'http://localhost:4001';
    axios.defaults.baseURL = apiBase;
    if(t) axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    if(u) setUser(JSON.parse(u));
  },[]);
  function handlePetIdChange(e){ const v = e.target.value; setPetId(v); localStorage.setItem('petId', v); }
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); delete axios.defaults.headers.common['Authorization']; setUser(null); }
  return (
    <div style={{fontFamily:'Inter, system-ui, Arial', padding:20}}>
      <header className="app-header">
        <Link to="/" style={{color:'#fff', textDecoration:'none'}}><h1 className="app-title">PetCare — Demo</h1></Link>
        {user && (
          <nav className="app-nav" style={{display:'flex', gap:8, overflowX:'auto'}}>
            <NavLink to="/medications" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Medicamentos</NavLink>
            <NavLink to="/vaccines" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Vacinas</NavLink>
            <NavLink to="/exams" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Exames</NavLink>
            <NavLink to="/fleas" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Antipulgas e Carrapatos</NavLink>
            <NavLink to="/bath" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Banho</NavLink>
            <NavLink to="/reminders" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Lembretes</NavLink>
            <NavLink to="/share" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Compartilhar</NavLink>
            <NavLink to="/consultations" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Consultar</NavLink>
            <NavLink to="/weight" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Controle de Peso</NavLink>
            <NavLink to="/hygiene" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>Higiene</NavLink>
            <button onClick={logout} style={{padding:'8px 12px', borderRadius:8, background:'#fff', color:'#000'}}>Sair</button>
          </nav>
        )}
        {user && (
          <div style={{display:'flex', alignItems:'center', gap:8, background:'#fff', color:'#000', padding:6, borderRadius:8, width:'100%', maxWidth:380}}>
            <span style={{fontSize:12}}>Pet ID</span>
            <input value={petId} onChange={handlePetIdChange} placeholder="UUID" style={{padding:6, width:220, border:'1px solid #ddd', borderRadius:6}} />
            <a href="/pets/new" style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8, textDecoration:'none'}}>Criar Pet</a>
          </div>
        )}
      </header>
      <main style={{marginTop:20}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/vaccines" element={<RequireAuth><VaccinesList /></RequireAuth>} />
          <Route path="/vaccines/new" element={<RequireAuth><VaccineAdd /></RequireAuth>} />
          <Route path="/medications" element={<RequireAuth><MedicationsList /></RequireAuth>} />
          <Route path="/medications/new" element={<RequireAuth><MedicationAdd /></RequireAuth>} />
          <Route path="/exams" element={<RequireAuth><ExamsList /></RequireAuth>} />
          <Route path="/exams/new" element={<RequireAuth><ExamAdd /></RequireAuth>} />
          <Route path="/fleas" element={<RequireAuth><FleaTickList /></RequireAuth>} />
          <Route path="/fleas/new" element={<RequireAuth><FleaTickAdd /></RequireAuth>} />
          <Route path="/bath" element={<RequireAuth><BathList /></RequireAuth>} />
          <Route path="/bath/new" element={<RequireAuth><BathAdd /></RequireAuth>} />
          <Route path="/share" element={<RequireAuth><ShareSettings /></RequireAuth>} />
          <Route path="/consultations" element={<RequireAuth><ConsultationsList /></RequireAuth>} />
          <Route path="/consultations/new" element={<RequireAuth><ConsultationAdd /></RequireAuth>} />
          <Route path="/weight" element={<RequireAuth><WeightControl /></RequireAuth>} />
          <Route path="/hygiene" element={<RequireAuth><HygieneList /></RequireAuth>} />
          <Route path="/hygiene/new" element={<RequireAuth><HygieneAdd /></RequireAuth>} />
          <Route path="/pets/new" element={<RequireAuth><PetAdd /></RequireAuth>} />
          <Route path="/reminders" element={<RequireAuth><RemindersList /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

function RequireAuth({ children }){
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if(!t) return <Navigate to="/login" replace />;
  return children;
}
