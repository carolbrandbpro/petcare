import React from 'react';

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')||'null') : null;
  return (
    <div style={{display:'grid', gap:20}}>
      <div style={{fontSize:24, fontWeight:700, color:'#FF7A00'}}>Olá {user?.name || 'Usuário'}</div>
      <div className="card" style={{display:'grid', gap:8}}>
        <div style={{fontSize:18, fontWeight:600, color:'#FF7A00'}}>Meus Pets</div>
        <div style={{fontSize:14}}>Você ainda não registrou seu pet</div>
        <a href="/pets/new" className="btn btn-primary" style={{width:220, textAlign:'center'}}>Adicionar novo pet +</a>
      </div>
      <div className="card" style={{display:'grid', gap:8}}>
        <div style={{fontSize:18, fontWeight:600, color:'#FF7A00'}}>Eventos Agendados</div>
        <div style={{fontSize:14}}>Parece que você não tem nenhum evento agendado.</div>
      </div>
      <div>
        <div style={{fontSize:18, fontWeight:700, color:'#FF7A00', marginBottom:8}}>O que você está procurando?</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:12}}>
          <div className="card" style={{display:'grid', gap:6}}>
            <div style={{fontWeight:600}}>Produtos</div>
            <div style={{fontSize:13, color:'#555'}}>Toda a linha de produtos pet sem sair de casa!</div>
            <button className="btn btn-outline">Ver mais</button>
          </div>
          <div className="card" style={{display:'grid', gap:6}}>
            <div style={{fontWeight:600}}>Serviços</div>
            <div style={{fontSize:13, color:'#555'}}>Creches, hotéis e veterinários perto da sua casa!</div>
            <button className="btn btn-outline">Ver mais</button>
          </div>
          <div className="card" style={{display:'grid', gap:6}}>
            <div style={{fontWeight:600}}>Fique informado</div>
            <div style={{fontSize:13, color:'#555'}}>Notícias, Blog e Aprenda</div>
            <button className="btn btn-outline">Ver mais</button>
          </div>
        </div>
      </div>
    </div>
  );
}