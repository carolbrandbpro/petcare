import React, { useState } from 'react';
import api from '../lib/api';

export default function Register(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const name = `${firstName} ${lastName}`.trim();
      const r = await api.post('/api/auth/register', { email: email.trim().toLowerCase(), password, name, phone });
      setMsg('Conta criada! Você já pode fazer login.');
      setMsgType('success');
    }catch(err){
      setMsg('Falha ao criar conta');
      setMsgType('error');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card form-wrap" style={{maxWidth:480}}>
        <div style={{fontSize:22, fontWeight:700, color:'var(--color-primary)', marginBottom:10}}>Crie uma conta</div>
        <form onSubmit={submit}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <input placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} style={{padding:8, border:'1px solid #ddd', borderRadius:8}} />
            <input placeholder="Sobrenome" value={lastName} onChange={e=>setLastName(e.target.value)} style={{padding:8, border:'1px solid #ddd', borderRadius:8}} />
          </div>
          <input placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{marginTop:8, width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
          <input placeholder="Telefone com DDD" value={phone} onChange={e=>setPhone(e.target.value)} style={{marginTop:8, width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
          <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginTop:8, width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
          <label style={{display:'flex', gap:8, alignItems:'flex-start', marginTop:10}}>
            <input type="checkbox" checked={acceptTerms} onChange={e=>setAcceptTerms(e.target.checked)} />
            <span>Aceito os termos e condições de uso</span>
          </label>
          <label style={{display:'flex', gap:8, alignItems:'flex-start'}}>
            <input type="checkbox" checked={acceptPrivacy} onChange={e=>setAcceptPrivacy(e.target.checked)} />
            <span>Aceito a política de privacidade</span>
          </label>
          <button disabled={loading || !acceptTerms || !acceptPrivacy || !email || !password || !firstName} className="btn btn-primary" style={{marginTop:12, width:'100%'}}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
        {msg && (
          <div style={{marginTop:12, padding:'10px 12px', borderRadius:8, fontSize:13,
            background: msgType==='error' ? '#ffe6e6' : '#e6ffea',
            color: msgType==='error' ? '#a00000' : '#106b2e',
            border: msgType==='error' ? '1px solid #ff9a9a' : '1px solid #9ee7b4'}}>{msg}</div>
        )}
      </div>
    </div>
  );
}