"use client";

import { useEffect, useState } from "react";
import { shuffleDeck } from "../../data/readings";

export default function TraiBai() {
  const [topic, setTopic] = useState("Mật mã Tuồng");
  const [phase, setPhase] = useState("ready");
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("deck");
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const selectedTopic = new URLSearchParams(window.location.search).get("chu-de") || "Tình cảm";
    setTopic(selectedTopic);
    setDeck(shuffleDeck(selectedTopic));
  }, []);

  useEffect(() => {
    if (phase === "countdown") {
      const timer = window.setTimeout(() => setPhase("shuffling"), 2700);
      return () => window.clearTimeout(timer);
    }
    if (phase !== "shuffling") return;
    const timer = window.setTimeout(() => setPhase("dealt"), 920);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (view !== "collapsing") return;
    const timer = window.setTimeout(() => setView("focus"), 520);
    return () => window.clearTimeout(timer);
  }, [view]);

  const startDeal = () => {
    setDeck(shuffleDeck(topic));
    setSelected(null);
    setView("deck");
    setShowDetail(false);
    setPhase("countdown");
  };

  const renderInterpretation = (interpretation) => {
    const sectionMatchers = [
      /I\.\s*GIẢI\s*MÃ\s*LÁ\s*BÀI(?:\s*\d+)?\s*[–-]\s*(?:TÌNH\s*CẢM|GIA\s*ĐÌNH|HỌC\s*TẬP|SỰ\s*NGHIỆP)/gi,
      /II\.\s*GIẢI\s*MÃ\s*.+?\s*TRONG\s*TUỒNG/gi,
      /III\.\s*.+?\s*QUA\s*CÁC\s*NHÂN\s*VẬT\s*TUỒNG/gi
    ];
    const headings = sectionMatchers.flatMap((matcher) => [...interpretation.matchAll(matcher)].map((match) => ({ text: match[0], start: match.index, end: match.index + match[0].length }))).sort((a, b) => a.start - b.start);
    if (!headings.length) return <p>{interpretation}</p>;
    const blocks = [];
    if (headings[0].start > 0) blocks.push(<p key="opening">{interpretation.slice(0, headings[0].start).trim()}</p>);
    headings.forEach((heading, index) => {
      const nextStart = headings[index + 1]?.start ?? interpretation.length;
      blocks.push(<h3 className="detail-section-heading" key={`heading-${heading.start}`}>{heading.text}</h3>);
      blocks.push(<p key={`content-${heading.start}`}>{interpretation.slice(heading.end, nextStart).trim()}</p>);
    });
    return blocks;
  };

  return <main className={`reading-table reading-${phase}`}>
    <div className={`reading-navigation ${showDetail ? "is-hidden" : ""}`}><a className="reading-logo logo-mark" href="/" aria-label="Mật Mã Tuồng"><img src="/images/logo-cutout.webp" alt="Mật Mã Tuồng" /></a><a className="reading-back" href="/#mat-ma-tuong">← Chọn lại chủ đề</a></div>
    <header className={`reading-header ${showDetail ? "is-hidden" : ""}`}><span>Trải bài theo chủ đề</span><h1>{topic}</h1></header>
    <section className="dealing-area" aria-live="polite">
      {phase !== "dealt" && <div className="deck-stack" aria-hidden="true"><img src="/images/hihi.webp" alt="" /></div>}
      {phase === "ready" && <button className="deal-button" onClick={startDeal}>Trải bài <span>✦</span></button>}
      {phase === "countdown" && <div className="countdown" aria-label="Chuẩn bị trải bài"><span>3</span><span>2</span><span>1</span></div>}
      {phase === "shuffling" && <p className="dealing-status">Đang xáo bài…</p>}
      {phase === "dealt" && <>{view !== "focus" && <div className={`dealt-grid ${view === "collapsing" ? "is-collapsing" : ""}`} aria-label="Hai mươi lá bài úp"><span className="grid-note">20 lá bài đang chờ được mở</span>{deck.map((card, index) => <button className={`dealt-card ${selected?.id === card.id ? "is-selected" : ""}`} key={card.id} style={{ "--deal-delay": `${index * 82}ms` }} onClick={() => { if (view === "deck") { setSelected(card); setView("collapsing"); } }} aria-label={selected?.id === card.id ? `Lá bài ${card.title}` : `Chọn lá bài úp số ${index + 1}`}><img src={selected?.id === card.id ? card.image : "/images/hihi.webp"} alt={selected?.id === card.id ? card.title : ""} /></button>)}</div>}{view === "focus" && selected && <section className="reading-focus" aria-live="polite"><div className="focus-card"><img src={selected.image} alt={selected.title} /></div><div className="focus-copy"><span>{topic} · Lá bài đã chọn</span><h2>{selected.title}</h2><p>{selected.message}</p><button className="detail-button" onClick={() => setShowDetail(true)}>Xem giải mã chi tiết</button><button className="choose-again" onClick={() => { setSelected(null); setView("deck"); }}>Chọn lá khác</button></div></section>}<button className="reshuffle-button" onClick={startDeal}>↻ Trộn lại</button>{showDetail && selected && <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={() => setShowDetail(false)}><section className="text-detail" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowDetail(false)} aria-label="Đóng giải mã">×</button><span>{topic} · Giải mã lá bài</span><h2 id="detail-title">{selected.title}</h2><div className="detail-content">{renderInterpretation(selected.interpretation)}</div></section></div>}</>}
    </section>
  </main>;
}
