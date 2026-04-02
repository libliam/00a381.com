import React, { useState, useEffect } from 'react';
import { useColor } from './hooks/useColor';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import chroma from 'chroma-js';
import {
  Moon, Sun, Copy, Check, Type, Layout, Palette,
  Eye, Layers
} from 'lucide-react';

const HANAROKUSHO = '#00a381';

function ColorBlindnessFilters() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="protanopia"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" /></filter>
        <filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" /></filter>
        <filter id="tritanopia"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" /></filter>
        <filter id="achromatopsia"><feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" /></filter>
      </defs>
    </svg>
  );
}

function CopyableCell({ label, value }: { label: string, value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(128,128,128,0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCopy}
      className="flex flex-col items-start p-4 md:p-6 text-left relative overflow-hidden group w-full h-full"
    >
      <span className="font-mono text-[10px] text-black/50 dark:text-white/50 uppercase tracking-widest mb-2">{label}</span>
      <span className="font-mono text-sm md:text-base text-black dark:text-white group-hover:opacity-0 transition-opacity">{value}</span>
      <span className="font-mono text-sm md:text-base text-green-600 dark:text-green-400 absolute bottom-4 md:bottom-6 left-4 md:left-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        <Check className="w-4 h-4" /> COPIED
      </span>
    </motion.button>
  );
}

function SectionHeader({ icon: Icon, title, children }: { icon: any, title: string, children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-black/50 dark:text-white/50" />
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-black/70 dark:text-white/70">{title}</h2>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono text-[10px] uppercase tracking-widest px-3 py-1 transition-colors border",
        active
          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
          : "bg-transparent text-black/50 border-black/20 hover:border-black/50 dark:text-white/50 dark:border-white/20 dark:hover:border-white/50"
      )}
    >
      {children}
    </button>
  );
}

