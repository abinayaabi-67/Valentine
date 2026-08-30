import React, { useState, useCallback, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import HTMLFlipBook from "react-pageflip";
import "./App.css";

const Page = React.forwardRef(({ photo, caption }, ref) => (
  <div className="flip-page" ref={ref}>
    <div className="flip-page-content">
      <div className="flip-page-img-wrap">
        <img src={`/photos/${photo}`} alt={caption} className="flip-page-img" />
      </div>
      <p className="flip-page-caption">{caption}</p>
    </div>
  </div>
));

const FLOATING_HEARTS = [
  "❤️",
  "💕",
  "💗",
  "💖",
  "💝",
  "❤️",
  "💕",
  "💗",
  "💖",
  "💝",
  "❤️",
  "💕",
  "💗",
  "💖",
  "💝",
];

// Falling hearts on success page (repeated for a full rain effect)
const FALLING_HEARTS = Array.from({ length: 24 }, (_, i) => ({
  char: FLOATING_HEARTS[i % FLOATING_HEARTS.length],
  left: (i * 17 + 5) % 95,
  delay: (i * 0.5) % 12,
  duration: 6 + (i % 5),
}));

const LETTER_LINES = [
  "I feel happiest only when I am with you 💝. I don’t even know how these 8 years have passed by 🥹✨. If someone asks me who I need in this world 🌎, I would say that you alone are enough for me ❤️.",
  "I’m dedicating this line from a song:",
  "கல்லறையிலும் கூட ஜன்னல் ஒன்று வைத்து உந்தன் முகம் பார்ப்பேனடி…” 💕💖⚰️",
];
const REASONS = [
  "My career started with you as my first role model. 🌟",
  "You have given me so much advice. 🧠💬",
  "Whenever I am with you, I always feel happy.😍 ",
  "You never raise your voice at 💛😊",
  "You support me in whatever I do. 🙌💖",
];

// Add your photo filenames here (place files in public/photos/)
const PHOTOS = [
  "1.png",
  "2.png",
  // "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  // "10.png",
  "11.png",
  "12.png",
  // "13.png",
  "14.png",
  "16.png",
];

// Catchy lovable sentences for each photo (edit to match your photos)
const PHOTO_CAPTIONS = [
  "You are my today, my tomorrow, and my forever love ❤️",
  "Every moment with you feels like a beautiful dream 💕",
  "I found my home, my heart, and my happiness in you 🏡❤️",
  "Loving you is my favorite adventure every single day 💖",
  "You make my world brighter just by being in it 🌍✨",
  "My heart beats a little softer whenever you smile at me 💓",
  "With you, ordinary days turn into magical memories 💞",
  "You are the reason behind my endless smiles and joy 😊❤️",
  "Forever isn't long enough when I'm standing beside you 💍💕",
  "Your love is my safe place in this chaotic world 🌹❤️",
  "I fall in love with you more every single day 💘",
  "Holding your hand feels like holding my entire universe 🌌💖",
  "You are my sweetest hello and hardest goodbye always 💞",
  "My heart chose you, and it will always choose you ❤️",
  "Loving you feels like the most beautiful blessing ever 🌸💕",
];

// Add your Tamil love song as public/songs/love-song.mp3
const SONG_PATH = "/songs/lovesong.mp3";

function App() {
  const [step, setStep] = useState("landing");
  const [noButtonPos, setNoButtonPos] = useState({ x: 55, y: 55 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const flipbookSize =
    windowSize.width <= 480
      ? { width: Math.min(300, windowSize.width - 32), height: 420 }
      : windowSize.width <= 600
        ? { width: 340, height: 460 }
        : { width: 380, height: 520 };
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const [albumPhotoIndex, setAlbumPhotoIndex] = useState(0);
  const initialPageRef = useRef(0);
  const bookRef = useRef(null);
  const audioRef = useRef(null);

  const openAlbum = useCallback((index) => {
    initialPageRef.current = index;
    setAlbumPhotoIndex(index);
    setAlbumOpen(true);
  }, []);

  const closeAlbum = useCallback(() => setAlbumOpen(false), []);

  const handleBookInit = useCallback(() => {
    const page = initialPageRef.current;
    if (bookRef.current?.pageFlip && page > 0) {
      bookRef.current.pageFlip().turnToPage(page);
    }
  }, []);

  const goToPrevPhoto = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipPrev();
  }, []);

  const goToNextPhoto = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipNext();
  }, []);

  const handleFlip = useCallback((e) => {
    setAlbumPhotoIndex(e.data);
  }, []);

  const playMusic = useCallback(() => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
  }, [isMusicPlaying]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
  }, [isMusicPlaying]);

  const runAway = useCallback(() => {
    setNoButtonPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 75 + 12,
    });
  }, []);

  const handleYes = useCallback(() => {
    playMusic();
    setShowConfetti(true);
    setStep("valentine-wish");
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    const t = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(t);
  }, [playMusic]);

  const handleValentineConfirm = useCallback(() => {
    setStep("success");
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!albumOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeAlbum();
      if (e.key === "ArrowLeft") goToPrevPhoto();
      if (e.key === "ArrowRight") goToNextPhoto();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [albumOpen, closeAlbum, goToPrevPhoto, goToNextPhoto]);


  return (
    <>
      <audio ref={audioRef} src={SONG_PATH} loop />
      <button
        type="button"
        className="music-toggle"
        onClick={toggleMusic}
        title={isMusicPlaying ? "Pause music" : "Play music"}
        aria-label={isMusicPlaying ? "Pause music" : "Play music"}
      >
        {isMusicPlaying ? "🔊" : "🔇"}
      </button>
      <div className="floating-hearts" aria-hidden="true">
        {FLOATING_HEARTS.map((heart, i) => (
          <span key={i} style={{ animationDelay: `${i * -1.5}s` }}>
            {heart}
          </span>
        ))}
      </div>

      {showConfetti && (
        <div className="confetti-wrap">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={350}
            recycle={false}
            colors={["#b91c3c", "#e11d48", "#c9a227", "#fad4c8", "#9f1239"]}
          />
        </div>
      )}

      <div
        className={`container ${step === "success" || step === "valentine-wish" ? "wide" : ""}`}
      >
        {step === "landing" && (
          <div className="slide slide-landing">
            <div className="landing-card">
              <div className="heart-icon landing-heart" aria-hidden="true">
                ❤️
              </div>
              <h1 className="landing-title">
                Sudhan{" "}
                <span className="landing-heart-emoji" aria-hidden="true">
                  💘
                </span>
              </h1>
              <h3 className="landing-subtitle">
                A small surprise made with all my heart is waiting inside{" "}
                <span aria-hidden="true">💌</span>
              </h3>
              <button
                type="button"
                className="cta-button primary landing-cta"
                onClick={() => {
                  playMusic();
                  setStep("letter");
                }}
              >
                Open it
              </button>
            </div>
          </div>
        )}

        {step === "letter" && (
          <div className="letter-box slide">
            <div className="letter-content">
              <p className="letter-intro">From your partner.</p>
              {LETTER_LINES.map((line, i) => (
                <p key={i} className="letter-line letter-line-visible">
                  {line}
                </p>
              ))}
            </div>
            <button
              type="button"
              className="cta-button primary"
              onClick={() => setStep("question")}
            >
              Keep going
            </button>
          </div>
        )}

        {step === "question" && (
          <div className="question-box slide">
            <div className="heart-icon" aria-hidden="true">
              💝
            </div>
            <h2 className="title">Will you be my Valentine?</h2>
            <p className="subtitle">
              (There's only one right answer. Just saying.)
            </p>
            <div className="buttons-row">
              <button type="button" className="yes-btn" onClick={handleYes}>
                Yes! 💕
              </button>
              <button
                type="button"
                className="no-btn"
                style={{
                  left: `${noButtonPos.x}%`,
                  top: `${noButtonPos.y}%`,
                }}
                onMouseEnter={runAway}
                onClick={runAway}
              >
                No
              </button>
            </div>
            <p className="funny-hint">
              (The "No" button is just for show. You know you want to say yes.
              😏)
            </p>
          </div>
        )}

        {step === "valentine-wish" && (
          <div className="valentine-wish-box slide">
            <div className="heart-icon" aria-hidden="true">
              💕
            </div>

            <h2 className="title">
              <span style={{ textDecoration: "line-through" }}>Fuck</span>{" "}
              Valentine&apos;s Day. I Love You every single day ❤️
            </h2>
            <p className="success-message success-main">
              Wishing you a day filled with love, joy, and all the things that
              make you smile.
            </p>
            <button
              type="button"
              className="cta-button primary"
              onClick={handleValentineConfirm}
            >
              🥰 Tap to Feel the Love💗
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="success-box slide">
            <div className="heart-icon" aria-hidden="true">
              💕
            </div>
            <h2 className="success-title">Abi Loves Sudhan ❤️</h2>
            <p className="success-message success-main">
              You're my person. I'm glad we're doing everything together.
            </p>
            <p className="success-message">
              You make my life brighter, happier, and more beautiful every day.
            </p>
            <div className="reasons-section">
              <p className="reasons-label">
                Little things that make me love you more:
              </p>
              <div className="reason-card">
                <p className="reason-text">{REASONS[reasonIndex]}</p>
                <div className="reason-nav">
                  <button
                    type="button"
                    className="reason-btn"
                    onClick={() =>
                      setReasonIndex((i) =>
                        i > 0 ? i - 1 : REASONS.length - 1,
                      )
                    }
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <span className="reason-count">
                    {reasonIndex + 1} / {REASONS.length}
                  </span>
                  <button
                    type="button"
                    className="reason-btn"
                    onClick={() =>
                      setReasonIndex((i) =>
                        i < REASONS.length - 1 ? i + 1 : 0,
                      )
                    }
                    aria-label="Next"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
            {PHOTOS.length > 0 && (
              <div className="photos-section">
                <p className="photos-label">Us</p>
                <div className="photo-grid">
                  {PHOTOS.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      className="photo-card"
                      onClick={() => openAlbum(i)}
                    >
                      <div className="photo-frame">
                        <img
                          src={`/photos/${photo}`}
                          alt={`Photo ${i + 1}`}
                          className="photo-img photo-animate"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        />
                      </div>
                      <p className="photo-caption-small">
                        {PHOTO_CAPTIONS[i] ?? PHOTO_CAPTIONS[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {albumOpen && (
              <div
                className="album-overlay"
                onClick={closeAlbum}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="album-viewer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="album-close"
                    onClick={closeAlbum}
                    aria-label="Close album"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className="album-nav album-prev"
                    onClick={goToPrevPhoto}
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <div className="flipbook-container">
                    <HTMLFlipBook
                      ref={bookRef}
                      width={flipbookSize.width}
                      height={flipbookSize.height}
                      size="fixed"
                      drawShadow
                      flippingTime={600}
                      onFlip={handleFlip}
                      onInit={handleBookInit}
                      className="valentine-flipbook"
                      style={{}}
                    >
                      {PHOTOS.map((photo, i) => (
                        <Page
                          key={i}
                          photo={photo}
                          caption={PHOTO_CAPTIONS[i] ?? PHOTO_CAPTIONS[0]}
                        />
                      ))}
                    </HTMLFlipBook>
                  </div>
                  <button
                    type="button"
                    className="album-nav album-next"
                    onClick={goToNextPhoto}
                    aria-label="Next photo"
                  >
                    →
                  </button>
                  <p className="album-caption">
                    {PHOTO_CAPTIONS[albumPhotoIndex] ?? PHOTO_CAPTIONS[0]}
                  </p>
                  <span className="album-counter">
                    {albumPhotoIndex + 1} / {PHOTOS.length}
                  </span>
                </div>
              </div>
            )}
            <p className="funny-footer">
              P.S. The "No" button was never an option. 😂
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
