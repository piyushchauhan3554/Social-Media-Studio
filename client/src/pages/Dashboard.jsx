import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Sparkles, Download, ChevronRight, ChevronLeft, Loader2, Image as ImageIcon, Type, Palette, Smartphone, Square, Maximize2, Eye, EyeOff } from "lucide-react";

const THEMES = [
  { name: "Neon", bg: "from-violet-900 to-indigo-900", text: "text-violet-300", accent: "bg-violet-400", overlay: "bg-black/50" },
  { name: "Cyber", bg: "from-slate-900 to-slate-800", text: "text-pink-400", accent: "bg-pink-400", overlay: "bg-black/60" },
  { name: "Sunset", bg: "from-orange-400 to-pink-500", text: "text-white", accent: "bg-white", overlay: "bg-black/40" },
  { name: "Ocean", bg: "from-blue-600 to-indigo-800", text: "text-white", accent: "bg-white", overlay: "bg-black/40" },
  { name: "Forest", bg: "from-emerald-800 to-teal-900", text: "text-emerald-300", accent: "bg-emerald-400", overlay: "bg-black/50" },
];

const FORMATS = [
  { name: "Square", value: "1:1", icon: Square, ratio: "aspect-square" },
  { name: "Story", value: "9:16", icon: Smartphone, ratio: "aspect-[9/16]" },
  { name: "Portrait", value: "4:5", icon: Maximize2, ratio: "aspect-[4/5]" },
];