export default function App() {
  const { hex, color, updateColor } = useColor(HANAROKUSHO);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Interactive States
  const [textMode, setTextMode] = useState<'white' | 'black'>('white');
  const [contextMode, setContextMode] = useState<'contrast' | 'proportion'>('contrast');
  const [contrastBg, setContrastBg] = useState<'white' | 'black' | 'complement' | 'analogous'>('white');
  const [propMode, setPropMode] = useState<'dominant' | 'secondary' | 'accent'>('dominant');
  const [targetColor, setTargetColor] = useState('#ffb11b');

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const isDark = color.luminance() < 0.3;
  const heroTextColor = isDark ? 'text-white' : 'text-[#111]';

  // Derived Colors
  const analogous = [color.set('hsl.h', '-30').hex(), color.hex(), color.set('hsl.h', '+30').hex()];
  const complementary = [color.hex(), color.set('hsl.h', '+180').hex()];
  const triadic = [color.hex(), color.set('hsl.h', '+120').hex(), color.set('hsl.h', '+240').hex()];
  const scale = chroma.scale(['white', color.hex(), 'black']).mode('lrgb').colors(11);

  const isValidTarget = chroma.valid(targetColor);
  const mixScale = isValidTarget ? chroma.scale([color.hex(), targetColor]).mode('lch').colors(9) : [];

  // Advanced Immersion Background
  const baseBg = isDarkTheme ? '#050505' : '#fafafa';
  const appBg = chroma.mix(baseBg, color.hex(), 0.05, 'lrgb').hex();
  const sheetBg = isDarkTheme ? '#0a0a0a' : '#ffffff';

  // Readability Logic
  const fgColor = textMode === 'white' ? '#ffffff' : '#000000';
  const contrastScore = chroma.contrast(color, fgColor).toFixed(2);

  // Context Logic
  const getContrastBgColor = () => {
    switch (contrastBg) {
      case 'white': return '#ffffff';
      case 'black': return '#000000';
      case 'complement': return complementary[1];
      case 'analogous': return analogous[0];
    }
  };

  const getProportionColors = () => {
    const neutral = isDarkTheme ? '#111111' : '#f0f0f0';
    switch (propMode) {
      case 'dominant': return { dom: color.hex(), sub: neutral, acc: complementary[1] };
      case 'secondary': return { dom: neutral, sub: color.hex(), acc: complementary[1] };
      case 'accent': return { dom: neutral, sub: isDarkTheme ? '#222' : '#e0e0e0', acc: color.hex() };
    }
  };
  const propColors = getProportionColors();

  return (
    <motion.div
      className="min-h-screen bg-noise text-[#111] dark:text-[#F4F4F0] font-sans selection:bg-[#111] dark:selection:bg-[#F4F4F0] selection:text-[#F4F4F0] dark:selection:text-[#111] py-8 px-4 md:px-8 transition-colors duration-700"
      animate={{ backgroundColor: appBg }}
    >
      <ColorBlindnessFilters />

      {/* Top Navigation */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6" style={{ backgroundColor: color.hex() }} />
          <h1 className="font-serif text-xl tracking-tight">不止花綠青</h1>
        </div>
        <div className="flex items-center gap-6">
          <label className="cursor-pointer font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Picker</span>
            <input type="color" value={chroma.valid(hex) ? chroma(hex).hex() : HANAROKUSHO} onChange={e => updateColor(e.target.value)} className="sr-only" />
          </label>
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDarkTheme ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* Main Sheet */}
      <main
        className="max-w-6xl mx-auto border border-black/10 dark:border-white/10 shadow-2xl flex flex-col transition-colors duration-700"
        style={{ backgroundColor: sheetBg }}
      >
        {/* Hero Section */}
        <motion.div
          className="w-full h-48 md:h-64 relative flex items-center justify-center border-b border-black/10 dark:border-white/10 overflow-hidden group"
          animate={{ backgroundColor: color.hex() }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <input
            type="text"
            value={hex}
            onChange={(e) => updateColor(e.target.value)}
            className={cn(
              "bg-transparent font-serif text-[4rem] md:text-[6rem] text-center leading-none tracking-tighter outline-none w-full uppercase relative z-10 transition-colors duration-300",
              heroTextColor
            )}
            spellCheck={false}
          />
          <div className={cn("absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] tracking-widest uppercase", heroTextColor)}>
            Edit Hex Value
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-black/10 dark:border-white/10 divide-x divide-y md:divide-y-0 divide-black/10 dark:divide-white/10">
          <CopyableCell label="HEX" value={color.hex().toUpperCase()} />
          <CopyableCell label="RGB" value={color.css().replace('rgb', 'RGB')} />
          <CopyableCell label="HSL" value={color.css('hsl').replace('hsl', 'HSL')} />
          <CopyableCell label="CMYK" value={`CMYK(${color.cmyk().map(v => Math.round(v * 100)).join(', ')})`} />
        </div>

        {/* Interactive Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-black/10 dark:border-white/10 divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10">

          {/* Readability & Typography */}
          <div className="flex flex-col">
            <SectionHeader icon={Type} title="Typography">
              <TabButton active={textMode === 'white'} onClick={() => setTextMode('white')}>White</TabButton>
              <TabButton active={textMode === 'black'} onClick={() => setTextMode('black')}>Black</TabButton>
            </SectionHeader>
            <div className="flex flex-col md:flex-row flex-1 divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
              <motion.div
                className="w-full md:w-2/5 p-6 flex flex-col items-center justify-center gap-4"
                animate={{ backgroundColor: color.hex() }}
                transition={{ duration: 0.8 }}
              >
                <motion.span animate={{ color: fgColor }} className="font-serif text-6xl">Aa</motion.span>
                <div className="flex flex-col items-center">
                  <motion.span animate={{ color: fgColor }} className="font-mono text-2xl">{contrastScore}</motion.span>
                  <div className="flex gap-2 mt-2">
                    <span className={cn("font-mono text-[10px] px-1.5 py-0.5", Number(contrastScore) >= 4.5 ? "bg-green-500/20 text-green-900 dark:text-green-100" : "bg-red-500/20 text-red-900 dark:text-red-100")}>AA</span>
                    <span className={cn("font-mono text-[10px] px-1.5 py-0.5", Number(contrastScore) >= 7 ? "bg-green-500/20 text-green-900 dark:text-green-100" : "bg-red-500/20 text-red-900 dark:text-red-100")}>AAA</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="w-full md:w-3/5 p-6 flex flex-col justify-center gap-4"
                animate={{ backgroundColor: color.hex(), color: fgColor }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="font-serif text-2xl leading-tight">The quick brown fox jumps over the lazy dog.</h3>
                <p className="font-sans text-sm opacity-80 leading-relaxed">
                  Editorial design establishes a visual hierarchy that guides the reader. Color plays a crucial role in this process, ensuring both aesthetic appeal and accessibility.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Context & Proportion */}
          <div className="flex flex-col">
            <SectionHeader icon={Layout} title="Spatial Context">
              <TabButton active={contextMode === 'contrast'} onClick={() => setContextMode('contrast')}>Contrast</TabButton>
              <TabButton active={contextMode === 'proportion'} onClick={() => setContextMode('proportion')}>60-30-10</TabButton>
            </SectionHeader>
            <div className="flex flex-col md:flex-row flex-1 divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
              <div className="w-full md:w-1/4 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
                {contextMode === 'contrast' ? (
                  <>
                    <TabButton active={contrastBg === 'white'} onClick={() => setContrastBg('white')}>White</TabButton>
                    <TabButton active={contrastBg === 'black'} onClick={() => setContrastBg('black')}>Black</TabButton>
                    <TabButton active={contrastBg === 'complement'} onClick={() => setContrastBg('complement')}>Complement</TabButton>
                    <TabButton active={contrastBg === 'analogous'} onClick={() => setContrastBg('analogous')}>Analogous</TabButton>
                  </>
                ) : (
                  <>
                    <TabButton active={propMode === 'dominant'} onClick={() => setPropMode('dominant')}>60% Dom</TabButton>
                    <TabButton active={propMode === 'secondary'} onClick={() => setPropMode('secondary')}>30% Sub</TabButton>
                    <TabButton active={propMode === 'accent'} onClick={() => setPropMode('accent')}>10% Acc</TabButton>
                  </>
                )}
              </div>
              <div className="w-full md:w-3/4 p-6 flex items-center justify-center min-h-[200px]">
                <AnimatePresence mode="wait">
                  {contextMode === 'contrast' ? (
                    <motion.div
                      key="contrast"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-full aspect-video flex items-center justify-center p-8 shadow-inner"
                      style={{ backgroundColor: getContrastBgColor() }}
                    >
                      <motion.div animate={{ backgroundColor: color.hex() }} className="w-16 h-16 shadow-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="proportion"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-full aspect-video p-4 flex flex-col justify-end items-end shadow-inner"
                      style={{ backgroundColor: propColors.dom }}
                    >
                      <motion.div className="w-2/3 h-2/3 shadow-md p-4 flex justify-start items-start" style={{ backgroundColor: propColors.sub }}>
                        <motion.div className="w-8 h-8 shadow-sm" style={{ backgroundColor: propColors.acc }} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* Harmonies & Scales */}
        <div className="flex flex-col border-b border-black/10 dark:border-white/10">
          <SectionHeader icon={Layers} title="Color System">
            <button
              onClick={() => {
                const cssVars = scale.map((c, i) => `--color-${i * 100 || 50}: ${chroma(c).hex()};`).join('\n');
                navigator.clipboard.writeText(`:root {\n${cssVars}\n}`);
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> CSS
            </button>
          </SectionHeader>

          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
            {/* Harmonies */}
            <div className="w-full md:w-1/3 flex flex-col divide-y divide-black/10 dark:divide-white/10">
              {[
                { label: 'Complement', colors: complementary },
                { label: 'Analogous', colors: analogous },
                { label: 'Triadic', colors: triadic }
              ].map((harmony, idx) => (
                <div key={idx} className="flex h-12">
                  <div className="w-24 flex items-center justify-center bg-black/5 dark:bg-white/5">
                    <span className="font-mono text-[8px] uppercase tracking-widest opacity-50">{harmony.label}</span>
                  </div>
                  <div className="flex-1 flex">
                    {harmony.colors.map((c, i) => (
                      <button key={i} onClick={() => navigator.clipboard.writeText(chroma(c).hex())} className="flex-1 relative group">
                        <motion.div animate={{ backgroundColor: c }} className="absolute inset-0" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="font-mono text-[8px] bg-white dark:bg-[#111] text-black dark:text-white px-1 shadow-sm">{chroma(c).hex()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tints & Shades */}
            <div className="w-full md:w-2/3 flex h-36 md:h-auto">
              {scale.map((c, i) => (
                <button key={i} onClick={() => navigator.clipboard.writeText(chroma(c).hex())} className="flex-1 relative group">
                  <motion.div animate={{ backgroundColor: c }} transition={{ duration: 0.8 }} className="absolute inset-0" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end justify-center pb-2 transition-opacity">
                    <span className={cn("font-mono text-[8px] rotate-90 origin-left translate-x-1.5 uppercase", chroma(c).luminance() < 0.3 ? "text-white" : "text-black")}>
                      {chroma(c).hex()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LCH Mixer */}
        <div className="flex flex-col border-b border-black/10 dark:border-white/10">
          <div className="flex justify-between items-center p-4 bg-black/5 dark:bg-white/5 transition-colors duration-700">
            <span className="font-mono text-[10px] text-black/50 dark:text-white/50 uppercase tracking-widest">LCH Color Mixer</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase text-black/50 dark:text-white/50 hidden sm:inline">Target:</span>
              <input
                type="text"
                value={targetColor}
                onChange={(e) => setTargetColor(e.target.value)}
                className="bg-transparent font-mono text-[10px] md:text-xs outline-none uppercase w-16 md:w-20 border-b border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white transition-colors text-black dark:text-white"
                spellCheck={false}
              />
              <label className="cursor-pointer w-4 h-4 rounded-none shadow-sm relative overflow-hidden">
                <motion.div animate={{ backgroundColor: isValidTarget ? chroma(targetColor).hex() : '#000' }} className="absolute inset-0" />
                <input type="color" value={isValidTarget ? chroma(targetColor).hex() : '#000000'} onChange={e => setTargetColor(e.target.value)} className="sr-only" />
              </label>
            </div>
          </div>
          <div className="flex h-16 md:h-20 w-full">
            {isValidTarget ? mixScale.map((c, i) => (
              <button key={i} onClick={() => navigator.clipboard.writeText(chroma(c).hex())} className="flex-1 relative group">
                <motion.div animate={{ backgroundColor: c }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end justify-center pb-2 transition-opacity">
                  <span className={cn("font-mono text-[8px] rotate-90 origin-left translate-x-1.5 uppercase", chroma(c).luminance() < 0.3 ? "text-white" : "text-black")}>
                    {chroma(c).hex()}
                  </span>
                </div>
              </button>
            )) : (
              <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-red-500 uppercase tracking-widest bg-white dark:bg-[#111]">Invalid Target Color</div>
            )}
          </div>
        </div>

        {/* Color Blindness */}
        <div className="flex flex-col">
          <SectionHeader icon={Eye} title="Accessibility" />
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/10 dark:divide-white/10">
            {[
              { id: 'protanopia', label: 'Protanopia', desc: 'Red blind' },
              { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Green blind' },
              { id: 'tritanopia', label: 'Tritanopia', desc: 'Blue blind' },
              { id: 'achromatopsia', label: 'Achromatopsia', desc: 'Monochromacy' },
            ].map((type) => (
              <div key={type.id} className="p-4 md:p-6 flex flex-col gap-3 group">
                <motion.div
                  animate={{ backgroundColor: color.hex() }}
                  transition={{ duration: 0.8 }}
                  className="h-12 w-full shadow-inner"
                  style={{ filter: `url(#${type.id})` }}
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest">{type.label}</div>
                  <div className="font-serif text-xs text-black/50 dark:text-white/50 mt-0.5">{type.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="max-w-6xl mx-auto mt-8 flex justify-between items-center opacity-50 px-4">
        <span className="font-mono text-[10px] uppercase tracking-widest">
          Designed by&nbsp;
          <a href="mailto:m@00a381.com">Mitchell&nbsp;</a>
          with&nbsp;
          <span className="font-sans">♥.</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest">
          <span className="font-sans">©&nbsp;</span>
          2026
        </span>
      </footer>
    </motion.div>
  );
}
