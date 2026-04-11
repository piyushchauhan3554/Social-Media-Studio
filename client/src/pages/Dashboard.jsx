import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Sparkles, Download, ChevronRight, ChevronLeft, Loader2, Image as ImageIcon, Type, Palette, Smartphone, Square, Maximize2, Eye, EyeOff } from "lucide-react";

const THEMES = [
  { name: "Modern", bg: "from-indigo-50 to-pink-50", text: "text-slate-800", accent: "bg-slate-800", overlay: "bg-white/20" },
  { name: "Cyber", bg: "from-slate-900 to-slate-800", text: "text-pink-400", accent: "bg-pink-400", overlay: "bg-black/60" },
  { name: "Sunset", bg: "from-orange-400 to-pink-500", text: "text-white", accent: "bg-white", overlay: "bg-black/40" },
  { name: "Ocean", bg: "from-blue-600 to-indigo-800", text: "text-white", accent: "bg-white", overlay: "bg-black/40" },
  { name: "Minimal", bg: "bg-white", text: "text-black", accent: "bg-black", overlay: "bg-white/10" },
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
      const proxiedSlides = await Promise.all(rawSlides.map(async (slide, index) => {
        try {
          const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.visualPrompt + " social media design aesthetic")}?width=1080&height=1080&nologo=true&seed=${index}`;
          const imgResponse = await axios.get(imgUrl, { responseType: "blob" });
          const reader = new FileReader();
          const base64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imgResponse.data);
          });
          return { ...slide, localImage: base64 };
        } catch {
          return { ...slide, localImage: null };
        }
      }));
      setSlides(proxiedSlides);
    } catch (error) {
      if (error.response?.status === 401) alert("Session expired. Please log in again.");
      else alert(error.response?.data?.message || "Generation failed");
    } finally {
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
        }).catch(() => { alert("Export failed. Try a different browser."); setLoading(false); });
      });
  };

  const slideVariants = {
    initial: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    active: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.18 } }),
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center px-4 py-8">

      {/* Header */}
      <div className="w-full mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-[.18em] uppercase text-violet-400">AI Studio</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
          Content{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Generator
          </span>
        </h1>
        <p className="text-white/40 text-base">Create viral visuals with AI-powered generation and editing.</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left Column ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Idea Input */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <h3 className="text-[11px] font-bold tracking-[.14em] uppercase text-white/30 mb-3 flex items-center gap-2">
              <Type size={13} className="text-pink-400" />
              Your Idea
            </h3>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. 5 steps to master React..."
              className="w-full bg-transparent resize-none text-[15px] font-medium focus:outline-none placeholder:text-white/15 text-white min-h-[110px] leading-relaxed"
            />
          </div>

          {/* Visuals + Format */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold tracking-[.14em] uppercase text-white/30 flex items-center gap-2">
                <ImageIcon size={13} className="text-blue-400" />
                Visuals & Format
              </h3>
              <button
                onClick={() => setShowVisuals(!showVisuals)}
                className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  showVisuals
                    ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                    : "bg-white/[0.04] border-white/[0.08] text-white/30"
                }`}
              >
                {showVisuals ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{showVisuals ? "On" : "Off"}</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f)}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                      format.value === f.value
                        ? "bg-pink-500/15 border-pink-500/50 text-pink-300"
                        : "bg-white/[0.03] border-white/[0.07] text-white/30 hover:text-white/60 hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon size={18} className="mb-1.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <h3 className="text-[11px] font-bold tracking-[.14em] uppercase text-white/30 mb-3 flex items-center gap-2">
              <Palette size={13} className="text-violet-400" />
              Theme
            </h3>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide transition-all ${
                    theme.name === t.name
                      ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                      : "bg-white/[0.03] border-white/[0.07] text-white/30 hover:text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-[15px] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)] active:scale-[.99]"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={20} /> Generate Assets</>
            )}
          </button>
        </div>

        {/* ── Right Column: Preview ── */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {slides.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              {/* Slide Card */}
              <div className={`w-full max-w-[400px] ${format.ratio} relative rounded-[32px] overflow-hidden border border-white/[0.08] bg-black`}
                style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}
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
                        <img src={slides[currentSlide].localImage} alt="AI Visual" className="w-full h-full object-cover opacity-70" />
                        <div className={`absolute inset-0 ${theme.overlay} mix-blend-multiply`} />
                      </div>
                    )}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                      <div
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleEditSlide(e.currentTarget.textContent)}
                        className={`w-full bg-transparent text-center font-black leading-tight outline-none drop-shadow-2xl ${theme.text} ${format.value === "9:16" ? "text-2xl" : "text-3xl"}`}
                      >
                        {typeof slides[currentSlide] === "object" ? slides[currentSlide].text : slides[currentSlide]}
                      </div>
                      <div className={`w-12 h-1 rounded-full ${theme.accent} mt-7 opacity-25`} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot Indicators */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-1.5 pointer-events-none z-20">
                  {slides.map((_, idx) => (
                    <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-white" : "w-1 bg-white/30"}`} />
                  ))}
                </div>

                {/* Prev / Next */}
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/10 disabled:opacity-0 transition-all hover:bg-black/70 active:scale-90 z-30"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/10 disabled:opacity-0 transition-all hover:bg-black/70 active:scale-90 z-30"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Action Bar */}
              <div className="w-full max-w-[400px] flex items-center justify-between mt-5 px-5 py-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-[.14em] text-white/25">Studio Engine</p>
                  <p className="text-[13px] font-bold text-white/70 mt-0.5">
                    Slide {currentSlide + 1} / {slides.length}
                  </p>
                </div>
                <button
                  onClick={downloadSlide}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(124,58,237,0.3)] active:scale-95"
                >
                  <Download size={16} />
                  Export PNG
                </button>
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <div className="w-full aspect-square max-w-[400px] border border-dashed border-white/[0.08] rounded-[32px] flex flex-col items-center justify-center text-center p-12 bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-5">
                <Sparkles size={28} className="text-white/20" />
              </div>
              <h4 className="text-base font-bold text-white/30 mb-2">Canvas Ready</h4>
              <p className="text-[13px] text-white/20 leading-relaxed">
                Describe your idea, pick a format,<br />and let AI build your visual story.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;