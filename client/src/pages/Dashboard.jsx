import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import {
  Sparkles,
  Download,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  Type,
  Palette,
  Smartphone,
  Square,
  Maximize2,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  Hash,
  Smile,
  Briefcase,
  Heart,
  GraduationCap,
  Layers,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const THEMES = [
  {
    name: "Neon",
    bg: "from-violet-900 to-indigo-900",
    text: "text-violet-300",
    accent: "bg-violet-400",
    overlay: "bg-black/50",
  },
  {
    name: "Cyber",
    bg: "from-slate-900 to-slate-800",
    text: "text-pink-400",
    accent: "bg-pink-400",
    overlay: "bg-black/60",
  },
  {
    name: "Sunset",
    bg: "from-orange-400 to-pink-500",
    text: "text-white",
    accent: "bg-white",
    overlay: "bg-black/40",
  },
  {
    name: "Ocean",
    bg: "from-blue-600 to-indigo-800",
    text: "text-white",
    accent: "bg-white",
    overlay: "bg-black/40",
  },
  {
    name: "Forest",
    bg: "from-emerald-800 to-teal-900",
    text: "text-emerald-300",
    accent: "bg-emerald-400",
    overlay: "bg-black/50",
  },
];

const FORMATS = [
  { name: "Square", value: "1:1", icon: Square, ratio: "aspect-square" },
  { name: "Story", value: "9:16", icon: Smartphone, ratio: "aspect-[9/16]" },
  { name: "Portrait", value: "4:5", icon: Maximize2, ratio: "aspect-[4/5]" },
];

const TONES = [
  { name: "Educational", icon: GraduationCap, color: "text-blue-500" },
  { name: "Inspirational", icon: Heart, color: "text-rose-500" },
  { name: "Professional", icon: Briefcase, color: "text-slate-500" },
  { name: "Funny", icon: Smile, color: "text-amber-500" },
];

const SLIDE_COUNTS = [3, 5, 7];

// ── Sortable Slide Thumbnail ──
function SortableThumb({ slide, index, isActive, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
        isActive
          ? "border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.themeBg || "from-slate-800 to-slate-900"}`}
      />
      {slide.localImage && (
        <img
          src={slide.localImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 flex items-end justify-start p-1.5">
        <span className="text-[9px] font-black text-white/80 bg-black/40 rounded-md px-1.5 py-0.5">
          {index + 1}
        </span>
      </div>
    </div>
  );
}



function Dashboard() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [format, setFormat] = useState(FORMATS[0]);
  const [theme, setTheme] = useState(THEMES[0]);
  const [showVisuals, setShowVisuals] = useState(true);
  const [tone, setTone] = useState(TONES[0]);
  const [slideCount, setSlideCount] = useState(5);
  const [caption, setCaption] = useState(null);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);

  const location = useLocation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    if (location.state?.idea) setIdea(location.state.idea);
  }, [location.state]);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    try {
      setLoading(true);
      setSlides([]);
      setCaption(null);
      setCurrentSlide(0);
      const response = await axios.post("http://localhost:5000/api/generate", {
        idea,
        format: format.value,
        theme: theme.name,
        tone: tone.name,
        slideCount,
      });
      const rawSlides = response.data.slides;
      // Give each slide a unique id for dnd-kit
      setSlides(
        rawSlides.map((slide, i) => ({
          ...slide,
          id: `slide-${Date.now()}-${i}`,
          localImage: null,
          themeBg: theme.bg,
        })),
      );
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
          // image fail
        }
      });
    } catch (error) {
      if (error.response?.status === 401)
        alert("Session expired. Please log in again.");
      else alert(error.response?.data?.message || "Generation failed");
      setLoading(false);
    }
  };

  const downloadAllSlides = async () => {
  if (!slides.length) return;
  setExportingAll(true);

  try {
    const zip = new JSZip();

    for (let i = 0; i < slides.length; i++) {
      // Temporarily set current slide to i for export
      const node = document.getElementById("slide-card");

      // Slide ko render karne ke liye state update + wait
      setCurrentSlide(i);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const node2 = document.getElementById("slide-card");
      if (!node2) continue;

      const blob = await htmlToImage.toBlob(node2, {
        pixelRatio: 2,
        backgroundColor: "#000",
      });

      if (blob) {
        zip.file(`slide-${i + 1}.png`, blob);
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `studio-export-${Date.now()}.zip`);
  } catch (err) {
    alert("Export failed. Try again.");
  } finally {
    setExportingAll(false);
  }
};

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    setSlides((prev) => arrayMove(prev, oldIndex, newIndex));
    setCurrentSlide(newIndex);
  };

  const handleRegenerateSlide = async () => {
    if (!idea.trim()) return;
    try {
      setRegenerating(true);
      const response = await axios.post(
        "http://localhost:5000/api/regenerate-slide",
        {
          idea,
          slideIndex: currentSlide,
          format: format.value,
          theme: theme.name,
        },
      );
      const newSlide = response.data.slide;
      setSlides((prev) => {
        const updated = [...prev];
        updated[currentSlide] = {
          ...updated[currentSlide],
          text: newSlide.text,
          visualPrompt: newSlide.visualPrompt,
          localImage: null,
        };
        return updated;
      });
      try {
        const imgUrl = `http://localhost:5000/api/proxy-image?prompt=${encodeURIComponent(newSlide.visualPrompt)}&seed=${Date.now()}`;
        const imgResponse = await fetch(imgUrl);
        const blob = await imgResponse.blob();
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        setSlides((prev) => {
          const updated = [...prev];
          updated[currentSlide] = {
            ...updated[currentSlide],
            localImage: base64,
          };
          return updated;
        });
      } catch {}
    } catch (error) {
      alert(error.response?.data?.message || "Regenerate failed");
    } finally {
      setRegenerating(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!idea.trim()) return;
    try {
      setCaptionLoading(true);
      setCaption(null);
      const response = await axios.post(
        "http://localhost:5000/api/generate-caption",
        {
          idea,
          theme: theme.name,
          format: format.value,
          tone: tone.name,
        },
      );
      setCaption(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Caption generation failed");
    } finally {
      setCaptionLoading(false);
    }
  };

  const handleCopyCaption = () => {
    if (!caption) return;
    const hashtags = caption.hashtags.map((h) => `#${h}`).join(" ");
    navigator.clipboard.writeText(`${caption.caption}\n\n${hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSlide = (newText) => {
    const updated = [...slides];
    updated[currentSlide] = { ...updated[currentSlide], text: newText };
    setSlides(updated);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setSlideDirection(1);
      setCurrentSlide((p) => p + 1);
    }
  };
  const prevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection(-1);
      setCurrentSlide((p) => p - 1);
    }
  };

  const downloadSlide = () => {
    const node = document.getElementById("slide-card");
    if (!node) return;
    setLoading(true);
    htmlToImage
      .toBlob(node, { pixelRatio: 2, backgroundColor: "#000" })
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
        htmlToImage
          .toPng(node)
          .then((dataUrl) => {
            const l = document.createElement("a");
            l.download = `studio-export-${Date.now()}.png`;
            l.href = dataUrl;
            l.click();
            setLoading(false);
          })
          .catch(() => {
            alert("Export failed.");
            setLoading(false);
          });
      });
  };

  const slideVariants = {
    initial: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    active: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      transition: { duration: 0.18 },
    }),
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-6xl font-black mb-2 text-slate-900 dark:text-slate-50">
          Content{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[16px] font-medium">
          Turn your raw ideas into stunning viral carousels.
        </p>
      </div>

      {/* Idea Input */}
      <div className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-sm">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="flex items-center gap-2 mb-4">
          <Type size={14} className="text-rose-500" />
          <span className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500">
            Your Idea
          </span>
        </div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. 5 healthy breakfast ideas for kids that are quick and delicious..."
          className="w-full bg-transparent resize-none text-[17px] font-medium focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-slate-50 min-h-[80px] leading-relaxed"
        />
      </div>

      {/* Controls + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Visuals + Format */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-indigo-500" />
                <span className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500">
                  Visuals & Format
                </span>
              </div>
              <button
                onClick={() => setShowVisuals(!showVisuals)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${showVisuals ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"}`}
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
                    className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all gap-2 ${format.value === f.value ? "bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/50 text-indigo-600 dark:text-indigo-400 shadow-sm" : "bg-white dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {f.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent" />
            <div className="flex items-center gap-2 mb-4">
              <Palette size={14} className="text-rose-500" />
              <span className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500">
                Theme
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-bold transition-all ${theme.name === t.name ? "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300" : "bg-white dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-md bg-gradient-to-br flex-shrink-0 ${t.bg}`}
                  />
                  {t.name}
                  {theme.name === t.name && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Slide Count */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
            <div className="flex items-center gap-2 mb-4">
              <Layers size={14} className="text-violet-500" />
              <span className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500">
                Slide Count
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {SLIDE_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setSlideCount(count)}
                  className={`py-3 rounded-xl border text-[15px] font-black transition-all ${slideCount === count ? "bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/50 text-violet-600 dark:text-violet-400 shadow-sm" : "bg-white dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <div className="flex items-center gap-2 mb-4">
              <Smile size={14} className="text-amber-500" />
              <span className="text-[11px] font-bold tracking-[.14em] uppercase text-slate-400 dark:text-slate-500">
                Tone
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.name}
                    onClick={() => setTone(t)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-[12px] font-bold transition-all ${tone.name === t.name ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-sm" : "bg-white dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                  >
                    <Icon
                      size={14}
                      className={
                        tone.name === t.name ? "text-amber-500" : t.color
                      }
                    />
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            className="w-full flex items-center justify-center gap-2.5 bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-[15px] text-white dark:text-slate-950 transition-all hover:-translate-y-[1px] hover:shadow-xl active:scale-[.99] shadow-lg shadow-slate-900/10"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Assets
              </>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 flex flex-col items-center gap-5">
          {slides.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center gap-5"
            >
              {/* Slide Preview */}
              <div className="relative flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[300px] h-[300px] bg-gradient-to-br from-violet-600/20 to-pink-500/20 rounded-full blur-[60px]" />
                </div>
                <div
                  className={`relative overflow-hidden border border-white/[0.1] bg-black
                    ${format.value === "1:1" ? "w-full max-w-[420px] aspect-square rounded-[28px]" : ""}
                    ${format.value === "9:16" ? "w-[260px] aspect-[9/16] rounded-[28px]" : ""}
                    ${format.value === "4:5" ? "w-[340px] aspect-[4/5] rounded-[28px]" : ""}
                  `}
                  style={{
                    boxShadow:
                      "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  <AnimatePresence
                    initial={false}
                    custom={slideDirection}
                    mode="wait"
                  >
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
                          <img
                            src={slides[currentSlide].localImage}
                            alt="Visual"
                            className="w-full h-full object-cover opacity-65"
                          />
                          <div
                            className={`absolute inset-0 ${theme.overlay}`}
                          />
                        </div>
                      )}
                      {showVisuals && !slides[currentSlide]?.localImage && (
                        <div className="absolute inset-0 z-0 bg-white/[0.03] animate-pulse" />
                      )}
                      {regenerating && (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                          <Loader2
                            size={28}
                            className="animate-spin text-white"
                          />
                          <p className="text-white/70 text-[13px] font-bold">
                            Regenerating slide...
                          </p>
                        </div>
                      )}
                      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                        <div
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) =>
                            handleEditSlide(e.currentTarget.textContent)
                          }
                          className={`w-full bg-transparent text-center font-black leading-tight outline-none drop-shadow-2xl ${theme.text} ${format.value === "9:16" ? "text-xl" : "text-2xl md:text-3xl"}`}
                        >
                          {typeof slides[currentSlide] === "object"
                            ? slides[currentSlide].text
                            : slides[currentSlide]}
                        </div>
                        <div
                          className={`w-12 h-1 rounded-full ${theme.accent} mt-6 opacity-30`}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                    {slides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6 bg-white" : "w-1 bg-white/30"}`}
                      />
                    ))}
                  </div>

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

              {/* ── Drag & Drop Thumbnails ── */}
              <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-bold tracking-[.12em] uppercase text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                  <GripVertical size={11} />
                  Drag to reorder slides
                </p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={slides.map((s) => s.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {slides.map((slide, index) => (
                        <SortableThumb
                          key={slide.id}
                          slide={slide}
                          index={index}
                          isActive={index === currentSlide}
                          onClick={() => {
                            setSlideDirection(index > currentSlide ? 1 : -1);
                            setCurrentSlide(index);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Action Bar */}
              <div className="w-full max-w-[420px] flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl transition-colors duration-500">
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-[.15em] text-slate-400 dark:text-slate-500">
                    Studio Engine
                  </p>
                  <p className="text-[13px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                    Slide {currentSlide + 1} / {slides.length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRegenerateSlide}
                    disabled={regenerating || loading}
                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-95 disabled:opacity-40"
                  >
                    {regenerating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Redo
                  </button>

                  {/* Export current slide */}
                  <button
                    onClick={downloadSlide}
                    disabled={loading || exportingAll}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:-translate-y-[1px] shadow-sm active:scale-95 disabled:opacity-40"
                  >
                    <Download size={15} />
                    PNG
                  </button>

                  {/* Export all slides */}
                  <button
                    onClick={downloadAllSlides}
                    disabled={exportingAll || loading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:-translate-y-[1px] shadow-sm active:scale-95 disabled:opacity-40"
                  >
                    {exportingAll ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Download size={15} />
                    )}
                    {exportingAll ? "Exporting..." : "All ZIP"}
                  </button>
                </div>
              </div>

              {/* Caption Generator */}
              <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-500">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Hash size={15} className="text-indigo-500" />
                    <span className="text-[12px] font-bold tracking-[.12em] uppercase text-slate-400 dark:text-slate-500">
                      Caption & Hashtags
                    </span>
                  </div>
                  <button
                    onClick={handleGenerateCaption}
                    disabled={captionLoading || !idea.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-[12px] font-bold transition-all active:scale-95"
                  >
                    {captionLoading ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />{" "}
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} /> Generate
                      </>
                    )}
                  </button>
                </div>
                {caption ? (
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[.12em] uppercase text-slate-400 dark:text-slate-500 mb-2">
                        Caption
                      </p>
                      <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {caption.caption}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[.12em] uppercase text-slate-400 dark:text-slate-500 mb-2">
                        Hashtags
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {caption.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-[11px] font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCaption}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${copied ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy All
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-[13px] text-slate-400 dark:text-slate-600 font-medium">
                      Generate a caption and hashtags for your post
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="relative w-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[320px] h-[320px] bg-gradient-to-br from-indigo-500/10 to-rose-500/10 rounded-full blur-[80px]" />
              </div>
              <div className="w-full max-w-[420px] aspect-square border border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] flex flex-col items-center justify-center gap-6 bg-white dark:bg-slate-900/40 relative transition-colors duration-500 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-lg">
                  <Sparkles
                    size={28}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
                <div className="text-center px-10">
                  <p className="text-[17px] font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Canvas Ready
                  </p>
                  <p className="text-[14px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                    Describe your idea, pick a format, and let our AI engine
                    create your visual story.
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
