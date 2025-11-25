import React from 'react';
export default function ShareSettings(){
  return (
    <div style={{maxWidth:560, background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>
      <div style={{fontSize:18, fontWeight:600, marginBottom:12}}>Compartilhar</div>
      <label style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <span>Somente leitura</span>
        <input type="checkbox" />
      </label>
      <label style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <span>Permitir novos compartilhamentos</span>
        <input type="checkbox" />
      </label>
      <label style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
        <span>Limitar compartilhamento</span>
        <input type="checkbox" defaultChecked />
      </label>
      <button style={{background:'#FF7A00', color:'#fff', padding:'8px 12px', borderRadius:8}}>Compartilhar</button>
    </div>
  );
}