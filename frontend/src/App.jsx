import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Pill, Syringe, ClipboardList, Bug, Bath, Bell, Link as LinkIcon, CalendarDays, TrendingUp, Sparkles, Power, Menu as MenuIcon, User } from 'lucide-react';
import Profile from './screens/Profile';
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
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  useEffect(()=>{ 
    const v = localStorage.getItem('petId'); if(v) setPetId(v);
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if(t) axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    if(u) setUser(JSON.parse(u));
  },[]);
  useEffect(()=>{ 
    if(typeof window !== 'undefined'){
      const isDesktop = window.innerWidth >= 1024;
      setIsSideMenuOpen(isDesktop);
    }
  },[]);
  useEffect(()=>{
    if(typeof window !== 'undefined'){
      const syncUser = ()=>{ const u = localStorage.getItem('user'); if(u) setUser(JSON.parse(u)); };
      window.addEventListener('user-updated', syncUser);
      return ()=> window.removeEventListener('user-updated', syncUser);
    }
  },[]);
  useEffect(()=>{
    if(typeof window !== 'undefined'){
      const m = window.innerWidth < 1024; setIsMobile(m);
      const onResize = ()=> setIsMobile(window.innerWidth < 1024);
      window.addEventListener('resize', onResize);
      return ()=> window.removeEventListener('resize', onResize);
    }
  },[]);
  function handlePetIdChange(e){ const v = e.target.value; setPetId(v); localStorage.setItem('petId', v); }
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); delete axios.defaults.headers.common['Authorization']; setUser(null); }
  return (
    <div className={`app-shell ${isSideMenuOpen ? 'menu-expanded' : 'menu-collapsed'}`} style={{fontFamily:'Inter, system-ui, Arial', padding:20}}>
      {!isLoginRoute && (
      <header className="app-header">
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          {user && (
            <button className="mobile-only btn btn-outline" aria-label="Abrir menu" onClick={()=>setIsSideMenuOpen(true)}>
              <MenuIcon size={18} />
            </button>
          )}
          <Link to="/" style={{color:'#fff', textDecoration:'none'}}><h1 className="app-title">PetCare — Demo</h1></Link>
        </div>
        {user && (
          <div style={{display:'flex', alignItems:'center', gap:8, background:'#fff', color:'#000', padding:6, borderRadius:8, width:'100%', maxWidth:380}}>
            <span style={{fontSize:12}}>Pet ID</span>
            <input value={petId} onChange={handlePetIdChange} placeholder="UUID" style={{padding:6, width:220, border:'1px solid #ddd', borderRadius:6}} />
            <a href="/pets/new" style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8, textDecoration:'none'}}>Criar Pet</a>
          </div>
        )}
      </header>
      )}
      {user && (
        <aside className={`side-menu ${isSideMenuOpen ? 'expanded' : 'collapsed'}`}
          onTouchStart={(e)=>{ if(!isMobile || !isSideMenuOpen) return; setTouchStartX(e.touches[0].clientX); setTouchDeltaX(0); }}
          onTouchMove={(e)=>{ if(touchStartX==null) return; setTouchDeltaX(e.touches[0].clientX - touchStartX); }}
          onTouchEnd={()=>{ if(touchDeltaX < -60) setIsSideMenuOpen(false); setTouchStartX(null); setTouchDeltaX(0); }}
        >
          <nav>
            {isSideMenuOpen && user && (
              <div className="side-header">
                <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'Usuario')}&background=FF7A00&color=fff&size=64&rounded=true`} alt="Avatar" className="avatar" />
                <div className="side-user-meta">
                  <div className="side-user-name">{user.name || 'Usuário'}</div>
                  <div className="side-user-email">{user.email}</div>
                </div>
              </div>
            )}
            <button className="side-item" onClick={()=>setIsSideMenuOpen(v=>!v)}>
              <span className="side-icon"><MenuIcon size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Menu</span>}
            </button>
            <NavLink to="/profile" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><User size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Meu Perfil</span>}
            </NavLink>
            <NavLink to="/medications" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><Pill size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Medicamentos</span>}
            </NavLink>
            <NavLink to="/vaccines" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><Syringe size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Vacinas</span>}
            </NavLink>
            <NavLink to="/exams" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><ClipboardList size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Exames</span>}
            </NavLink>
            <NavLink to="/fleas" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><Bug size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Antipulgas</span>}
            </NavLink>
            <NavLink to="/bath" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><Bath size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Banho</span>}
            </NavLink>
            <NavLink to="/reminders" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><Bell size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Lembretes</span>}
            </NavLink>
            <NavLink to="/share" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><LinkIcon size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Compartilhar</span>}
            </NavLink>
            <NavLink to="/consultations" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><CalendarDays size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Consultar</span>}
            </NavLink>
            <NavLink to="/weight" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
              <span className="side-icon"><TrendingUp size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Peso</span>}
            </NavLink>
            <NavLink to="/hygiene" className={({isActive})=>`side-item${isActive?' active':''}`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }}>
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
      {isMobile && isSideMenuOpen && (
        <div className="backdrop" onClick={()=>setIsSideMenuOpen(false)} />
      )}
      <main style={{marginTop:20}}>
        {user && (
          <div style={{display:'flex', alignItems:'center', gap:8, background:'#fff', color:'#000', padding:6, borderRadius:8, width:'100%', maxWidth:380}}>
            <span style={{fontSize:12}}>Pet ID</span>
            <input value={petId} onChange={handlePetIdChange} placeholder="UUID" style={{padding:6, width:220, border:'1px solid #ddd', borderRadius:6}} />
            <a href="/pets/new" style={{background:'#FF7A00', color:'#fff', padding:'6px 10px', borderRadius:8, textDecoration:'none'}}>Criar Pet</a>
          </div>
        )}
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
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
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
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login' || location.pathname === '/';