function Dashboard() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [format, setFormat] = useState(FORMATS[0]);
  const [theme, setTheme] = useState(THEMES[0]);
  const [showVisuals, setShowVisuals] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.idea) setIdea(location.state.idea);
  }, [location.state]);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    try {
      setLoading(true);
      setSlides([]);
      setCurrentSlide(0);
      const response = await axios.post("http://localhost:5000/api/generate", {
        idea, format: format.value, theme: theme.name,
      });
      const rawSlides = response.data.slides;
      setSlides(rawSlides.map((slide) => ({ ...slide, localImage: null })));
      setLoading(false);
      rawSlides.forEach(async (slide, index) => {
        try {
          const imgUrl = `http://localhost:5000/api/proxy-image?prompt=${encodeURIComponent(slide.visualPrompt)}&seed=${index}`;
          const imgResponse = await fetch(imgUrl);
          const blob = await imgResponse.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          setSlides((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], localImage: base64 };
            return updated;
          });
        } catch {
          // image fail — text slide rahega
        }
      });
    } catch (error) {
      if (error.response?.status === 401) alert("Session expired. Please log in again.");
      else alert(error.response?.data?.message || "Generation failed");
      setLoading(false);
    }
  };

  const handleEditSlide = (newText) => {
    const updated = [...slides];
    updated[currentSlide] = { ...updated[currentSlide], text: newText };
    setSlides(updated);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) { setSlideDirection(1); setCurrentSlide((p) => p + 1); }
  };
  const prevSlide = () => {
    if (currentSlide > 0) { setSlideDirection(-1); setCurrentSlide((p) => p - 1); }
  };

  const downloadSlide = () => {
    const node = document.getElementById("slide-card");
    if (!node) return;
    setLoading(true);
    htmlToImage.toBlob(node, { pixelRatio: 2, backgroundColor: "#000" })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `studio-export-${Date.now()}.png`;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch(() => {
        htmlToImage.toPng(node).then((dataUrl) => {
          const l = document.createElement("a");
          l.download = `studio-export-${Date.now()}.png`;
          l.href = dataUrl;
          l.click();
          setLoading(false);
        }).catch(() => {
          alert("Export failed. Try a different browser.");
          setLoading(false);
        });
      });
  };

  const slideVariants = {
    initial: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    active: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.18 } }),
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-[.18em] uppercase text-violet-400">AI Studio</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
          Content{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500">
            Generator
          </span>
        </h1>
        <p className="text-white/40 text-[15px]">Turn your raw ideas into stunning viral carousels.</p>
      </div>

      {/* ── Idea Input — Full Width ── */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="flex items-center gap-2 mb-4">
          <Type size={14} className="text-pink-400" />
          <span className="text-[11px] font-bold tracking-[.14em] uppercase text-white/30">Your Idea</span>
        </div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. 5 healthy breakfast ideas for kids that are quick and delicious..."
          className="w-full bg-transparent resize-none text-[16px] font-medium focus:outline-none placeholder:text-white/15 text-white min-h-[70px] leading-relaxed"
        />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent group-hover:via-violet-500/20 transition-all" />
      </div>

      {/* ── Controls + Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Controls — 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Visuals + Format */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-blue-400" />
                <span className="text-[11px] font-bold tracking-[.14em] uppercase text-white/30">Visuals & Format</span>
              </div>
              <button
                onClick={() => setShowVisuals(!showVisuals)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  showVisuals
                    ? "bg-blue-500/15 border-blue-400/40 text-blue-300"
                    : "bg-white/[0.04] border-white/[0.08] text-white/30"
                }`}
              >
                {showVisuals ? <Eye size={12} /> : <EyeOff size={12} />}
                {showVisuals ? "On" : "Off"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f)}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all gap-2 ${
                      format.value === f.value
                        ? "bg-pink-500/15 border-pink-400/50 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                        : "bg-white/[0.03] border-white/[0.07] text-white/30 hover:text-white/60 hover:bg-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
            <div className="flex items-center gap-2 mb-4">
              <Palette size={14} className="text-violet-400" />
              <span className="text-[11px] font-bold tracking-[.14em] uppercase text-white/30">Theme</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-bold transition-all ${
                    theme.name === t.name
                      ? "bg-violet-500/15 border-violet-400/50 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                      : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md bg-gradient-to-br flex-shrink-0 ${t.bg}`} />
                  {t.name}
                  {theme.name === t.name && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-[15px] transition-all hover:-translate-y-[1px] hover:shadow-[0_10px_32px_rgba(124,58,237,0.4)] active:scale-[.99] shadow-lg shadow-violet-500/20"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={20} /> Generate Assets</>
            )}
          </button>
        </div>

        {/* Preview — 3 cols */}
        <div className="lg:col-span-3 flex flex-col items-center gap-5">
          {slides.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center gap-5"
            >
              {/* Slide */}
              <div className="relative flex items-center justify-center w-full">

                {/* Glow behind slide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[300px] h-[300px] bg-gradient-to-br from-violet-600/20 to-pink-500/20 rounded-full blur-[60px]" />
                </div>

                <div
                  className={`
                    relative overflow-hidden border border-white/[0.1] bg-black
                    ${format.value === "1:1" ? "w-full max-w-[420px] aspect-square rounded-[28px]" : ""}
                    ${format.value === "9:16" ? "w-[260px] aspect-[9/16] rounded-[28px]" : ""}
                    ${format.value === "4:5" ? "w-[340px] aspect-[4/5] rounded-[28px]" : ""}
                  `}
                  style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}
                >
                  <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                    <motion.div
                      id="slide-card"
                      key={currentSlide}
                      custom={slideDirection}
                      variants={slideVariants}
                      initial="initial"
                      animate="active"
                      exit="exit"
                      className={`absolute inset-0 bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-center p-10 text-center`}
                    >
                      {showVisuals && slides[currentSlide]?.localImage && (
                        <div className="absolute inset-0 z-0">
                          <img src={slides[currentSlide].localImage} alt="Visual" className="w-full h-full object-cover opacity-65" />
                          <div className={`absolute inset-0 ${theme.overlay}`} />
                        </div>
                      )}
                      {showVisuals && !slides[currentSlide]?.localImage && (
                        <div className="absolute inset-0 z-0 bg-white/[0.03] animate-pulse" />
                      )}
                      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                        <div
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleEditSlide(e.currentTarget.textContent)}
                          className={`w-full bg-transparent text-center font-black leading-tight outline-none drop-shadow-2xl ${theme.text} ${format.value === "9:16" ? "text-xl" : "text-2xl md:text-3xl"}`}
                        >
                          {typeof slides[currentSlide] === "object" ? slides[currentSlide].text : slides[currentSlide]}
                        </div>
                        <div className={`w-12 h-1 rounded-full ${theme.accent} mt-6 opacity-30`} />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dot indicators */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                    {slides.map((_, idx) => (
                      <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-white" : "w-1 bg-white/30"}`} />
                    ))}
                  </div>

                  {/* Prev/Next */}
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white disabled:opacity-0 transition-all hover:bg-black/70 active:scale-90 z-30"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white disabled:opacity-0 transition-all hover:bg-black/70 active:scale-90 z-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="w-full max-w-[420px] flex items-center justify-between px-5 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-[.15em] text-white/20">Studio Engine</p>
                  <p className="text-[13px] font-bold text-white/60 mt-0.5">
                    Slide {currentSlide + 1} / {slides.length}
                  </p>
                </div>
                <button
                  onClick={downloadSlide}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(124,58,237,0.35)] active:scale-95"
                >
                  <Download size={15} />
                  Export PNG
                </button>
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <div className="relative w-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[280px] h-[280px] bg-gradient-to-br from-violet-600/10 to-pink-500/10 rounded-full blur-[60px]" />
              </div>
              <div className="w-full max-w-[420px] aspect-square border border-dashed border-white/[0.08] rounded-[28px] flex flex-col items-center justify-center gap-5 bg-white/[0.01] relative">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <Sparkles size={28} className="text-white/25" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-bold text-white/30 mb-1.5">Canvas Ready</p>
                  <p className="text-[13px] text-white/18 leading-relaxed">
                    Describe your idea, pick a format,<br />and let AI build your visual story.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;