"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Footer from "./components/Footer";

function Lantern({ side }) {
  return <div className={`lantern-group ${side}`} aria-hidden="true"><div className="cord" /><div className="cap" /><div className="lantern" /><div className="tassel" /></div>;
}

function Curtain({ side }) {
  const isLeft = side === "left";
  return <div className={`curtain curtain-${side}`} aria-hidden="true">
    <svg viewBox="0 0 600 1000" preserveAspectRatio="none">
      <defs><linearGradient id={side} x1={isLeft ? "0" : "1"} x2={isLeft ? "1" : "0"}><stop stopColor="#3b0b0d" /><stop offset=".3" stopColor="#a83228" /><stop offset=".63" stopColor="#651517" /><stop offset="1" stopColor="#250609" /></linearGradient></defs>
      <path fill={`url(#${side})`} d={isLeft ? "M0 0H600C510 120 570 210 464 315C375 404 489 510 360 623C271 701 366 839 260 1000H0Z" : "M600 0H0C90 120 30 210 136 315C225 404 111 510 240 623C329 701 234 839 340 1000H600Z"} />
      <path className="edge" d={isLeft ? "M565 0C490 122 554 211 449 319C365 406 469 512 345 627C260 708 350 840 247 1000" : "M35 0C110 122 46 211 151 319C235 406 131 512 255 627C340 708 250 840 353 1000"} />
    </svg>
  </div>;
}

export default function Home() {
  const aboutRef = useRef(null);
  const musicRef = useRef(null);
  const [navOnLight, setNavOnLight] = useState(false);
  const topics = ["Tình cảm", "Gia đình", "Học tập", "Sự nghiệp"];
  const chooseTopic = (selectedTopic) => {
    window.location.href = `/trai-bai?chu-de=${encodeURIComponent(selectedTopic)}`;
  };
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.target.classList.toggle("is-visible", entry.isIntersecting), { threshold: 0.25 });
    if (aboutRef.current) observer.observe(aboutRef.current);
    const motionNodes = document.querySelectorAll(".oracle-text,.topic-altar,.closing span,.closing h2,.tuong-footer>div");
    const motionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      entry.target.classList.toggle("motion-in", entry.isIntersecting);
      entry.target.classList.toggle("motion-past", passed);
    }), { threshold: 0.12, rootMargin: "-7% 0px -7%" });
    motionNodes.forEach((node, index) => { node.classList.add("scroll-motion"); node.style.setProperty("--motion-delay", `${Math.min(index % 4, 3) * 70}ms`); motionObserver.observe(node); });
    const updateNavTone = () => {
      const about = aboutRef.current;
      if (!about) return;
      const bounds = about.getBoundingClientRect();
      setNavOnLight(bounds.top <= 88 && bounds.bottom >= 0);
    };
    updateNavTone();
    window.addEventListener("scroll", updateNavTone, { passive: true });
    return () => { observer.disconnect(); motionObserver.disconnect(); window.removeEventListener("scroll", updateNavTone); };
  }, []);
  useLayoutEffect(() => {
    const music = musicRef.current;
    if (!music) return undefined;
    const playMusic = () => { if (music.paused) { music.currentTime = 0; music.play().catch(() => {}); } };
    playMusic();
    music.addEventListener("canplay", playMusic, { once: true });
    window.addEventListener("pointerdown", playMusic, { once: true });
    window.addEventListener("keydown", playMusic, { once: true });
    return () => { music.removeEventListener("canplay", playMusic); window.removeEventListener("pointerdown", playMusic); window.removeEventListener("keydown", playMusic); };
  }, []);
  return <main>
    <audio ref={musicRef} src="/audio2.mp3" autoPlay loop preload="auto" aria-hidden="true" />
    <nav className={`nav ${navOnLight ? "is-on-light" : ""}`}><a className="mark logo-mark" href="#home" aria-label="Mật Mã Tuồng"><img src="/images/logo-cutout.webp" alt="Mật Mã Tuồng" /></a><div className="nav-links"><a href="#about">Khám phá</a><a href="#mat-ma-tuong">Trải bài</a><a href="/gioi-thieu-tuong">Về Tuồng</a></div></nav>
    <section className="hero" id="home">
      <div className="sun" /><div className="cloud one" /><div className="cloud two" /><div className="grain" />
      <Curtain side="left" /><Curtain side="right" /><Lantern side="left" /><Lantern side="right" />
      <div className="hero-mask" aria-hidden="true"><img src="/images/hero-tuong-mask.webp" alt="" /></div>
      <div className="title"><div className="eyebrow">Di sản sân khấu Việt</div><h1>MẬT MÃ<br />TUỒNG</h1><p>Vén màn · Giải mã · Cảm nhận</p><a className="enter" href="#about">Bắt đầu hành trình</a></div>
      <a className="scroll" href="#about">Cuộn để khám phá</a>
    </section>
    <section ref={aboutRef} className="about" id="about">
      <div className="about-copy"><span className="kicker">Hồn cốt sân khấu Việt</span><h2>Đi vào thế giới<br /><em>sau lớp mặt nạ.</em></h2><p>Tuồng là nơi từng nét vẽ trên gương mặt, từng nhịp trống và mỗi dáng bộ đều kể một câu chuyện. Không chỉ để xem, đây là một hành trình để cảm nhận những mật mã văn hoá còn sống mãi.</p><div className="about-actions"><a href="/gioi-thieu-tuong" className="text-link">Khám phá Tuồng <span>↗</span></a><a href="#mat-ma-tuong" className="text-link secret-link">Mật mã Tuồng <span>✦</span></a></div></div>
      <div className="video-stage"><div className="video-caption">SẮC · THANH · BỘ</div><div className="video-frame"><video src="/images/video2.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Video giới thiệu nghệ thuật Tuồng" /><div className="video-shade" /><span className="video-label">01 — Tuồng Việt</span></div></div>
    </section>
    <section className="oracle" id="mat-ma-tuong" aria-labelledby="oracle-title">
      <div className="oracle-text"><span className="kicker">Một không gian bí mật</span><h2 id="oracle-title">Mật mã<br /><em>Tuồng</em></h2><p>Chọn một chủ đề để mở một lá bài ngẫu nhiên, được kể bằng những biểu tượng quen thuộc của sân khấu Tuồng. Đây là trải nghiệm để vui và tìm cảm hứng, không phải một lời dự đoán.</p><span className="instruction">Chọn một chủ đề để mở mật mã</span></div>
      <div className="card-altar topic-altar" aria-live="polite">
        <div className="spark spark-one" /><div className="spark spark-two" /><div className="spark spark-three" />
        {topics.map((item, index) => <button key={item} className={`tuong-card topic-card topic-${index + 1}`} onClick={() => chooseTopic(item)} aria-label={`Chọn chủ đề ${item}`}><span className="topic-label">{item}</span><span className="card-flip"><span className="card-frame card-face"><span className="card-crown" /><span className="card-mask"><i /><b /></span><span className="card-number">0{index + 1}</span><span className="card-symbol">{["✦", "◌", "⌁", "✧"][index]}</span></span></span></button>)}
      </div>
    </section>
    <section className="closing" id="learn"><span>Hành trình vẫn tiếp diễn</span><h2>Mỗi vai diễn<br />là một mật mã.</h2></section>
    <Footer />
  </main>;
}
