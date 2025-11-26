import React from 'react';

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')||'null') : null;
  return (
    <div style={{display:'grid', gap:18}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <button className="mobile-only btn btn-outline" aria-label="Abrir menu" onClick={()=>document.querySelector('.side-menu')?.classList.add('expanded')}>
          <span className="nav-icon">≡</span>
        </button>
        <div style={{fontSize:22, fontWeight:700, color:'#FF7A00'}}>Olá {user?.name?.split(' ')[0] || 'Usuário'}</div>
      </div>

      <section className="card" style={{display:'grid', gap:10}}>
        <div style={{fontSize:18, fontWeight:700, color:'#FF7A00'}}>Meus Pets</div>
        <div style={{fontSize:15, color:'#222'}}>Você ainda não registrou seu pet</div>
        <a href="/pets/new" className="btn btn-primary" style={{width:240, textAlign:'center'}}>ADICIONAR NOVO PET  +</a>
      </section>

      <section style={{background:'#f3f3f3', padding:14, borderRadius:12}}>
        <div style={{fontSize:18, fontWeight:700, color:'#FF7A00', marginBottom:10}}>Eventos Agendados</div>
        <div className="card" style={{display:'flex', alignItems:'center', gap:10}}>
          <span style={{color:'#FF7A00', fontSize:20}}>☑</span>
          <span>Parece que você não tem nenhum evento agendado.</span>
        </div>
      </section>

      <section>
        <div style={{fontSize:18, fontWeight:700, color:'#FF7A00', marginBottom:8}}>O que você está procurando?</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:12}}>
          <div className="card" style={{display:'grid', gap:10}}>
            <img src="https://placekitten.com/120/120" alt="Produtos" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', justifySelf:'center'}} />
            <div style={{fontWeight:700, textAlign:'center'}}>Produtos</div>
            <div style={{fontSize:13, color:'#555', textAlign:'center'}}>Toda a linha de produtos pet sem sair de casa!</div>
            <button className="btn btn-outline" style={{justifySelf:'center'}}>Ver mais</button>
          </div>
          <div className="card" style={{display:'grid', gap:10}}>
            <img src="https://place-puppy.com/120x120" alt="Serviços" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', justifySelf:'center'}} />
            <div style={{fontWeight:700, textAlign:'center'}}>Serviços</div>
            <div style={{fontSize:13, color:'#555', textAlign:'center'}}>Creches, hotéis e veterinários perto da sua casa!</div>
            <button className="btn btn-outline" style={{justifySelf:'center'}}>Ver mais</button>
          </div>
        </div>
      </section>

      <section>
        <div style={{fontSize:18, fontWeight:700, color:'#FF7A00', marginBottom:8}}>Fique informado</div>
        <div style={{display:'flex', gap:12, overflowX:'auto', paddingBottom:4}}>
          {['Notícias','Blog','Aprenda'].map((t)=> (
            <div key={t} className="card tile" style={{minWidth:220, height:120, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center'}}>{t}</div>
          ))}
        </div>
      </section>
    </div>
  );
}