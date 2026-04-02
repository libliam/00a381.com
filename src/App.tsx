import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, Code, PaintBucket, Contrast } from 'lucide-react';

const COLOR_SCALE = [
  { step: '50', hex: '#e0f5f0' },
  { step: '100', hex: '#b3e6d9' },
  { step: '200', hex: '#80d4c0' },
  { step: '300', hex: '#4dc2a6' },
  { step: '400', hex: '#26b593' },
  { step: '500', hex: '#00a381', isBase: true },
  { step: '600', hex: '#009374' },
  { step: '700', hex: '#007a61' },
  { step: '800', hex: '#00614d' },
  { step: '900', hex: '#004f3f' },
  { step: '950', hex: '#002e25' },
];

const TAILWIND_CONFIG = `module.exports = {
  theme: {
    extend: {
      colors: {
        hanarokusho: {
          50: '#e0f5f0',
          100: '#b3e6d9',
          200: '#80d4c0',
          300: '#4dc2a6',
          400: '#26b593',
          500: '#00a381', // base
          600: '#009374',
          700: '#007a61',
          800: '#00614d',
          900: '#004f3f',
          950: '#002e25',
        },
      },
    },
  },
}`;

const CSS_VARS = `:root {
  --color-hanarokusho: #00a381;
  --color-hanarokusho-rgb: 0, 163, 129;
  --color-hanarokusho-hsl: 167, 100%, 32%;
}`;

