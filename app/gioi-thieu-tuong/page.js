"use client";

import { useEffect, useRef } from "react";
import Footer from "../components/Footer";

const image = (name) => `/images/${name}`;

const arts = [
  { no: "01", title: "Hoá trang & phục sức", text: "Màu sắc và đường nét trên gương mặt hé lộ phẩm chất nhân vật trước cả khi họ cất lời.", src: "a.webp" },
  { no: "02", title: "Dáng bộ & chuyển động", text: "Mỗi bước chân, ánh mắt và thế tay là một ký hiệu được truyền qua nhiều thế hệ.", src: "506476174_1293370606122055_2632876866963466638_n.webp" },
  { no: "03", title: "Âm nhạc & giọng hát", text: "Trống chầu, nhịp phách và chất giọng tạo nên trường cảm xúc riêng của sân khấu Tuồng.", src: "506476933_1293370612788721_5643377988939456063_n.webp" },
  { no: "04", title: "Sân khấu & biểu tượng", text: "Một không gian tối giản vẫn có thể mở ra chiến địa, cung điện và cả thế giới nội tâm.", src: "d.webp" }
];

const characters = [
  { name: "Kép", src: "kep.jpg", text: "Là vai nam trẻ hoặc trung niên, thường đảm nhận hình tượng nam chính như anh hùng, trung thần, thư sinh hoặc võ tướng trẻ. Kép thường mang tính cách chính trực, dũng cảm, nghĩa khí, có phong thái đường hoàng và mạnh mẽ, với cách hóa trang cân đối và động tác dứt khoát." },
  { name: "Đào", src: "dao.jpg", text: "Là vai nữ trẻ trong Tuồng, thường đại diện cho thiếu nữ, tiểu thư, công chúa hoặc người vợ trẻ. Nhân vật Đào thường mang vẻ đẹp duyên dáng, mềm mại và giàu cảm xúc, được thể hiện qua lối hóa trang thanh tú, giọng hát trong sáng cùng những động tác nhẹ nhàng, uyển chuyển." },
  { name: "Tướng", src: "tuong.jpg", text: "Là loại vai đại diện cho các võ tướng và nhân vật cầm quân, nổi bật với vẻ mạnh mẽ, oai phong và khí chất chiến đấu. Vai Tướng thường có lối hóa trang đậm, cách điệu, trang phục và mão giáp cầu kỳ, kết hợp với những động tác võ thuật mạnh mẽ, dứt khoát; tùy nhân vật mà có thể là tướng trung thành, anh dũng hoặc tướng phản diện, hung ác." },
  { name: "Lão", src: "lao.jpg", text: "Là vai nam cao tuổi, thường xuất hiện dưới hình tượng vua già, quan lớn, người cha, quân sư hoặc trung thần nhiều tuổi. Nhân vật Lão thể hiện sự từng trải, điềm đạm và uy nghiêm, thường có râu tóc bạc, giọng nói trầm, dáng đi và cử chỉ chậm rãi, chắc chắn." },
  { name: "Nịnh", src: "ninh.jpg", text: "Là loại vai thường đại diện cho gian thần hoặc nhân vật phản diện, mang tính cách xu nịnh, tham quyền, phản trắc và xảo quyệt. Vai Nịnh thường được hóa trang với những đường nét sắc và đậm, kết hợp ánh mắt, nét mặt và cử chỉ để làm nổi bật vẻ gian tà, mưu mô của nhân vật." },
  { name: "Mụ", src: "mu.jpg", text: "Là vai nữ lớn tuổi, thường đảm nhận hình tượng người mẹ, người bà hoặc phu nhân. Nhân vật Mụ có thể hiền từ, nghiêm khắc hoặc mang tính cách phản diện tùy theo câu chuyện, nhưng thường được thể hiện bằng lối hóa trang già dặn, giọng nói và những động tác chậm rãi để làm nổi bật tuổi tác và sự từng trải." }
];

function Media({ src, alt, className = "", video = false }) {
  return <figure className={`explore-media ${className}`} data-replaceable-media="image-or-video">{video ? <video src={src} autoPlay muted loop playsInline preload="metadata" aria-label={alt} /> : <img src={image(src)} alt={alt} />}</figure>;
}

