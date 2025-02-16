/// <reference lib="dom" />

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { colorData } from './colorData';
import './ui.css';

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
      className="color-item"
      onClick={() => onClick(color)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="glass-overlay"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="color-swatch"
        style={{ backgroundColor: color.hex }}
      />
      <motion.div 
        className="color-label"
        whileHover={{ y: -2 }}
      >
        <span className="color-name">{color.name}</span>
        <span className="color-hex">hex: {color.hex}</span>
        <span className="combinations-count">
          {calculateCombinations(color).length} combinations
        </span>
      </motion.div>
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
    <div className="gradient-actions">
      <button 
        className="gradient-button"
        onClick={() => handleGradient('LINEAR')}
        title="Apply as linear gradient"
      >
        <span>↗️</span>
        Linear
      </button>
      <button 
        className="gradient-button"
        onClick={() => handleGradient('RADIAL')}
        title="Apply as radial gradient"
      >
        <span>⭕️</span>
        Radial
      </button>
      <button 
        className="gradient-button"
        onClick={() => handleGradient('ANGULAR')}
        title="Apply as angular gradient"
      >
        <span>🔄</span>
        Angular
      </button>
      <button 
        className="gradient-button"
        onClick={() => handleGradient('DIAMOND')}
        title="Apply as diamond gradient"
      >
        <span>💎</span>
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
    const colorCombos = calculateCombinations(color);
    setSelectedColor(color);
    setCombinations(colorCombos);
    setView('combinations');
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
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
      setView('grid');
      setSelectedColor(null);
      setCombinations([]);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Sanzo Wada Color Library</h1>
      
      <div className="header">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {view === 'combinations' && (
          <button className="back-button" onClick={handleBackClick}>
            ← Back
          </button>
        )}
        <button className="generate-button" onClick={handleGenerate}>
          <span className="plus-icon">+</span>
          Generate
        </button>
      </div>

      {selectedColor && view === 'combinations' && (
        <div className="selected-color-details">
          <div className="color-preview-large" style={{ backgroundColor: selectedColor.hex }} />
          <div className="color-info">
            <h2>{selectedColor.name}</h2>
            <p className="hex-code">hex: {selectedColor.hex}</p>
            <p className="color-values">{formatColorValues(selectedColor).cmyk}</p>
            <p className="color-values">{formatColorValues(selectedColor).rgb}</p>
            <p>{combinations.length} combinations</p>
          </div>
          
          <div className="combinations-grid">
            {combinations.map((combo, index) => (
              <div key={combo.id} className="combination-set">
                <div className="combination-content">
                  <h3>Set {index + 1}</h3>
                  <div className="combination-swatches">
                    {[selectedColor, ...combo.colors].map((color, i) => (
                      <div
                        key={i}
                        className="combo-swatch"
                        style={{ backgroundColor: color.hex }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyHex(color.hex);
                          
                          const target = e.currentTarget;
                          const tooltip = document.createElement('div');
                          tooltip.className = 'copy-tooltip';
                          tooltip.textContent = 'Copied!';
                          target.appendChild(tooltip);
                          
                          setTimeout(() => {
                            target.removeChild(tooltip);
                          }, 1000);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <GradientButtons colors={[selectedColor, ...combo.colors]} />
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {view === 'grid' && (
          <motion.div 
            className="color-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredColors.map((color: Color, index: number) => (
              <ColorCard 
                key={color.hex} 
                color={color} 
                onClick={handleColorClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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