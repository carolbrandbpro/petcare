import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome(){
  const nav = useNavigate();
  return (
    <div className="page-center" style={{textAlign:'center'}}>
      <div style={{display:'grid', gap:16, justifyItems:'center', width:'100%'}}>
        <div style={{fontSize:20, color:'#FF7A00'}}>Bem-vindo ao</div>
        <div style={{fontSize:36, fontWeight:800, color:'#FF7A00'}}>PetCare</div>
        <div className="card" style={{display:'grid', gap:12, width:'100%', maxWidth:480}}>
          <button className="btn btn-outline" onClick={()=>nav('/login')}>Entrar</button>
          <button className="btn btn-primary" onClick={()=>nav('/register')}>Criar Conta</button>
        </div>
      </div>
    </div>
  );
}