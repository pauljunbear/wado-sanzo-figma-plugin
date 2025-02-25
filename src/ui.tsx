/// <reference lib="dom" />

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { colorData } from './colorData';
import { ThemeToggle } from './components/theme-toggle';
import { Search } from 'lucide-react';
import './globals.css';

interface Color {
  name: string;
  combinations: number[];
  swatch: number;
  cmyk: number[];
  lab: number[];
  rgb: number[];
  hex: string;
}

interface ColorCombo {
  id: number;
  colors: Array<{
    hex: string;
    name: string;
  }>;
}

interface ColorCardProps {
  color: Color;
  onClick: (color: Color) => void;
}

interface GradientButtonsProps {
  colors: Array<{
    hex: string;
    name: string;
  }>;
}

const calculateCombinations = (color: Color): ColorCombo[] => {
  const colorCombos = color.combinations.map((comboId: number) => {
    const comboColors = colorData.colors.filter(c => 
      c.combinations.includes(comboId) && c !== color
    );
    return {
      id: comboId,
      colors: comboColors.map(c => ({
        hex: c.hex,
        name: c.name
      }))
    };
  });
  return colorCombos;
};

const ColorCard: React.FC<ColorCardProps> = ({ color, onClick }) => {
  return (
    <motion.div
      onClick={() => onClick(color)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <div className="card h-full flex flex-col">
        <div 
          className="w-full h-24" 
          style={{ backgroundColor: color.hex }}
        />
        <div className="p-3 text-center flex-1 flex flex-col justify-between">
          <h3 className="font-medium text-base text-foreground mb-2 pt-1">{color.name}</h3>
          <div>
            <p className="text-xs text-muted-foreground mb-2">hex: {color.hex}</p>
            <p className="text-xs text-muted-foreground pb-1">
              {calculateCombinations(color).length} combinations
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GradientButtons: React.FC<GradientButtonsProps> = ({ colors }) => {
  const handleGradient = (type: 'LINEAR' | 'RADIAL' | 'ANGULAR' | 'DIAMOND') => {
    parent.postMessage({ 
      pluginMessage: { 
        type: 'apply-gradient',
        gradientType: type,
        colors: colors.map(c => ({
          hex: c.hex,
          name: c.name
        }))
      } 
    }, '*');
  };

  return (
    <div className="flex flex-wrap gap-1 mt-3 justify-center">
      <button 
        className="button button-outline button-xs flex-1"
        onClick={() => handleGradient('LINEAR')}
      >
        <span className="mr-1">↗️</span>
        Linear
      </button>
      <button 
        className="button button-outline button-xs flex-1"
        onClick={() => handleGradient('RADIAL')}
      >
        <span className="mr-1">⭕️</span>
        Radial
      </button>
      <button 
        className="button button-outline button-xs flex-1"
        onClick={() => handleGradient('ANGULAR')}
      >
        <span className="mr-1">🔄</span>
        Angular
      </button>
      <button 
        className="button button-outline button-xs flex-1"
        onClick={() => handleGradient('DIAMOND')}
      >
        <span className="mr-1">💎</span>
        Diamond
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [view, setView] = useState<'grid' | 'combinations'>('grid');
  const [filteredColors, setFilteredColors] = useState(colorData.colors);
  const [combinations, setCombinations] = useState<ColorCombo[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = colorData.colors.filter(color =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hex.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredColors(filtered);
  }, [searchTerm]);

  // Listen for messages from the plugin code
  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg && msg.type === 'copy-to-clipboard') {
        const textArea = document.createElement('textarea');
        textArea.value = msg.text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
      }
    };
  }, []);

  const handleColorClick = (color: Color) => {
    // First scroll to top immediately
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    
    // Then update state
    const colorCombos = calculateCombinations(color);
    setSelectedColor(color);
    setCombinations(colorCombos);
    setView('combinations');
  };

  const handleGenerate = () => {
    const randomIndex = Math.floor(Math.random() * colorData.colors.length);
    const randomColor = colorData.colors[randomIndex];
    handleColorClick(randomColor);
  };

  const formatColorValues = (color: Color) => {
    const { cmyk, rgb } = color;
    return {
      cmyk: `C:${cmyk[0]} / M:${cmyk[1]} / Y:${cmyk[2]} / K:${cmyk[3]}`,
      rgb: `R:${rgb[0]} / G:${rgb[1]} / B:${rgb[2]}`
    };
  };

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      // Show Figma notification
      parent.postMessage({ pluginMessage: { type: 'notify', text: `Copied ${hex} to clipboard!` } }, '*');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = hex;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        // Show Figma notification
        parent.postMessage({ pluginMessage: { type: 'notify', text: `Copied ${hex} to clipboard!` } }, '*');
      } catch (copyErr) {
        console.error('Failed to copy:', copyErr);
        parent.postMessage({ pluginMessage: { type: 'notify', text: 'Failed to copy to clipboard' } }, '*');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleBackClick = () => {
    if (view === 'combinations') {
      // First scroll to top immediately
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      
      // Then update state
      setView('grid');
      setSelectedColor(null);
      setCombinations([]);
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 overflow-auto" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sanzo Wada Color Library</h1>
          <ThemeToggle />
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform text-muted-foreground" style={{ width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          {view === 'combinations' && (
            <button className="button button-outline" onClick={handleBackClick}>
              ← Back
            </button>
          )}
          
          <button className="button button-default" onClick={handleGenerate}>
            Generate
          </button>
        </div>

        {selectedColor && view === 'combinations' && (
          <div className="mb-6">
            <div className="card">
              <div 
                className="w-full h-32" 
                style={{ backgroundColor: selectedColor.hex }} 
              />
              <div className="p-4 text-center">
                <h2 className="text-xl font-bold mb-3 pt-1">{selectedColor.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">hex: {selectedColor.hex}</p>
                <p className="text-sm text-muted-foreground mb-2">{formatColorValues(selectedColor).cmyk}</p>
                <p className="text-sm text-muted-foreground mb-3">{formatColorValues(selectedColor).rgb}</p>
                <p className="text-sm font-medium pb-1">{combinations.length} combinations</p>
              </div>
            </div>
            
            <div className="grid gap-3 mt-4">
              {combinations.map((combo, index) => (
                <div key={combo.id} className="card">
                  <div className="p-3">
                    <h3 className="text-base font-medium mb-3 text-center">Set {index + 1}</h3>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {[selectedColor, ...combo.colors].map((color, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
                          style={{ backgroundColor: color.hex }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyHex(color.hex);
                          }}
                          title={`${color.name} - ${color.hex}`}
                        />
                      ))}
                    </div>
                    <GradientButtons colors={[selectedColor, ...combo.colors]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {view === 'grid' && (
            <motion.div 
              className="grid grid-cols-4 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredColors.map((color: Color) => (
                <ColorCard 
                  key={color.hex} 
                  color={color} 
                  onClick={handleColorClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Render the app
const container = document.getElementById('react-page');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Container element not found');
}

export default App;