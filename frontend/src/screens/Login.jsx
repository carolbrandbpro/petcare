import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const r = await api.post('/api/auth/login', { email: email.trim().toLowerCase(), password: password.trim() });
      const { token, user } = r.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setMsg('Login realizado com sucesso');
      setMsgType('success');
      setTimeout(()=>{ window.location.href = '/dashboard'; }, 700);
    }catch(err){
      const code = err?.response?.data?.error;
      if(code==='too_many_attempts'){
        const secs = err?.response?.data?.retryAfterSeconds || 60;
        const mins = Math.ceil(secs/60);
        setMsg(`Muitas tentativas. Aguarde ${mins} min e tente novamente.`);
        setMsgType('error');
      }else{
        setMsg('Credenciais inválidas');
        setMsgType('error');
      }
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div style={{fontSize:22, fontWeight:700, color:'var(--color-primary)', marginBottom:10}}>PetCare — Demo</div>
      <div className="card form-wrap" style={{maxWidth:420}}>
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Entrar</div>
      <form onSubmit={submit}>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>E-mail</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:12}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Senha</span>
          <div style={{position:'relative'}}>
            <input type={showPass ? 'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:'8px 38px 8px 8px', border:'1px solid #ddd', borderRadius:8}} />
            <button type="button" onClick={()=>setShowPass(v=>!v)} aria-label="Mostrar/ocultar senha" title={showPass?'Ocultar senha':'Mostrar senha'} style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', padding:4, display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
    </div>
  );
}