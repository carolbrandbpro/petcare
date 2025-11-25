import React, { useEffect, useState } from 'react';

export default function Home(){
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(()=>{
    function onResize(){ setIsMobile(window.innerWidth < 768); }
    window.addEventListener('resize', onResize);
    return ()=>window.removeEventListener('resize', onResize);
  },[]);
  const wrap = { display:'grid', gap:28 };
  const section = { display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', alignItems:'center', gap:16, background:'#FFE7CC', borderRadius:16, padding:24 };
  const title = { color:'#FF7A00', fontSize:32, fontWeight:700, fontFamily:'Poppins, system-ui, sans-serif' };
  const bullets = { listStyle:'disc', paddingLeft:20, marginTop:12, color:'#333', lineHeight:1.6 };
  const phone = { justifySelf:'end', background:'#fff', borderRadius:24, boxShadow:'0 8px 24px rgba(0,0,0,0.08)', width:290, minHeight:360, padding:12, display:'grid', alignContent:'start', gap:8 };
  const bar = { background:'#FF7A00', color:'#fff', borderRadius:12, padding:'10px 12px', fontWeight:600 };

  return (
    <div style={{maxWidth:1000, margin:'0 auto', ...wrap}}>
      <div style={section}>
        <div>
          <div style={title}>Consultas</div>
          <ul style={bullets}>
            <li>Tenha as informações sobre as consultas na palma da mão.</li>
            <li>Anote as informações sobre cada consulta realizada.</li>
            <li>Anexe fotos das receitas médicas.</li>
            <li>Seja lembrado sobre a data de retorno com o período que escolher.</li>
          </ul>
        </div>
        <div style={phone}>
          <div style={bar}>Consultas</div>
          <div style={{fontSize:14, color:'#555'}}>Lista de consultas e retornos agendados.</div>
          <div style={{background:'#f9f9f9', border:'1px solid #eee', borderRadius:12, padding:10}}>
            <div style={{fontWeight:600}}>16 dez 2018</div>
            <div style={{fontSize:12}}>Veterinário: Dr Leonardo</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div>
          <div style={title}>Exames</div>
          <ul style={bullets}>
            <li>Registre cada exame realizado.</li>
            <li>Anexe os resultados através de foto ou arquivos.</li>
            <li>Tenha todo histórico para consultas futuras.</li>
            <li>Permita que seu veterinário acompanhe tudo.</li>
          </ul>
        </div>
        <div style={phone}>
          <div style={bar}>Exames</div>
          <div style={{fontSize:14, color:'#555'}}>Resultados e anexos organizados por data.</div>
          <div style={{background:'#f9f9f9', border:'1px solid #eee', borderRadius:12, padding:10}}>
            <div style={{fontWeight:600}}>02 ago 2019</div>
            <div style={{fontSize:12}}>1 arquivo anexado</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div>
          <div style={title}>Controle de Peso e Cio</div>
          <ul style={bullets}>
            <li>Mantenha um histórico das variações de peso do seu pet.</li>
            <li>Gráfico para acompanhar evolução e controle de dietas.</li>
            <li>Receba lembretes para cuidados durante o cio.</li>
            <li>Acompanhe datas ideais para reprodução.</li>
          </ul>
        </div>
        <div style={phone}>
          <div style={bar}>Peso</div>
          <div style={{height:160, borderRadius:12, background:'linear-gradient(180deg,#FFB66B33 0%,#FF7A0011 100%)', border:'1px solid #eee'}}></div>
          <div style={{fontSize:12, color:'#777'}}>Histórico de peso com gráfico.</div>
        </div>
      </div>

      <div style={section}>
        <div>
          <div style={title}>Banho, Tosa e Higiene</div>
          <ul style={bullets}>
            <li>Registre cada banho, tosa ou procedimento de higiene.</li>
            <li>Receba lembretes para os próximos cuidados.</li>
            <li>Acompanhe higienização de orelhas, unhas e dentes.</li>
          </ul>
        </div>
        <div style={phone}>
          <div style={bar}>Higiene</div>
          <div style={{background:'#f9f9f9', border:'1px solid #eee', borderRadius:12, padding:10}}>
            <div style={{fontWeight:600}}>26 mar 2019</div>
            <div style={{fontSize:12}}>Banho realizado • Pet Shop Monte Azul</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <div>
          <div style={title}>Compartilhamento</div>
          <ul style={bullets}>
            <li>Permita que outras pessoas ajudem a cuidar do pet.</li>
            <li>Compartilhe com o veterinário todo o histórico de saúde.</li>
            <li>Defina leitura, novas edições e limite por período.</li>
            <li>Interrompa quando quiser, você decide com quem e por quanto tempo.</li>
          </ul>
        </div>
        <div style={phone}>
          <div style={bar}>Compartilhar</div>
          <div style={{display:'grid', gap:6}}>
            <label style={{display:'flex', justifyContent:'space-between'}}>
              <span>Somente leitura</span>
              <span style={{background:'#eee', borderRadius:12, padding:'2px 10px'}}>off</span>
            </label>
            <label style={{display:'flex', justifyContent:'space-between'}}>
              <span>Permitir novos compartilhamentos</span>
              <span style={{background:'#eee', borderRadius:12, padding:'2px 10px'}}>off</span>
            </label>
            <label style={{display:'flex', justifyContent:'space-between'}}>
              <span>Limitar compartilhamento</span>
              <span style={{background:'#FF7A00', color:'#fff', borderRadius:12, padding:'2px 10px'}}>on</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}