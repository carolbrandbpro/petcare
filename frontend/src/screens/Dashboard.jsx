import React, { useEffect, useState } from 'react';
import api, { resolveUrl } from '../lib/api';
import { showAlert } from '../lib/alert';
import { CalendarDays, Pencil, Share2, PawPrint, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')||'null') : null;
  const [showAddPetSheet, setShowAddPetSheet] = useState(false);
  const [pets, setPets] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  async function printPet(p){
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pad = 40;
    let y = 80;
    doc.setFillColor(3,152,159);
    doc.rect(0, 0, 595, 60, 'F');
    doc.setTextColor(255,255,255);
    const today = new Date().toLocaleDateString('pt-BR');
    // logo opcional
    async function tryLogo(){
      const candidates = [
        `${window.location.origin}/logo.png`,
        `${window.location.origin}/logo192.png`,
        `${window.location.origin}/favicon.png`
      ];
      for(const url of candidates){
        try{
          const r = await fetch(url);
          if(r.ok){ const b = await r.blob(); const fr = new FileReader(); const prom = new Promise(res=>{ fr.onload = ()=>res(fr.result); }); fr.readAsDataURL(b); const dataUrl = await prom; doc.addImage(dataUrl, 'PNG', pad, 14, 32, 32); break; }
        }catch{}
      }
    }
    await tryLogo();
    doc.setFontSize(16);
    doc.text('PetControl Pro', pad + 40, 38);
    doc.setFontSize(11);
    doc.text(`Data: ${today}`, 595 - pad - 80, 38);
    doc.setTextColor(0,0,0);
    // util para transformar imagem em círculo (canvas)
    async function toCircleDataUrl(u, size=84){
      const img = new Image(); img.crossOrigin = 'anonymous'; img.src = u;
      await new Promise((res, rej)=>{ img.onload = res; img.onerror = rej; });
      const c = document.createElement('canvas'); c.width = size; c.height = size; const ctx = c.getContext('2d');
      ctx.clearRect(0,0,size,size);
      ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI*2); ctx.closePath(); ctx.clip();
      // cover
      const ratio = Math.max(size/img.width, size/img.height);
      const nw = img.width*ratio, nh = img.height*ratio; const nx = (size - nw)/2, ny = (size - nh)/2;
      ctx.drawImage(img, nx, ny, nw, nh);
      return c.toDataURL('image/png');
    }
    const avatarUrl = p.avatar_url ? resolveUrl(p.avatar_url) : null;
    if(avatarUrl){
      try{ const circleUrl = await toCircleDataUrl(avatarUrl); doc.addImage(circleUrl, 'PNG', pad, y, 84, 84); }catch{}
      doc.setDrawColor(3,152,159); doc.circle(pad + 42, y + 42, 42);
      doc.setFontSize(18);
      doc.text(`Ficha do Pet - ${p.name}`, pad + 96, y + 22);
      doc.setFontSize(12);
      doc.text(`${p.species||'-'} ${p.breed ? '• '+p.breed : ''}`, pad + 96, y + 44);
      y += 110;
    }else{
      doc.setDrawColor(3,152,159);
      doc.circle(pad + 42, y + 42, 42);
      doc.setFontSize(26);
      doc.text(`${speciesEmoji(p.species)}`, pad + 34, y + 50);
      doc.setFontSize(18);
      doc.text(`Ficha do Pet - ${p.name}`, pad + 96, y + 22);
      doc.setFontSize(12);
      doc.text(`${p.species||'-'} ${p.breed ? '• '+p.breed : ''}`, pad + 96, y + 44);
      y += 110;
    }
    const rows = [
      [ 'Nascimento', p.birth_date || '-' ],
      [ 'Sexo', p.sex || '-' ],
      [ 'Pelagem', p.coat || '-' ],
      [ 'Cor', p.color || '-' ],
      [ 'Castrado', p.neutered ? 'Sim' : 'Não' ],
    ];
    doc.setFontSize(12);
    for(const [label, value] of rows){ doc.text(`${label}: ${value}`, pad, y); y += 18; }
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfName(`Ficha-${p.name}.pdf`);
    setPdfUrl(url);
    setShowPdfModal(true);
  }
  function closePdf(){ if(pdfUrl){ URL.revokeObjectURL(pdfUrl); } setPdfUrl(null); setShowPdfModal(false); }
  function printCurrentPdf(){ const iframe = document.getElementById('pdf-viewer'); if(iframe && iframe.contentWindow){ iframe.contentWindow.focus(); iframe.contentWindow.print(); } }
  function speciesEmoji(s){
    const k = (s||'').toLowerCase();
    if(/cachorro|cão|cao|dog|canino/.test(k)) return '🐶';
    if(/gato|cat|felino/.test(k)) return '🐱';
    if(/coelho|rabbit/.test(k)) return '🐰';
    if(/ave|bird|pássaro|passaro/.test(k)) return '🐦';
    if(/peixe|fish/.test(k)) return '🐟';
    if(/tartaruga|turtle/.test(k)) return '🐢';
    return '🐾';
  }
  useEffect(()=>{
    async function load(){ try{ const r = await api.get('/api/pets'); setPets(r.data||[]); }catch{} }
    load();
  },[]);
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="mobile-only btn btn-outline" aria-label="Abrir menu" onClick={()=>{ const e = new Event('open-menu'); window.dispatchEvent(e); }}>
          <span className="nav-icon">≡</span>
        </button>
        <div style={{fontSize:22, fontWeight:700, color:'var(--color-primary)'}}>Olá {user?.name?.split(' ')[0] || 'Usuário'}</div>
      </div>

      <section className="card" style={{display:'grid', gap:10}}>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)'}}>Meus Pets</div>
        {pets.length === 0 && (
          <>
            <div style={{fontSize:15, color:'#222'}}>Você ainda não registrou seu pet</div>
            <button onClick={()=>setShowAddPetSheet(true)} className="btn btn-secondary" style={{width:240, textAlign:'center'}}>ADICIONAR NOVO PET  +</button>
          </>
        )}
        {pets.length > 0 && (
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            {pets.map(p=> (
              <div key={p.id} style={{display:'grid', placeItems:'center', gap:6}}>
                <div style={{position:'relative', width:72, height:72}}>
                  {p.avatar_url ? (
                    <img src={resolveUrl(p.avatar_url)} alt={p.name} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', border:'3px solid var(--color-secondary)'}} />
                  ) : (
                    <div style={{width:'100%', height:'100%', borderRadius:'50%', background:'var(--color-secondary)', color:'#000', display:'grid', placeItems:'center', border:'3px solid var(--color-secondary)'}}>
                      <span style={{fontSize:32, lineHeight:1}}>{speciesEmoji(p.species)}</span>
                    </div>
                  )}
                  <button aria-label="Editar" onClick={()=>{ window.location.href = `/pets/new?id=${p.id}`; }} style={{position:'absolute', right:-6, top:-6, width:24, height:24, borderRadius:12, border:'1px solid #ddd', background:'#fff', display:'grid', placeItems:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>
                    <Pencil size={14} />
                  </button>
                </div>
                <div style={{fontSize:12, fontWeight:600}}>{p.name}</div>
                <div style={{display:'flex', gap:6}}>
                  <button onClick={()=>printPet(p)} className="btn btn-outline" aria-label="Imprimir" title="Imprimir" style={{padding:6, width:32, height:32, display:'grid', placeItems:'center'}}>
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={()=>setShowAddPetSheet(true)} className="btn btn-secondary" style={{width:60, height:60, borderRadius:30, display:'grid', placeItems:'center'}}>+</button>
          </div>
        )}
      </section>

      {showPdfModal && (
        <>
          <div className="backdrop" onClick={closePdf} />
          <div style={{position:'fixed', left:'50%', top:'50%', transform:'translate(-50%,-50%)', background:'#fff', borderRadius:12, boxShadow:'0 12px 36px rgba(0,0,0,0.2)', padding:12, zIndex:2000, width:'86vw', maxWidth:900}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px'}}>
              <div style={{fontWeight:700, color:'var(--color-primary)'}}>Visualizar PDF</div>
              <div style={{display:'flex', gap:8}}>
                <a href={pdfUrl||'#'} download={pdfName||'Ficha.pdf'} className="btn btn-outline" style={{padding:'6px 10px'}}>Baixar</a>
                <button className="btn btn-primary" onClick={printCurrentPdf} style={{padding:'6px 10px'}}>Imprimir</button>
                <button className="btn btn-outline" onClick={closePdf} style={{padding:'6px 10px'}}>Fechar</button>
              </div>
            </div>
            <div style={{height:'70vh'}}>
              <iframe id="pdf-viewer" src={pdfUrl||''} title="PDF" style={{width:'100%', height:'100%', border:'1px solid #eee', borderRadius:8}} />
            </div>
          </div>
        </>
      )}

      <section style={{background:'#f3f3f3', padding:14, borderRadius:12}}>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:10}}>Eventos Agendados</div>
        <div className="card" style={{display:'flex', alignItems:'center', gap:10}}>
          <span style={{color:'var(--color-primary)', fontSize:20}}><CalendarDays size={20} /></span>
          <span>Parece que você não tem nenhum evento agendado.</span>
        </div>
      </section>

      <section>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:8}}>O que você está procurando?</div>
        <div className="dashboard-grid-2">
          <div className="card" style={{display:'grid', gap:10}}>
            <img src="https://picsum.photos/seed/petproducts/120" alt="Produtos" loading="lazy" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', justifySelf:'center'}} />
            <div style={{fontWeight:700, textAlign:'center'}}>Produtos</div>
            <div style={{fontSize:13, color:'#555', textAlign:'center'}}>Toda a linha de produtos pet sem sair de casa!</div>
            <button className="btn btn-outline" style={{justifySelf:'center'}}>Ver mais</button>
          </div>
          <div className="card" style={{display:'grid', gap:10}}>
            <img src="https://picsum.photos/seed/petservices/120" alt="Serviços" loading="lazy" style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', justifySelf:'center'}} />
            <div style={{fontWeight:700, textAlign:'center'}}>Serviços</div>
            <div style={{fontSize:13, color:'#555', textAlign:'center'}}>Creches, hotéis e veterinários perto da sua casa!</div>
            <button className="btn btn-outline" style={{justifySelf:'center'}}>Ver mais</button>
          </div>
        </div>
      </section>

      <section>
        <div style={{fontSize:18, fontWeight:700, color:'var(--color-primary)', marginBottom:8}}>Fique informado</div>
        <div className="dashboard-tiles">
          {['Notícias','Blog','Aprenda'].map((t)=> (
            <div key={t} className="card tile" style={{minWidth:220, height:120, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center'}}>{t}</div>
          ))}
        </div>
      </section>

      {showAddPetSheet && (
        <>
          <div className="backdrop" onClick={()=>setShowAddPetSheet(false)} />
          <div style={{position:'fixed', left:0, right:0, bottom:0, background:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16, boxShadow:'0 -8px 24px rgba(0,0,0,0.18)', padding:16, zIndex:1001}}>
            <div style={{fontSize:16, fontWeight:700, marginBottom:10}}>Adicionar Pet</div>
            <button onClick={()=>{ setShowAddPetSheet(false); window.location.href='/pets/new'; }} className="side-item" style={{background:'#f8f8f8', color:'#000', width:'100%'}}>
              <span className="side-icon"><Pencil size={18} /></span>
              <span className="side-label">Criar um pet novo</span>
            </button>
            <button onClick={()=>{ setShowAddPetSheet(false); window.location.href='/share'; }} className="side-item" style={{background:'#f8f8f8', color:'#000', width:'100%'}}>
              <span className="side-icon"><Share2 size={18} /></span>
              <span className="side-label">Usar um código de compartilhamento</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}