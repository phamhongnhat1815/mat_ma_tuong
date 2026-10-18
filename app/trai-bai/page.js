"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const focusCardRef = useRef(null);
  const flightOrigin = useRef(null);
  const [presented, setPresented] = useState(false);
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

  useLayoutEffect(() => {
    if (view !== "focus" || !selected || !focusCardRef.current) return;
    const card = focusCardRef.current;
    const origin = flightOrigin.current;
    const target = card.getBoundingClientRect();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduced) { setRevealed(true); return; }
    const dx = origin.centerX - target.left - target.width / 2;
    const dy = origin.centerY - target.top - target.height / 2;
    const flight = card.animate([
      { transform: `translate(${dx}px, ${dy}px) rotate(${origin.angle}deg) scale(${origin.width / target.width})`, offset: 0 },
      { transform: `translate(${dx * .22}px, ${Math.min(dy * .3, -35)}px) rotate(-4deg) scale(1.06)`, offset: .68 },
      { transform: "translate(0, 0) rotate(0) scale(1)", offset: 1 },
    ], { duration: 1100, easing: "cubic-bezier(.22,.72,.2,1)" });
    flight.onfinish = () => setRevealed(true);
    return () => flight.cancel();
  }, [view, selected]);

  useEffect(() => {
    if (!revealed) return;
    const timer = window.setTimeout(() => setPresented(true), 760);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  useEffect(() => {
    if (phase !== "dealt") { setFanReady(false); return; }
    const timer = window.setTimeout(() => setFanReady(true), 2250);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const startDeal = () => {
    setDeck(shuffleDeck(topic));
    setSelected(null);
    setPresented(false);
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
    return { "--x": `${x}px`, "--y": `${y}px`, "--angle": `${-50 + progress * 100 + rotation * .08}deg`, "--delay": `${index * 74}ms`, "--wave-delay": `${-index * .16}s` };
  };

  const renderParagraphs = (paragraphs) => paragraphs.map((paragraph, index) => {
    const Tag = paragraph.heading ? "h3" : "p";
    const style = {
      marginTop: `${paragraph.space_before ?? 0}pt`,
      marginBottom: `${paragraph.space_after ?? 0}pt`,
      lineHeight: paragraph.lineHeight ?? 1.5,
      whiteSpace: "pre-wrap",
      textAlign: paragraph.textAlign ?? "left",
      textIndent: paragraph.textIndent,
      paddingLeft: paragraph.paddingLeft,
      paddingRight: paragraph.paddingRight,
    };
    return <Tag className="docx-paragraph" style={style} key={index}>
      {paragraph.runs.length ? paragraph.runs.map((run, runIndex) => {
        let text = run.text;
        if (run.underline) text = <u>{text}</u>;
        if (run.italic) text = <em>{text}</em>;
        if (run.bold) text = <strong>{text}</strong>;
        return <span key={runIndex}>{text}</span>;
      }) : <br />}
    </Tag>;
  });

  return <main className={`reading-table reading-${phase}`}>
    <div className={`reading-navigation ${showDetail || phase === "profile" ? "is-hidden" : ""}`}><a className="reading-logo logo-mark" href="/" aria-label="Mật Mã Tuồng"><img src="/images/logo-cutout.webp" alt="Mật Mã Tuồng" /></a><a className="reading-back" href="/#mat-ma-tuong">← Chọn lại chủ đề</a></div>
    <div className={`reading-heading ${showDetail || phase === "profile" ? "is-hidden" : ""}`}>
      <header className="reading-header"><span>Trải bài theo chủ đề</span><h1>{topic}</h1></header>
      {["countdown", "shuffling", "dealt"].includes(phase) && view !== "focus" && <p className="reading-prompt">Chọn một lá thu hút bạn</p>}
    </div>
    <section className="dealing-area" aria-live="polite">
      {phase !== "dealt" && <div className="deck-stack" aria-hidden="true"><img src="/images/hihi.webp" alt="" /></div>}
      {phase === "ready" && <button className="deal-button" onClick={startDeal}>Trải bài <span>✦</span></button>}
      {phase === "profile" && <div className="ritual-modal" role="dialog" aria-modal="true"><section><span>☾</span><p>Trước khi lật lá bài</p><h2>Nhập thông tin của bạn</h2><div className="ritual-inputs"><div><label>1 · Giới tính</label><div className="ritual-gender"><button className={gender === "Nữ" ? "active" : ""} onClick={() => setGender("Nữ")}>Nữ</button><button className={gender === "Nam" ? "active" : ""} onClick={() => setGender("Nam")}>Nam</button><button className={gender === "Khác" ? "active" : ""} onClick={() => setGender("Khác")}>Khác</button></div></div><label className={gender ? "date active" : "date"}>2 · Ngày sinh<input type="date" disabled={!gender} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></label></div><button className="ritual-ok" disabled={!profileReady} onClick={() => setPhase("countdown")}>Đồng ý ✦</button></section></div>}
      {phase === "countdown" && <div className="countdown" aria-label="Chuẩn bị trải bài"><span>3</span><span>2</span><span>1</span></div>}
      {phase === "shuffling" && <p className="dealing-status">Đang xáo bài…</p>}
      {phase === "dealt" && <>{view !== "focus" && <div className="orbit" onWheel={(event) => { if (fanReady) { event.preventDefault(); rotate(event.deltaY > 0 ? 10 : -10); } }} onTouchStart={(event) => setTouchX(event.touches[0].clientX)} onTouchEnd={(event) => { if (fanReady && touchX !== null) { const delta = event.changedTouches[0].clientX - touchX; if (Math.abs(delta) > 18) rotate(delta > 0 ? 12 : -12); } setTouchX(null); }}><div className={`orbit-cards ${fanReady ? "ready" : ""} ${view === "collapsing" ? "picking" : ""}`}>{deck.map((card, index) => <button key={card.id} disabled={!fanReady || Boolean(selected)} aria-label={`Chọn lá bài ${index + 1}`} className={`orbit-card ${selected?.id === card.id ? "chosen" : ""} ${view === "collapsing" && selected?.id !== card.id ? "is-gone" : ""}`} style={positionFor(index)} onClick={(event) => { if (fanReady && !selected) {
        const rect = event.currentTarget.getBoundingClientRect();
        flightOrigin.current = { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2, width: event.currentTarget.offsetWidth, height: event.currentTarget.offsetHeight, angle: -50 + index / Math.max(deck.length - 1, 1) * 100 + rotation * .08 };
        setPresented(false); setSelected(card); setRevealed(false); setView("focus");
      } }}><img src="/images/hihi.webp" alt="" /></button>)}</div></div>}{view === "focus" && selected && <section className={`reading-focus ${presented ? "is-presented" : "is-arriving"}`} aria-live="polite"><div ref={focusCardRef} className={`focus-card ${revealed ? "is-revealed" : ""}`}><div className="focus-card-inner"><img className="focus-card-back" src="/images/hihi.webp" alt="" /><img className="focus-card-front" src={selected.image} alt={selected.title} /></div></div><div className="focus-copy" inert={!presented}><span>{topic} · Lá bài đã chọn</span><h2>{selected.title}</h2><div className="docx-message">{renderParagraphs(selected.messageParagraphs)}</div><button className="detail-button" onClick={() => setShowDetail(true)}>Xem giải mã chi tiết</button><button className="choose-again" onClick={() => { setSelected(null); setPresented(false); setRevealed(false); setView("deck"); }}>Chọn lá khác</button></div></section>}<button className="reshuffle-button" onClick={startDeal}>↻ Trộn lại</button>{showDetail && selected && <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={() => setShowDetail(false)}><section className="text-detail" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowDetail(false)} aria-label="Đóng giải mã">×</button><div className="detail-scroll"><span>{topic} · Giải mã lá bài</span><h2 id="detail-title">{selected.title}</h2><div className="detail-content">{renderParagraphs([selected.messageHeading, ...selected.messageParagraphs, ...selected.detail1, ...selected.detail2, ...selected.detail3])}</div></div></section></div>}</>}
    </section>
  </main>;
}
