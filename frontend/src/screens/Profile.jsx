import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Profile(){
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(){
    const r = await api.get('/api/users/me');
    setProfile(r.data);
    setName(r.data?.name || '');
    setEmail(r.data?.email || '');
    setAvatarUrl(r.data?.avatar_url || '');
  }
  useEffect(()=>{ load(); },[]);

  async function save(){
    setLoading(true);
    try{
      const r = await api.put('/api/users/me', { name, avatar_url: avatarUrl });
      setProfile(r.data);
      localStorage.setItem('user', JSON.stringify(r.data));
      window.dispatchEvent(new Event('user-updated'));
      setMsg('Perfil atualizado'); setMsgType('success');
    }catch{ setMsg('Falha ao salvar perfil'); setMsgType('error'); }
    finally{ setLoading(false); }
  }

  async function changePassword(){
    setLoading(true);
    try{
      await api.put('/api/users/password', { currentPassword, newPassword });
      setMsg('Senha alterada'); setMsgType('success');
      setCurrentPassword(''); setNewPassword('');
    }catch(err){
      const code = err?.response?.data?.error;
      setMsg(code==='invalid_current_password' ? 'Senha atual inválida' : 'Falha ao alterar senha');
      setMsgType('error');
    }finally{ setLoading(false); }
  }

  async function onPickFile(e){
    const f = e.target.files?.[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = async ()=>{
      const dataUrl = reader.result;
      const r = await api.post('/api/users/avatar', { dataUrl });
      setAvatarUrl(r.data.avatar_url);
      await save();
    };
    reader.readAsDataURL(f);
  }

  function googleInfo(){
    const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if(!cid){ setMsg('Configure VITE_GOOGLE_CLIENT_ID'); setMsgType('error'); return; }
    const w = window;
    if(!w.google){
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = googleInfo; document.head.appendChild(s);
      return;
    }
    const client = w.google.accounts.oauth2.initTokenClient({
      client_id: cid,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: async (resp)=>{
        const token = resp.access_token;
        const me = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${token}` } });
        const data = await me.json();
        setName(data.name || name);
        setEmail(data.email || email);
        setAvatarUrl(data.picture || avatarUrl);
      }
    });
    client.requestAccessToken();
  }

  return (
    <div className="page-center">
      <div className="card" style={{width:'100%', maxWidth:560}}>
        <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Meu Perfil</div>
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
          <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name||'Usuario')}&background=FF7A00&color=fff&size=64&rounded=true`} alt="Avatar" style={{width:64, height:64, borderRadius:'50%', objectFit:'cover', background:'#eee'}} />
          <div style={{display:'flex', gap:8}}>
            <label className="btn btn-outline" style={{cursor:'pointer'}}>
              Carregar foto
              <input type="file" accept="image/*" style={{display:'none'}} onChange={onPickFile} />
            </label>
            <button className="btn btn-outline" onClick={googleInfo}>Conectar Google</button>
          </div>
        </div>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Nome</span>
          <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:12}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>E-mail</span>
          <input value={email} readOnly style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8, background:'#f9f9f9'}} />
        </label>
        <div style={{display:'flex', gap:8}}>
          <button disabled={loading} className="btn btn-primary" onClick={save}>Salvar</button>
        </div>
        <hr style={{margin:'16px 0', border:'none', borderTop:'1px solid #eee'}} />
        <div style={{fontSize:14, fontWeight:600, marginBottom:8}}>Trocar senha</div>
        <label style={{display:'block', marginBottom:8}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Senha atual</span>
          <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <label style={{display:'block', marginBottom:12}}>
          <span style={{display:'block', fontSize:12, marginBottom:4}}>Nova senha</span>
          <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:8}} />
        </label>
        <button disabled={loading} className="btn btn-outline" onClick={changePassword}>Alterar senha</button>
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