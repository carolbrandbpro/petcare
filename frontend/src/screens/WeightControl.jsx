import React from 'react';
export default function WeightControl(){
  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{fontSize:18, fontWeight:600}}>Controle de Peso</div>
      <div style={{background:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', padding:16}}>Sem registros de peso.</div>
    </div>
  );
}