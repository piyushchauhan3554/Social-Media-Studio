import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Sparkles, Download, ChevronRight, ChevronLeft, Loader2, Image as ImageIcon, Type, Palette, Smartphone, Square, Maximize2 } from "lucide-react";

const THEMES = [
  { name: "Modern", bg: "from-indigo-50 to-pink-50", text: "text-slate-800", accent: "bg-slate-800" },
  { name: "Cyber", bg: "from-slate-900 to-slate-800", text: "text-pink-400", accent: "bg-pink-400" },
  { name: "Sunset", bg: "from-orange-400 to-pink-500", text: "text-white", accent: "bg-white" },
  { name: "Ocean", bg: "from-blue-600 to-indigo-800", text: "text-white", accent: "bg-white" },
  { name: "Minimal", bg: "bg-white", text: "text-black", accent: "bg-black" },
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

  const location = useLocation();

  useEffect(() => {
    if (location.state?.idea) {
      setIdea(location.state.idea);
    }
  }, [location.state]);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    try {
      setLoading(true);
      setSlides([]);
      setCurrentSlide(0);

      const response = await axios.post(
        "http://localhost:5000/api/generate",
        { idea, format: format.value, theme: theme.name }
      );

      const newSlides = response.data.slides;
      setSlides(newSlides);

      const history = JSON.parse(localStorage.getItem("history")) || [];
      const newEntry = {
        idea,
        slides: newSlides,
        date: new Date().toLocaleString(),
        format: format.value,
        theme: theme.name
      };
      localStorage.setItem("history", JSON.stringify([newEntry, ...history]));

    } catch (error) {
      console.error(error);
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlide = (newText) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = newText;
    setSlides(updatedSlides);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const downloadSlide = () => {
    const node = document.getElementById("slide-card");
    if (!node) return;

    htmlToImage.toPng(node).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `slide-${currentSlide + 1}.png`;
      link.href = dataUrl;
      link.click();
    }).catch(err => {
      console.error("Oops, something went wrong!", err);
    });
  };

  const slideVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    active: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center">
      
      {/* Header Area */}
      <div className="w-full mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black mb-3">
          AI Studio <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Generator</span>
        </h1>
        <p className="text-white/60 text-lg">Create, edit, and export viral social media content.</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Input Section */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Type size={20} className="text-pink-500" />
              Your Idea
            </h3>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. 5 steps to master React..."
              className="w-full p-0 bg-transparent resize-none text-xl font-medium focus:outline-none placeholder:text-white/20 text-white min-h-[120px]"
            />
          </div>

          {/* Formats */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl leading-none">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-violet-500" />
              Format
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      format.value === f.value 
                        ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]" 
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Themes */}
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl leading-none">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Palette size={20} className="text-blue-500" />
              Theme
            </h3>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    theme.name === t.name 
                      ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
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
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed py-5 rounded-3xl font-black text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Assets
              </>
            )}
          </button>
        </div>

        {/* Right Column: Preview & Editor */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {slides.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center"
            >
              <div className={`w-full max-w-[420px] ${format.ratio} relative rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 bg-white group`}>
                
                <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                  <motion.div
                    id="slide-card"
                    key={currentSlide}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="initial"
                    animate="active"
                    exit="exit"
                    className={`absolute inset-0 bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-center p-12 text-center`}
                  >
                    <textarea
                      value={slides[currentSlide]}
                      onChange={(e) => handleEditSlide(e.target.value)}
                      className={`w-full bg-transparent resize-none text-center font-black leading-tight border-none focus:ring-0 p-0 ${theme.text} ${format.value === "9:16" ? "text-2xl" : "text-3xl"}`}
                      rows={5}
                    />
                    <div className={`w-16 h-1.5 rounded-full ${theme.accent} mt-8 opacity-30`} />
                  </motion.div>
                </AnimatePresence>

                {/* Glass UI Overlays */}
                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-2 px-6 pointer-events-none">
                  {slides.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-slate-800" : "w-1.5 bg-slate-400/30"}`}
                    />
                  ))}
                </div>

                {/* Side Navigation */}
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center shadow-xl disabled:opacity-0 transition-opacity hover:bg-white active:scale-90"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center shadow-xl disabled:opacity-0 transition-opacity hover:bg-white active:scale-90"
                >
                  <ChevronRight size={28} />
                </button>
              </div>

              {/* Action Bar */}
              <div className="w-full max-w-[420px] flex items-center justify-between mt-10 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Live Editor</span>
                  <span className="text-sm font-bold text-white/80">Slide {currentSlide + 1} / {slides.length}</span>
                </div>
                
                <button
                  onClick={downloadSlide}
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-pink-100 px-6 py-3 rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
                >
                  <Download size={20} />
                  Export PNG
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-full aspect-square max-w-[420px] border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-white/20 p-12 text-center">
              <Sparkles size={64} className="mb-6 opacity-50" />
              <h4 className="text-xl font-bold mb-2 text-white/40">Preview Ready</h4>
              <p className="text-sm">Enter an idea and choose your style to see the magic happen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;