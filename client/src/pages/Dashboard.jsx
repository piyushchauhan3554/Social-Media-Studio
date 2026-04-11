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
  const [slides, setSlides] = useState([]); // [{text, visualPrompt}]
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [format, setFormat] = useState(FORMATS[0]);
  const [theme, setTheme] = useState(THEMES[0]);
  const [showVisuals, setShowVisuals] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);

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

      const rawSlides = response.data.slides;
      
      // --- IMAGE PROXYING (CONVERT TO BASE64) ---
      // We do this to bypass CORS restrictions during export
      const proxiedSlides = await Promise.all(rawSlides.map(async (slide, index) => {
        try {
          const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.visualPrompt + " social media design aesthetic")}?width=1080&height=1080&nologo=true&seed=${index}`;
          
          const imgResponse = await axios.get(imgUrl, { responseType: 'blob' });
          const reader = new FileReader();
          
          const base64Promise = new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imgResponse.data);
          });
          
          const base64 = await base64Promise;
          return { ...slide, localImage: base64 };
        } catch (e) {
          console.error("Proxying failed for slide", index, e);
          return { ...slide, localImage: null };
        }
      }));

      console.log("Post saved & Images proxied:", proxiedSlides);
      setSlides(proxiedSlides);

    } catch (error) {
      console.error("Generation Error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert(error.response?.data?.message || "Generation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlide = (newText) => {
    const updatedSlides = [...slides];
    if (updatedSlides[currentSlide] && typeof updatedSlides[currentSlide] === 'object') {
      updatedSlides[currentSlide] = { ...updatedSlides[currentSlide], text: newText };
    } else {
      updatedSlides[currentSlide] = { text: newText, visualPrompt: "", localImage: null };
    }
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

    setLoading(true);

    htmlToImage.toBlob(node, { 
      cacheBust: false, // No longer need cacheBust as it's local base64
      pixelRatio: 2,
      backgroundColor: '#000',
    })
    .then((blob) => {
      if (!blob) throw new Error("Export failed");
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `studio-export-${Date.now()}.png`;
      link.href = url;
      link.click();
      window.URL.revokeObjectURL(url);
      setLoading(false);
    })
    .catch(err => {
      console.error("Export Error Detail:", err);
      // Even simpler fallback
      htmlToImage.toPng(node)
        .then(dataUrl => {
          const l = document.createElement("a");
          l.download = `studio-export-${Date.now()}.png`;
          l.href = dataUrl;
          l.click();
          setLoading(false);
        })
        .catch(inner => {
           alert("Export failed. Try a different browser.");
           setLoading(false);
        });
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

  const getImageUrl = (prompt) => {
    if (!prompt) return "";
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " social media design aesthetic")}?width=1080&height=1080&nologo=true&seed=${currentSlide}`;
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center">
      
      {/* Header Area */}
      <div className="w-full mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black mb-3">
          AI Studio <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Generator</span>
        </h1>
        <p className="text-white/60 text-lg">Create viral visuals with AI-powered generation and editing.</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-1 space-y-6">
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

          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl leading-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-500" />
                Visuals
              </h3>
              <button 
                onClick={() => setShowVisuals(!showVisuals)}
                className={`p-2 rounded-xl border transition-all ${showVisuals ? "bg-blue-500/20 border-blue-500 text-blue-300" : "bg-white/5 border-white/10 text-white/40"}`}
              >
                {showVisuals ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
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

          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl leading-none">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Palette size={20} className="text-violet-500" />
              Theme
            </h3>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    theme.name === t.name 
                      ? "bg-violet-500/20 border-violet-500 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed py-5 rounded-3xl font-black text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Studio Working...
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
              <div className={`w-full max-w-[420px] ${format.ratio} relative rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 bg-black group`}>
                
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
                    {showVisuals && slides[currentSlide]?.localImage && (
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={slides[currentSlide].localImage} 
                          alt="AI Visual" 
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className={`absolute inset-0 ${theme.overlay} mix-blend-multiply`} />
                      </div>
                    )}

                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                       {/* Using div contentEditable instead of textarea for better image conversion compatibility */}
                       <div
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleEditSlide(e.currentTarget.textContent)}
                        className={`w-full bg-transparent resize-none text-center font-black leading-tight border-none focus:ring-0 p-0 drop-shadow-2xl scrollbar-hide outline-none ${theme.text} ${format.value === "9:16" ? "text-2xl" : "text-3xl"}`}
                      >
                        {typeof slides[currentSlide] === 'object' ? slides[currentSlide].text : slides[currentSlide]}
                      </div>
                      <div className={`w-16 h-1.5 rounded-full ${theme.accent} mt-8 opacity-30 shadow-lg`} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-10 flex justify-center gap-2 px-6 pointer-events-none z-20">
                  {slides.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-white shadow-lg" : "w-1.5 bg-white/30"}`}
                    />
                  ))}
                </div>

                {/* Side Navigation */}
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center shadow-xl disabled:opacity-0 transition-opacity hover:bg-white active:scale-90 z-30"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center shadow-xl disabled:opacity-0 transition-opacity hover:bg-white active:scale-90 z-30"
                >
                  <ChevronRight size={28} />
                </button>
              </div>

              {/* Action Bar */}
              <div className="w-full max-w-[420px] flex items-center justify-between mt-10 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Studio Engine</span>
                  <span className="text-sm font-bold text-white/80">Slide {currentSlide + 1} / {slides.length}</span>
                </div>
                
                <button
                  onClick={downloadSlide}
                  type="button"
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-pink-100 px-6 py-3 rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
                >
                  <Download size={20} />
                  Export PNG
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="w-full aspect-square max-w-[420px] border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-white/20 p-12 text-center bg-slate-900/40 backdrop-blur-xl">
              <Sparkles size={64} className="mb-6 opacity-30" />
              <h4 className="text-xl font-bold mb-2 text-white/40">Canvas Ready</h4>
              <p className="text-sm leading-relaxed">Describe your idea, pick a mode,<br />and let AI build your visual story.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;