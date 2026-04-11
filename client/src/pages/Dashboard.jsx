import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { Sparkles, Download, ChevronRight, ChevronLeft, Loader2, Image as ImageIcon } from "lucide-react";

function Dashboard() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

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
        { idea }
      );

      const newSlides = response.data.slides;
      setSlides(newSlides);

      const history = JSON.parse(localStorage.getItem("history")) || [];
      const newEntry = {
        idea,
        slides: newSlides,
        date: new Date().toLocaleString(),
      };
      localStorage.setItem("history", JSON.stringify([newEntry, ...history]));

    } catch (error) {
      console.error(error);
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      
      {/* Header Area */}
      <div className="w-full mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black mb-3">
          AI Studio <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Generator</span>
        </h1>
        <p className="text-white/60 text-lg">Type any idea to generate a stunning Instagram carousel.</p>
      </div>

      {/* Input Section */}
      <div className="w-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. 5 tips for better sleep... or just paste a blog post URL!"
          className="w-full p-6 bg-transparent resize-none text-xl md:text-2xl font-medium focus:outline-none placeholder:text-white/30 text-white min-h-[120px]"
        />
        
        <div className="flex justify-end p-2 border-t border-white/5">
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Slides
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {slides.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[500px] flex flex-col items-center"
        >
          {/* Carousel Container (Instagram 1:1 Aspect Ratio) */}
          <div className="w-full aspect-square relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-white">
            
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                id="slide-card"
                key={currentSlide}
                custom={slideDirection}
                variants={slideVariants}
                initial="initial"
                animate="active"
                exit="exit"
                className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-12 text-center"
              >
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                    {slides[currentSlide]}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Subtle Gradient overlay for the card edge vibe */}
            <div className="absolute inset-0 border-[12px] border-white/50 pointer-events-none rounded-3xl mix-blend-overlay"></div>
            
            {/* Pagination Indicators inside image */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-slate-800 scale-125" : "bg-slate-400/50"}`}
                />
              ))}
            </div>

            {/* Side Navigation Buttons overlay */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-lg disabled:opacity-0 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-lg disabled:opacity-0 transition-opacity hover:bg-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex items-center justify-between mt-8 gap-4">
            <div className="text-sm font-medium text-white/50 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              Slide {currentSlide + 1} of {slides.length}
            </div>
            
            <button
              onClick={downloadSlide}
              className="flex items-center gap-2 bg-white text-slate-900 hover:bg-pink-100 px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              <Download size={20} />
              Save Image
            </button>
          </div>

        </motion.div>
      )}

    </div>
  );
}

export default Dashboard;