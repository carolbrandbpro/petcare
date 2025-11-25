import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Pill, Syringe, ClipboardList, Bug, Bath, Bell, Link as LinkIcon, CalendarDays, TrendingUp, Sparkles, Power, Menu as MenuIcon } from 'lucide-react';
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
    <div className={`app-shell ${isSideMenuOpen ? 'menu-expanded' : ''}`} style={{fontFamily:'Inter, system-ui, Arial', padding:20}}>
      <header className="app-header">
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          {user && (
            <button className="btn btn-outline mobile-only" onClick={()=>setIsSideMenuOpen(v=>!v)} style={{padding:'8px 12px', display:'inline-flex', alignItems:'center', gap:6}}><MenuIcon size={18} /> Menu</button>
          )}
          <Link to="/" style={{color:'#fff', textDecoration:'none'}}><h1 className="app-title">PetCare — Demo</h1></Link>
        </div>
        {user && (
          <nav className="app-nav desktop-only" style={{display:'flex', gap:8, overflowX:'auto'}}>
            <NavLink to="/medications" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><Pill size={16} /></span>
                <span>Medicamentos</span>
              </span>
            </NavLink>
            <NavLink to="/vaccines" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><Syringe size={16} /></span>
                <span>Vacinas</span>
              </span>
            </NavLink>
            <NavLink to="/exams" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><ClipboardList size={16} /></span>
                <span>Exames</span>
              </span>
            </NavLink>
            <NavLink to="/fleas" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><Bug size={16} /></span>
                <span>Antipulgas e Carrapatos</span>
              </span>
            </NavLink>
            <NavLink to="/bath" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><Bath size={16} /></span>
                <span>Banho</span>
              </span>
            </NavLink>
            <NavLink to="/reminders" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><Bell size={16} /></span>
                <span>Lembretes</span>
              </span>
            </NavLink>
            <NavLink to="/share" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><LinkIcon size={16} /></span>
                <span>Compartilhar</span>
              </span>
            </NavLink>
            <NavLink to="/consultations" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><CalendarDays size={16} /></span>
                <span>Consultar</span>
              </span>
            </NavLink>
            <NavLink to="/weight" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><TrendingUp size={16} /></span>
                <span>Controle de Peso</span>
              </span>
            </NavLink>
            <NavLink to="/hygiene" style={({isActive})=>({padding:'8px 12px', borderRadius:8, background:isActive?'#fff':'transparent', color:isActive?'#000':'#fff'})}>
              <span className="nav-link" style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <span className="nav-icon"><Sparkles size={16} /></span>
                <span>Higiene</span>
              </span>
            </NavLink>
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
      {user && (
        <aside className={`side-menu mobile-only ${isSideMenuOpen ? 'expanded' : 'collapsed'}`}>
          <nav>
            <NavLink to="/medications" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><Pill size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Medicamentos</span>}
            </NavLink>
            <NavLink to="/vaccines" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><Syringe size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Vacinas</span>}
            </NavLink>
            <NavLink to="/exams" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><ClipboardList size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Exames</span>}
            </NavLink>
            <NavLink to="/fleas" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><Bug size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Antipulgas</span>}
            </NavLink>
            <NavLink to="/bath" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><Bath size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Banho</span>}
            </NavLink>
            <NavLink to="/reminders" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><Bell size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Lembretes</span>}
            </NavLink>
            <NavLink to="/share" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><LinkIcon size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Compartilhar</span>}
            </NavLink>
            <NavLink to="/consultations" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><CalendarDays size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Consultar</span>}
            </NavLink>
            <NavLink to="/weight" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><TrendingUp size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Peso</span>}
            </NavLink>
            <NavLink to="/hygiene" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>setIsSideMenuOpen(false)}>
              <span className="side-icon"><Sparkles size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Higiene</span>}
            </NavLink>
            <button className="side-item" onClick={()=>{ setIsSideMenuOpen(false); logout(); }}>
              <span className="side-icon"><Power size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Sair</span>}
            </button>
          </nav>
        </aside>
      )}
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
