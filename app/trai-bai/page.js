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
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [rotation, setRotation] = useState(0);
  const [fanReady, setFanReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [touchX, setTouchX] = useState(null);

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
    const timer = window.setTimeout(() => setPhase("dealt"), 1050);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (view !== "collapsing") return;
    const focusTimer = window.setTimeout(() => setView("focus"), 1600);
    return () => window.clearTimeout(focusTimer);
  }, [view]);

  useEffect(() => {
    if (view !== "focus") return;
    const revealTimer = window.setTimeout(() => setRevealed(true), 360);
    return () => window.clearTimeout(revealTimer);
  }, [view]);

  useEffect(() => {
    if (phase !== "dealt") { setFanReady(false); return; }
    const timer = window.setTimeout(() => setFanReady(true), 2250);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const startDeal = () => {
    setDeck(shuffleDeck(topic));
    setSelected(null);
    setView("deck");
    setShowDetail(false);
    setGender(""); setBirthDate(""); setRotation(0); setRevealed(false); setFanReady(false);
    setPhase("profile");
  };

  const profileReady = Boolean(gender && birthDate);
  const rotate = (amount) => setRotation((value) => value + amount);
  const positionFor = (index) => {
    const width = typeof window === "undefined" ? 1440 : window.innerWidth;
    const progress = index / Math.max(deck.length - 1, 1);
    const spread = Math.min(width * .84, 1050);
    const x = (progress - .5) * spread;
    const y = Math.pow((progress - .5) * 2, 2) * Math.min(width * .07, 96);
    return { "--x": `${x}px`, "--y": `${y}px`, "--angle": `${-50 + progress * 100 + rotation * .08}deg`, "--delay": `${index * 74}ms` };
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
    <div className={`reading-navigation ${showDetail || phase === "profile" ? "is-hidden" : ""}`}><a className="reading-logo logo-mark" href="/" aria-label="Mật Mã Tuồng"><img src="/images/logo-cutout.webp" alt="Mật Mã Tuồng" /></a><a className="reading-back" href="/#mat-ma-tuong">← Chọn lại chủ đề</a></div>
    <header className={`reading-header ${showDetail || phase === "profile" ? "is-hidden" : ""}`}><span>Trải bài theo chủ đề</span><h1>{topic}</h1></header>
    <section className="dealing-area" aria-live="polite">
      {phase !== "dealt" && <div className="deck-stack" aria-hidden="true"><img src="/images/hihi.webp" alt="" /></div>}
      {phase === "ready" && <button className="deal-button" onClick={startDeal}>Trải bài <span>✦</span></button>}
      {phase === "profile" && <div className="ritual-modal" role="dialog" aria-modal="true"><section><span>☾</span><p>Trước khi lật lá bài</p><h2>Nhập thông tin của bạn</h2><div className="ritual-inputs"><div><label>1 · Giới tính</label><div className="ritual-gender"><button className={gender === "Nữ" ? "active" : ""} onClick={() => setGender("Nữ")}>Nữ</button><button className={gender === "Nam" ? "active" : ""} onClick={() => setGender("Nam")}>Nam</button><button className={gender === "Khác" ? "active" : ""} onClick={() => setGender("Khác")}>Khác</button></div></div><label className={gender ? "date active" : "date"}>2 · Ngày sinh<input type="date" disabled={!gender} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></label></div><button className="ritual-ok" disabled={!profileReady} onClick={() => setPhase("countdown")}>Đồng ý ✦</button></section></div>}
      {phase === "countdown" && <div className="countdown" aria-label="Chuẩn bị trải bài"><span>3</span><span>2</span><span>1</span></div>}
      {phase === "shuffling" && <p className="dealing-status">Đang xáo bài…</p>}
      {phase === "dealt" && <>{view !== "focus" && <div className="orbit" onWheel={(event) => { if (fanReady) { event.preventDefault(); rotate(event.deltaY > 0 ? 10 : -10); } }} onTouchStart={(event) => setTouchX(event.touches[0].clientX)} onTouchEnd={(event) => { if (fanReady && touchX !== null) { const delta = event.changedTouches[0].clientX - touchX; if (Math.abs(delta) > 18) rotate(delta > 0 ? 12 : -12); } setTouchX(null); }}><div className={`orbit-cards ${fanReady ? "ready" : ""} ${view === "collapsing" ? "picking" : ""}`}>{deck.map((card, index) => <button key={card.id} disabled={!fanReady} className={`orbit-card ${selected?.id === card.id ? "chosen" : ""} ${view === "collapsing" && selected?.id !== card.id ? "is-gone" : ""}`} style={positionFor(index)} onClick={() => { if (fanReady) { setSelected(card); setRevealed(false); setView("collapsing"); } }}><img src="/images/hihi.webp" alt="" /></button>)}</div></div>}{view === "focus" && selected && <section className="reading-focus" aria-live="polite"><div className={`focus-card ${revealed ? "is-revealed" : ""}`}><div className="focus-card-inner"><img className="focus-card-back" src="/images/hihi.webp" alt="" /><img className="focus-card-front" src={selected.image} alt={selected.title} /></div></div><div className="focus-copy"><span>{topic} · Lá bài đã chọn</span><h2>{selected.title}</h2><p>{selected.message}</p><button className="detail-button" onClick={() => setShowDetail(true)}>Xem giải mã chi tiết</button><button className="choose-again" onClick={() => { setSelected(null); setRevealed(false); setView("deck"); }}>Chọn lá khác</button></div></section>}<button className="reshuffle-button" onClick={startDeal}>↻ Trộn lại</button>{showDetail && selected && <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={() => setShowDetail(false)}><section className="text-detail" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowDetail(false)} aria-label="Đóng giải mã">×</button><span>{topic} · Giải mã lá bài</span><h2 id="detail-title">{selected.title}</h2><div className="detail-content">{renderInterpretation(selected.interpretation)}</div></section></div>}</>}
    </section>
  </main>;
}
