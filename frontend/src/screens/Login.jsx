import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const r = await axios.post('/api/auth/login', { email, password });
      const { token, user } = r.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setMsg('Login realizado com sucesso');
      setMsgType('success');
      setTimeout(()=>{ window.location.href = '/vaccines'; }, 700);
    }catch(err){
      setMsg('Credenciais inválidas');
      setMsgType('error');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card form-wrap" style={{maxWidth:420}}>
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Entrar</div>
      <form onSubmit={submit}>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>E-mail</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:12}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Senha</span>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
      <button disabled={loading} className="btn btn-primary" style={{width:'100%'}}>{loading?'Entrando...':'Entrar'}</button>
      </form>
      {msg && (
        <div style={{marginTop:12, padding:'10px 12px', borderRadius:8, fontSize:13,
          background: msgType==='error' ? '#ffe6e6' : '#e6ffea',
          color: msgType==='error' ? '#a00000' : '#106b2e',
          border: msgType==='error' ? '1px solid #ff9a9a' : '1px solid #9ee7b4'}}>{msg}</div>
      )}
      <div style={{marginTop:12, fontSize:12, color:'#555'}}>Dica: use <span style={{fontWeight:600}}>admin@admin.com</span> com senha <span style={{fontWeight:600}}>admin</span> para testar.</div>
      </div>
    </div>
  );
}