export default function App() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] bg-noise p-4 md:p-6 lg:p-8 box-border flex flex-col font-serif text-[#1a2b25]">
      {/* Main Frame - Responsive Grid */}
      <div className="w-full max-w-[1600px] mx-auto border border-[#1a2b25] flex flex-col lg:flex-row relative bg-[#fdfbf7] shadow-2xl shadow-[#00a381]/5 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)]">
        
        {/* LEFT PANEL: The Aesthetic Display (Sticky on Desktop) */}
        <div className="w-full lg:w-[45%] xl:w-[50%] border-b lg:border-b-0 lg:border-r border-[#1a2b25] flex flex-col relative">
          <div className="lg:sticky lg:top-0 h-[60vh] lg:h-[calc(100vh-4rem)] flex flex-col">
            
            {/* Color Block */}
            <div 
              onClick={() => handleCopy('#00A381', 'main-color')}
              className="flex-1 bg-[#00a381] relative cursor-pointer group flex flex-col justify-between p-6 md:p-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay pointer-events-none"></div>

              {/* Top Meta */}
              <div className="relative z-10 flex justify-between items-start text-white/90 font-mono text-xs tracking-widest uppercase">
                <span>Pigment No. 00A381</span>
                <span>Click to Copy</span>
              </div>

              {/* Center Title (Mobile Horizontal, Desktop Vertical) */}
              <div className="relative z-10 flex-1 flex items-center justify-center">
                <h1 className="text-white text-7xl md:text-9xl font-light tracking-[0.2em] lg:vertical-text" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                  花綠青
                </h1>
              </div>

              {/* Bottom Meta */}
              <div className="relative z-10 flex justify-between items-end text-white/90 font-mono text-xs tracking-widest uppercase">
                <span>Hua Lu Qing</span>
                <span>Malachite</span>
              </div>

              {/* Copy Feedback Overlay */}
              <AnimatePresence>
                {copiedItem === 'main-color' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#1a2b25]/30 backdrop-blur-md flex items-center justify-center z-20"
                  >
                    <span className="text-white font-mono tracking-widest text-sm border border-white/50 px-8 py-3 uppercase flex items-center gap-3">
                      <Check size={16} /> Copied to Clipboard
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Short Description under color on desktop */}
            <div className="h-auto border-t border-[#1a2b25] p-6 md:p-8 bg-[#fdfbf7]">
              <p className="text-sm md:text-base leading-loose tracking-widest text-[#1a2b25]/80 text-justify">
                源自天然矿物孔雀石研磨而成的东方传统色彩。色如孔雀之羽，润如春水之波。它既蕴含着草木初绽的蓬勃生机，又带有玉石般历经岁月的沉静与内敛。
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: The Practical Utility (Scrollable) */}
        <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col bg-[#fdfbf7] lg:overflow-y-auto no-scrollbar">
          
          {/* Section 1: Technical Specs */}
          <div className="flex flex-col border-b border-[#1a2b25]">
            <div className="p-4 md:p-6 border-b border-[#1a2b25] bg-[#1a2b25] text-[#fdfbf7] flex items-center gap-3">
              <PaintBucket size={18} className="opacity-70" />
              <h2 className="text-xs font-mono tracking-[0.2em] uppercase">Technical Specifications</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { label: 'HEX', value: '#00A381' },
                { label: 'RGB', value: '0, 163, 129' },
                { label: 'CMYK', value: '100, 0, 50, 0' },
                { label: 'HSL', value: '167°, 100%, 32%' }
              ].map((spec, idx) => (
                <div key={spec.label} className={`p-5 md:p-6 border-[#1a2b25] ${idx !== 3 ? 'border-r' : ''} ${idx < 2 ? 'border-b md:border-b-0' : ''}`}>
                  <p className="text-[10px] font-mono tracking-[0.2em] text-[#1a2b25]/50 mb-2 uppercase">{spec.label}</p>
                  <p className="text-sm md:text-base font-mono tracking-wider">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Accessibility & Contrast */}
          <div className="flex flex-col border-b border-[#1a2b25]">
            <div className="p-4 md:p-6 border-b border-[#1a2b25] flex items-center gap-3">
              <Contrast size={18} className="opacity-70" />
              <h2 className="text-xs font-mono tracking-[0.2em] uppercase">WCAG Contrast Ratio</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Light Text */}
              <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#1a2b25] flex flex-col items-center justify-center bg-[#00a381] text-white relative">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
                <span className="text-5xl md:text-6xl font-serif mb-4 relative z-10">Aa</span>
                <div className="flex items-center gap-4 relative z-10">
                  <span className="font-mono text-sm tracking-widest">#FFFFFF</span>
                  <span className="px-2 py-1 border border-white/30 text-[10px] font-mono tracking-widest uppercase rounded-sm">Pass (3.5:1)</span>
                </div>
              </div>
              {/* Dark Text */}
              <div className="p-8 md:p-10 flex flex-col items-center justify-center bg-[#00a381] text-[#1a2b25] relative">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
                <span className="text-5xl md:text-6xl font-serif mb-4 relative z-10">Aa</span>
                <div className="flex items-center gap-4 relative z-10">
                  <span className="font-mono text-sm tracking-widest">#1A2B25</span>
                  <span className="px-2 py-1 border border-[#1a2b25]/30 text-[10px] font-mono tracking-widest uppercase rounded-sm">Pass (4.8:1)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tints & Shades (Tailwind Scale) */}
          <div className="flex flex-col border-b border-[#1a2b25]">
            <div className="p-4 md:p-6 border-b border-[#1a2b25] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#00a381] border border-[#1a2b25]"></div>
                <h2 className="text-xs font-mono tracking-[0.2em] uppercase">Color Scale (10-Step)</h2>
              </div>
              <span className="text-[10px] font-mono text-[#1a2b25]/50 uppercase tracking-widest hidden md:inline-block">Click to copy HEX</span>
            </div>
            
            <div className="flex flex-col w-full">
              {COLOR_SCALE.map((color, idx) => (
                <div 
                  key={color.step}
                  onClick={() => handleCopy(color.hex, `scale-${color.step}`)}
                  className={`group flex items-stretch cursor-pointer hover:bg-[#1a2b25]/5 transition-colors ${idx !== COLOR_SCALE.length - 1 ? 'border-b border-[#1a2b25]' : ''}`}
                >
                  <div className="w-24 md:w-32 p-4 border-r border-[#1a2b25] flex items-center justify-between">
                    <span className={`font-mono text-sm ${color.isBase ? 'font-bold text-[#00a381]' : 'text-[#1a2b25]/70'}`}>
                      {color.step}
                    </span>
                    {color.isBase && <span className="text-[10px] font-mono tracking-widest text-[#00a381] uppercase">Base</span>}
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-6 border border-[#1a2b25]/20 shadow-inner" style={{ backgroundColor: color.hex }}></div>
                      <span className="font-mono text-sm tracking-wider uppercase text-[#1a2b25]">{color.hex}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedItem === `scale-${color.step}` ? (
                        <Check size={16} className="text-[#00a381]" />
                      ) : (
                        <Copy size={16} className="text-[#1a2b25]/40" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Developer Kit (Export) */}
          <div className="flex flex-col">
            <div className="p-4 md:p-6 border-b border-[#1a2b25] flex items-center gap-3">
              <Code size={18} className="opacity-70" />
              <h2 className="text-xs font-mono tracking-[0.2em] uppercase">Developer Kit</h2>
            </div>
            
            <div className="flex flex-col md:flex-row">
              {/* CSS Vars */}
              <div className="flex-1 border-b md:border-b-0 md:border-r border-[#1a2b25] p-6 relative group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1a2b25]/60">CSS Variables</h3>
                  <button 
                    onClick={() => handleCopy(CSS_VARS, 'css')}
                    className="text-[#1a2b25]/40 hover:text-[#00a381] transition-colors"
                  >
                    {copiedItem === 'css' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="font-mono text-xs leading-relaxed text-[#1a2b25] overflow-x-auto no-scrollbar">
                  {CSS_VARS}
                </pre>
              </div>

              {/* Tailwind */}
              <div className="flex-1 p-6 relative group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1a2b25]/60">Tailwind Config</h3>
                  <button 
                    onClick={() => handleCopy(TAILWIND_CONFIG, 'tailwind')}
                    className="text-[#1a2b25]/40 hover:text-[#00a381] transition-colors"
                  >
                    {copiedItem === 'tailwind' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="font-mono text-xs leading-relaxed text-[#1a2b25] overflow-x-auto no-scrollbar">
                  {TAILWIND_CONFIG}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
