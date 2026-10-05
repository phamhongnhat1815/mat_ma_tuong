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
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [fanReady, setFanReady] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [revealSelected, setRevealSelected] = useState(false);

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
    const revealTimer = window.setTimeout(() => setRevealSelected(true), 950);
    const focusTimer = window.setTimeout(() => setView("focus"), 1900);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(focusTimer);
    };
  }, [view]);

  useEffect(() => {
    if (phase !== "dealt") {
      setFanReady(false);
      return;
    }
    const timer = window.setTimeout(() => setFanReady(true), 2350);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const startDeal = () => {
    setDeck(shuffleDeck(topic));
    setSelected(null);
    setView("deck");
    setShowDetail(false);
    setGender("");
    setBirthDate("");
    setOrbitRotation(0);
    setFanReady(false);
    setRevealSelected(false);
    setPhase("profile");
  };

  const profileReady = Boolean(gender && birthDate);
  const rotateOrbit = (amount) => setOrbitRotation((rotation) => rotation + amount);
  const cardPosition = (index) => {
    const progress = index / Math.max(deck.length - 1, 1);
    const screenWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
    const screenHeight = typeof window === "undefined" ? 900 : window.innerHeight;
    const radiusX = Math.min(screenWidth * 0.4, 520);
    const radiusY = Math.min(screenHeight * 0.16, radiusX * 0.46);
    const angle = progress * 360 + orbitRotation;
    const radians = (angle * Math.PI) / 180;
    return { "--ring-x": `${Math.cos(radians) * radiusX}px`, "--ring-y": `${Math.sin(radians) * radiusY}px`, "--card-angle": `${angle + 90}deg`, "--deal-delay": `${index * 78}ms`, "--deal-z": deck.length - index };
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
      {phase === "profile" && <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><section className="profile-panel"><span className="profile-symbol">☾</span><p>Trước khi mở lời sấm</p><h2 id="profile-title">Để lại dấu ấn của bạn</h2><div className="profile-fields"><div className="gender-field"><label>1 · Chọn giới tính</label><div className="gender-options"><button type="button" className={gender === "Nữ" ? "active" : ""} onClick={() => setGender("Nữ")}>Nữ</button><button type="button" className={gender === "Nam" ? "active" : ""} onClick={() => setGender("Nam")}>Nam</button><button type="button" className={gender === "Khác" ? "active" : ""} onClick={() => setGender("Khác")}>Khác</button></div></div><label className={`date-field ${gender ? "is-enabled" : ""}`}>2 · Ngày sinh<input type="date" value={birthDate} disabled={!gender} onChange={(event) => setBirthDate(event.target.value)} /></label></div><small>{gender ? "Hãy chọn ngày sinh để tiếp tục." : "Chọn giới tính trước để mở ngày sinh."}</small><button className="profile-confirm" disabled={!profileReady} onClick={() => setPhase("countdown")}>Đồng ý <span>✦</span></button></section></div>}
      {phase === "countdown" && <div className="countdown" aria-label="Chuẩn bị trải bài"><span>3</span><span>2</span><span>1</span></div>}
      {phase === "shuffling" && <p className="dealing-status">Đang xáo bài…</p>}
      {phase === "dealt" && <>{view !== "focus" && <div className={`card-orbit ${fanReady ? "is-ready" : ""}`} onWheel={(event) => { if (fanReady) { event.preventDefault(); rotateOrbit(event.deltaY > 0 ? 9 : -9); } }} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={(event) => { if (fanReady && touchStart !== null) { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 18) rotateOrbit(distance > 0 ? 12 : -12); } setTouchStart(null); }}><div className={`dealt-grid ${view === "collapsing" ? "is-collapsing" : ""} ${fanReady ? "is-orbit-ready" : ""}`} aria-label="Vòng xoay hai mươi lá bài úp">{deck.map((card, index) => <button className={`dealt-card ${selected?.id === card.id ? "is-selected" : ""} ${selected?.id === card.id && revealSelected ? "is-revealed" : ""}`} key={card.id} style={cardPosition(index)} disabled={!fanReady} onClick={() => { if (view === "deck" && fanReady) { setSelected(card); setRevealSelected(false); setView("collapsing"); } }} aria-label={`Chọn lá bài úp số ${index + 1}`}><img src={selected?.id === card.id && revealSelected ? card.image : "/images/hihi.webp"} alt={selected?.id === card.id && revealSelected ? card.title : ""} /></button>)}</div></div>}{view === "focus" && selected && <section className="reading-focus" aria-live="polite"><div className="focus-card"><img src={selected.image} alt={selected.title} /></div><div className="focus-copy"><span>{topic} · Lá bài đã chọn</span><h2>{selected.title}</h2><p>{selected.message}</p><button className="detail-button" onClick={() => setShowDetail(true)}>Xem giải mã chi tiết</button><button className="choose-again" onClick={() => { setSelected(null); setRevealSelected(false); setView("deck"); }}>Chọn lá khác</button></div></section>}<button className="reshuffle-button" onClick={startDeal}>↻ Trộn lại</button>{showDetail && selected && <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={() => setShowDetail(false)}><section className="text-detail" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowDetail(false)} aria-label="Đóng giải mã">×</button><span>{topic} · Giải mã lá bài</span><h2 id="detail-title">{selected.title}</h2><div className="detail-content">{renderInterpretation(selected.interpretation)}</div></section></div>}</>}
    </section>
  </main>;
}
