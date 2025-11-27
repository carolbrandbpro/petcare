import React, { useState } from 'react';
import { CalendarDays, Pencil, Share2 } from 'lucide-react';

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')||'null') : null;
  const [showAddPetSheet, setShowAddPetSheet] = useState(false);
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="mobile-only btn btn-outline" aria-label="Abrir menu" onClick={()=>{ const e = new Event('open-menu'); window.dispatchEvent(e); }}>
          <span className="nav-icon">≡</span>
        </button>
        <div style={{fontSize:22, fontWeight:700, color:'var(--color-primary)'}}>Olá {user?.name?.split(' ')[0] || 'Usuário'}</div>
      </div>

      <section className="card" style={{display:'grid', gap:10}}>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)'}}>Meus Pets</div>
        <div style={{fontSize:15, color:'#222'}}>Você ainda não registrou seu pet</div>
        <button onClick={()=>setShowAddPetSheet(true)} className="btn btn-primary" style={{width:240, textAlign:'center'}}>ADICIONAR NOVO PET  +</button>
      </section>

      <section style={{background:'#f3f3f3', padding:14, borderRadius:12}}>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:10}}>Eventos Agendados</div>
        <div className="card" style={{display:'flex', alignItems:'center', gap:10}}>
          <span style={{color:'var(--color-primary)', fontSize:20}}><CalendarDays size={20} /></span>
          <span>Parece que você não tem nenhum evento agendado.</span>
        </div>
      </section>

      <section>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:8}}>O que você está procurando?</div>
        <div className="dashboard-grid-2">
          <div className="card" style={{display:'grid', gap:10}}>
            <img src="https://picsum.photos/seed/petproducts/120" alt="Produtos" loading="lazy" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', justifySelf:'center'}} />
            <div style={{fontWeight:700, textAlign:'center'}}>Produtos</div>
            <div style={{fontSize:13, color:'#555', textAlign:'center'}}>Toda a linha de produtos pet sem sair de casa!</div>
            <button className="btn btn-outline" style={{justifySelf:'center'}}>Ver mais</button>
          </div>
          <div className="card" style={{display:'grid', gap:10}}>
            <img src="https://picsum.photos/seed/petservices/120" alt="Serviços" loading="lazy" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', justifySelf:'center'}} />
            <div style={{fontWeight:700, textAlign:'center'}}>Serviços</div>
            <div style={{fontSize:13, color:'#555', textAlign:'center'}}>Creches, hotéis e veterinários perto da sua casa!</div>
            <button className="btn btn-outline" style={{justifySelf:'center'}}>Ver mais</button>
          </div>
        </div>
      </section>

      <section>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:8}}>Fique informado</div>
        <div className="dashboard-tiles">
          {['Notícias','Blog','Aprenda'].map((t)=> (
            <div key={t} className="card tile" style={{minWidth:220, height:120, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center'}}>{t}</div>
          ))}
        </div>
      </section>

      {showAddPetSheet && (
        <>
          <div className="backdrop" onClick={()=>setShowAddPetSheet(false)} />
          <div style={{position:'fixed', left:0, right:0, bottom:0, background:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16, boxShadow:'0 -8px 24px rgba(0,0,0,0.18)', padding:16, zIndex:1001}}>
            <div style={{fontSize:16, fontWeight:700, marginBottom:10}}>Adicionar Pet</div>
            <button onClick={()=>{ setShowAddPetSheet(false); window.location.href='/pets/new'; }} className="side-item" style={{background:'#f8f8f8', color:'#000', width:'100%'}}>
              <span className="side-icon"><Pencil size={18} /></span>
              <span className="side-label">Criar um pet novo</span>
            </button>
            <button onClick={()=>{ setShowAddPetSheet(false); window.location.href='/share'; }} className="side-item" style={{background:'#f8f8f8', color:'#000', width:'100%'}}>
              <span className="side-icon"><Share2 size={18} /></span>
              <span className="side-label">Usar um código de compartilhamento</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}