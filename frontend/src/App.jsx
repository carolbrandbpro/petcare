import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Pill, Syringe, ClipboardList, Bug, Bath, Bell, Link as LinkIcon, CalendarDays, TrendingUp, Sparkles, Power, Menu as MenuIcon, User } from 'lucide-react';
import Profile from './screens/Profile';
import VaccinesList from './screens/VaccinesList';
import VaccineAdd from './screens/VaccineAdd';
import MedicationsList from './screens/MedicationsList';
import MedicationAdd from './screens/MedicationAdd';
import Login from './screens/Login';
import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Dashboard from './screens/Dashboard';
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
  const [user, setUser] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const isLoginRoute = (typeof window !== 'undefined') && ([ '/login', '/register' ].includes(window.location.pathname));
  useEffect(()=>{ 
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
      const onOpen = ()=> setIsSideMenuOpen(true);
      const onClose = ()=> setIsSideMenuOpen(false);
      window.addEventListener('open-menu', onOpen);
      window.addEventListener('close-menu', onClose);
      return ()=> { window.removeEventListener('resize', onResize); window.removeEventListener('open-menu', onOpen); window.removeEventListener('close-menu', onClose); };
    }
  },[]);
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); delete axios.defaults.headers.common['Authorization']; setUser(null); }
  return (
    <div className={`app-shell ${isLoginRoute ? 'login-shell' : (isSideMenuOpen ? 'menu-expanded' : 'menu-collapsed')}`} style={{fontFamily:'Inter, system-ui, Arial', padding:20}}>
      {/* header removido conforme pedido */}
      {user && (
        <aside className={`side-menu ${isSideMenuOpen ? 'expanded' : 'collapsed'}`}
          onTouchStart={(e)=>{ if(!isMobile || !isSideMenuOpen) return; setTouchStartX(e.touches[0].clientX); setTouchDeltaX(0); }}
          onTouchMove={(e)=>{ if(touchStartX==null) return; setTouchDeltaX(e.touches[0].clientX - touchStartX); }}
          onTouchEnd={()=>{ if(touchDeltaX < -60) setIsSideMenuOpen(false); setTouchStartX(null); setTouchDeltaX(0); }}
        >
          <nav>
            {isSideMenuOpen && user && (
              <div className="side-header">
                <img src={(user.avatar_url && user.avatar_url.startsWith('/')) ? ((axios.defaults.baseURL||'') + user.avatar_url) : (user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'Usuario')}&background=03989F&color=fff&size=64&rounded=true`)} alt="Avatar" className="avatar" />
                <div className="side-user-meta">
                  <div className="side-user-name">{user.name || 'Usuário'}</div>
                  <div className="side-user-email">{user.email}</div>
                </div>
              </div>
            )}
            <NavLink to="/dashboard" className={({isActive})=>`side-item${isActive?' active':''} dashboard`} onClick={()=>{ if(typeof window!== 'undefined' && window.innerWidth < 1024) setIsSideMenuOpen(false); }} style={{background:'var(--color-secondary)', color:'#000'}}>
              <span className="side-icon"><CalendarDays size={18} /></span>
              {isSideMenuOpen && <span className="side-label">Dashboard</span>}
            </NavLink>
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
        <Routes>
          <Route path="/" element={<Welcome />} />
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
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<Welcome />} />
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