export default function GioiThieuTuong() {
  const musicRef = useRef(null);
  useEffect(() => {
    const nodes = document.querySelectorAll(".explore-reveal");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      entry.target.classList.toggle("is-in", entry.isIntersecting);
      entry.target.classList.toggle("is-past", passed);
    }), { threshold: 0.14, rootMargin: "-8% 0px -8%" });
    nodes.forEach((node) => observer.observe(node));
    const page = document.querySelector(".explore-page");
    const cinema = document.querySelector(".cinema-scroll");
    const stops = [[21, 6, 7], [48, 12, 13], [72, 24, 18], [31, 8, 10], [62, 17, 18], [19, 5, 7]];
    let raf = 0;
    const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));
    const updateScroll = () => {
      raf = 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const position = window.scrollY / max;
      const segment = Math.min(Math.floor(position * (stops.length - 1)), stops.length - 2);
      const local = position * (stops.length - 1) - segment;
      const rgb = mix(stops[segment], stops[segment + 1], local);
      page?.style.setProperty("--ambient-rgb", rgb.join(" "));
      page?.style.setProperty("--ambient-shift", `${position * 100}%`);
      if (cinema) {
        const rect = cinema.getBoundingClientRect();
        const viewport = window.innerHeight;
        const approach = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport * .92)));
        const departure = Math.max(0, Math.min(1, rect.bottom / (viewport * .92)));
        const grow = Math.min(approach, departure);
        const progress = Math.max(0, Math.min(1, (viewport - rect.top) / Math.max(rect.height, 1)));
        cinema.style.setProperty("--film-grow", grow.toFixed(4));
        cinema.style.setProperty("--film-progress", progress.toFixed(4));
      }
    };
    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(updateScroll); };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) window.cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return undefined;
    const playMusic = () => music.play().catch(() => {});
    playMusic();
    window.addEventListener("pointerdown", playMusic, { once: true });
    window.addEventListener("keydown", playMusic, { once: true });
    return () => { window.removeEventListener("pointerdown", playMusic); window.removeEventListener("keydown", playMusic); };
  }, []);

  return <><header className="explore-nav"><a className="explore-logo logo-mark" href="/" aria-label="Mật Mã Tuồng"><img src="/images/logo-cutout.webp" alt="Mật Mã Tuồng" /></a><nav><a href="#lich-su">Lịch sử</a><a href="#nghe-thuat">Nghệ thuật</a><a href="#nhan-vat">Nhân vật</a><a href="#tich-truyen">Tích truyện</a><a href="#gia-tri">Giá trị</a></nav><a className="explore-home" href="/">Mật mã Tuồng ↗</a></header><main className="explore-page">
    <audio ref={musicRef} src="/audio.mp3" autoPlay loop preload="auto" aria-hidden="true" />

    <section className="explore-hero" id="tong-quan">
      <div className="explore-hero-copy explore-reveal is-in"><span className="explore-kicker">Overview · Di sản sân khấu Việt</span><h1>Tuồng</h1><h2>Linh hồn của sân khấu Việt</h2><p>Một thế giới nơi màu sắc biết nói, âm thanh dẫn lối và mỗi dáng bộ đều lưu giữ một phần ký ức dân tộc.</p><a href="#lich-su">Bắt đầu khám phá <span>↓</span></a></div>
      <Media className="explore-hero-media explore-reveal is-in" src="b.webp" alt="Nghệ sĩ Tuồng trong phục trang truyền thống" />
      <p className="explore-vertical">Từ biểu diễn đến bản sắc Việt</p><div className="explore-hero-orbit" aria-hidden="true" />
    </section>

    <section className="cinema-scroll" aria-label="Không gian điện ảnh về nghệ thuật Tuồng">
      <div className="cinema-sticky"><div className="cinema-frame"><video src="/video1.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Thước phim nghệ thuật Tuồng" /><div className="cinema-overlay" /><span className="cinema-index">Một thoáng sân khấu · 01</span><p>Âm thanh mở màn.<br />Nhân vật bước ra từ bóng tối.</p></div></div>
    </section>

    <section className="chronicle-section roman-section history-roman" id="lich-su" data-roman="I">
      <div className="chronicle-opening explore-reveal"><span className="explore-kicker">01 · History</span><h2>Một sân khấu.<br /><em>Bốn hồi ký ức.</em></h2><p>Lịch sử Tuồng không nằm yên trên một đường thẳng. Nó được truyền đi như một vở diễn — qua người kể, người xem và những lần sân khấu sáng đèn.</p><span className="chronicle-cue">Cuộn để mở từng hồi <b>↓</b></span></div>
      <div className="history-editorial">
        <article className="era-story era-origin explore-reveal" data-roman="I"><div className="era-copy"><span>Hồi 01 · Thế kỷ XIII</span><h3>Khởi nguồn — Những bước chân đầu tiên từ đất dân gian</h3><p>Mầm sống của Tuồng được gieo từ những sinh hoạt văn hoá dân gian thời Lý – Trần. Đất nước buổi đầu thường xuyên khúc ca mừng chiến thắng, những điệu múa diễn lại tích xưa để gắn kết cộng đồng.</p><div className="era-points"><section><i>01</i><div><h4>Tiếng hát cội nguồn</h4><p>Lễ hội làng quê, các điệu múa chèo cạn và trò diễn xướng dân gian chính là chất liệu thô sơ ban đầu.</p></div></section><section><i>02</i><div><h4>Cột mốc lịch sử</h4><p>Cuối thế kỷ XIII, kép hát Lý Nguyên Cát truyền dạy kỹ nghệ Hát Bội phương Bắc; người Việt tiếp nhận rồi biến đổi theo tâm lý và thẩm mỹ dân tộc.</p></div></section></div></div><div className="era-gallery gallery-duo"><Media src="sl1-7010.webp" alt="Dàn nhạc và sân khấu Tuồng thuở đầu" /><Media src="d7f2c9a6ff1231059a95c24864c11e6f.webp" alt="Chi tiết nghệ thuật diễn xướng Tuồng" /></div></article>
        <article className="era-story era-form explore-reveal" data-roman="II"><div className="era-copy"><span>Hồi 02 · Thế kỷ XVII–XVIII</span><h3>Định hình</h3><h5>Lối xướng giữa chốn cung đình và dân dã</h5><p>Đến thời Đàng Trong – Đàng Ngoài chia cắt, nghệ thuật Tuồng thực sự bước vào giai đoạn định hình diện mạo độc lập dưới sự nuôi dưỡng của chúa Nguyễn và các trí thức đại thần.</p><div className="era-points"><section><i>01</i><div><h4>Ông tổ Đào Duy Từ</h4><p>Đào Duy Từ đưa nghệ thuật Tuồng từ trò diễn dân gian lên thành một nhà hát trình diễn chuyên nghiệp, quy củ.</p></div></section><section><i>02</i><div><h4>Đặc trưng quy phạm</h4><p>Những quy chuẩn về ước lệ và tượng trưng dần được xây dựng; một cây roi ngựa cũng có thể mở ra muôn trùng núi sông.</p></div></section></div></div><div className="era-gallery gallery-film"><Media src="506541206_1293370619455387_1005807591623823631_n.webp" alt="Không khí sân khấu thời kỳ định hình nghệ thuật Tuồng" /><Media src="472312903_532864663242186_6114527094795028972_n.webp" alt="Dáng bộ của nghệ sĩ Tuồng" /></div></article>
        <article className="era-story era-golden explore-reveal" data-roman="III"><div className="era-copy"><span>Hồi 03 · Thế kỷ XIX</span><h3>Tiếng rồng của cung đình Huế và Tuồng đồ dân gian</h3><p>Nhà Nguyễn thống nhất đất nước, lấy Huế làm kinh đô, đưa nghệ thuật Tuồng đạt tới đỉnh cao chưa từng có trong lịch sử.</p><div className="era-points era-points-three"><section><i>01</i><div><h4>Triều Minh Mạng &amp; Thiệu Trị</h4><p>Thành lập Thanh Bình Từ Đường, học viện đào tạo diễn viên Tuồng chuyên nghiệp đầu tiên của quốc gia.</p></div></section><section><i>02</i><div><h4>Xây dựng Duyệt Thị Đường</h4><p>Năm 1826, nhà hát cung đình ra đời trong Đại Nội Huế, trở thành không gian diễn xướng chuẩn mực.</p></div></section><section><i>03</i><div><h4>Triều Tự Đức &amp; Đào Tấn</h4><p>Những kịch bản kinh điển được hệ thống, đưa Tuồng đạt đỉnh cao về triết lý, thi ca và nghệ thuật dàn dựng.</p></div></section></div></div><div className="era-gallery gallery-triptych"><Media src="56690e2023d8289921ba13b0176de138.webp" alt="Chân dung một vai diễn cổ điển" /><Media src="c.webp" alt="Cảnh diễn Tuồng truyền thống" /><Media src="845cd6f8a6b05163727cb5a1e3fa9de2.webp" alt="Nghệ thuật hoá trang Tuồng" /></div></article>
        <article className="era-story era-now explore-reveal" data-roman="IV"><div className="era-copy"><span>Hồi 04 · Thế kỷ XX–nay</span><h3>Di sản đang sống</h3><p>Trải qua những biến động lịch sử và sự xâm nhập của văn hoá phương Tây, Tuồng đứng trước thách thức sống còn. Tuy nhiên, ngọn lửa di sản chưa bao giờ tắt.</p><div className="era-points"><section><i>01</i><div><h4>Bảo tồn giá trị cốt lõi</h4><p>Các nhà hát tại Hà Nội, Huế, Đà Nẵng và Bình Định vẫn sáng đèn, gìn giữ hàng trăm kịch bản cổ.</p></div></section><section><i>02</i><div><h4>Hơi thở trẻ trung</h4><p>Tuồng bước khỏi khuôn mẫu cũ qua du lịch di sản, sân khấu đường phố, số hoá, điện ảnh, đồ hoạ và thời trang.</p></div></section></div></div><div className="era-gallery gallery-collage"><Media src="518419818_24860889096833818_1390499560152296065_n.webp" alt="Tuồng trong không gian sân khấu hôm nay" /><Media src="516711579_24856406963948698_968033986861473449_n.webp" alt="Nghệ sĩ trẻ tiếp nối nghệ thuật Tuồng" /><Media src="beab016edc6916c7dccb2bbeba7d99e0.webp" alt="Sắc diện Tuồng trong cách nhìn đương đại" /></div></article>
      </div>
    </section>

    <section className="arts-section roman-section" id="nghe-thuat" data-roman="II">
      <div className="arts-heading explore-reveal"><span className="explore-kicker">02 · Art & Performance</span><h2>Đặc trưng<br /><em>nghệ thuật</em></h2><p>Bốn lớp ngôn ngữ kết hợp để tạo nên một hình thức sân khấu độc đáo và giàu bản sắc.</p></div>
      <div className="arts-grid">{arts.map((item) => <article className="art-tile explore-reveal" key={item.no}><Media src={item.src} alt={item.title} /><div><span>{item.no}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
    </section>

    <section className="people-section character-atlas roman-section" id="nhan-vat" data-roman="III">
      <header className="character-intro explore-reveal"><span className="explore-kicker">03 · Characters</span><h2>Đặc trưng<br />nhân vật <small>trong Tuồng</small></h2><p>Mỗi nhân vật mang một sắc thái và tính cách riêng, tạo nên bức tranh đa dạng của sân khấu truyền thống.</p></header>
      <div className="character-grid">{characters.map((item, index) => <article className={`character-card character-${index + 1} explore-reveal`} key={item.name}><Media src={item.src} alt={`Vai ${item.name} trong nghệ thuật Tuồng`} /><div><span>0{index + 1}</span><h3>{item.name}</h3><i aria-hidden="true" /><p>{item.text}</p></div></article>)}</div>
    </section>

    <section className="stories-v2 roman-section" id="tich-truyen" data-roman="IV">
      <div className="stories-head explore-reveal"><span className="explore-kicker">04 · Stories</span><h2>Tích truyện<br /><em>và vở diễn</em></h2><p>Từ chính sử đến truyền thuyết, mỗi vở diễn là một cách người Việt kể về lòng trung nghĩa, khát vọng và lựa chọn của con người.</p></div>
      <Media className="stories-stage explore-reveal" src="516667940_24856406923948702_6126039396576844011_n.webp" alt="Một cảnh biểu diễn Tuồng" />
      <div className="stories-index explore-reveal"><span>Vở diễn tiêu biểu</span><a href="#">Sơn Hậu <b>01</b></a><a href="#">Trưng Nữ Vương <b>02</b></a><a href="#">Đào Tam Xuân <b>03</b></a></div>
    </section>

    <section className="culture-section roman-section" id="gia-tri" data-roman="V">
      <Media className="culture-media explore-reveal" src="vnapotaltuong-loaihinhnghethuatsankhaucotruyendacsac8048376-17479267044921700426563.webp" alt="Giá trị văn hoá của nghệ thuật Tuồng" />
      <div className="culture-copy explore-reveal"><span className="explore-kicker">05 · Cultural Value</span><h2>Giá trị<br /><em>văn hoá</em></h2><p>Tuồng không chỉ là nghệ thuật biểu diễn. Đó là kho tàng của ngôn ngữ, âm nhạc, mỹ thuật và những chuẩn mực tinh thần được truyền từ thế hệ này sang thế hệ khác.</p><div className="culture-points"><span>Di sản nghệ thuật sân khấu</span><span>Ngôn ngữ tạo hình độc đáo</span><span>Sợi dây kết nối các thế hệ</span></div></div>
      <blockquote className="explore-reveal">“Giữ gìn Tuồng là giữ gìn một phần hồn cốt văn hoá Việt.”</blockquote>
    </section>
    <Footer />
  </main></>;
}
