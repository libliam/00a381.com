import { useState, useEffect } from 'react';
import chroma from 'chroma-js';

export function useColor(initialColor: string) {
  const [hex, setHex] = useState(initialColor);
  const [color, setColor] = useState(chroma(initialColor));

  useEffect(() => {
    try {
      if (chroma.valid(hex)) {
        setColor(chroma(hex));
      }
    } catch (e) {
      // Ignore invalid colors while typing
    }
  }, [hex]);

  const updateColor = (newColor: string) => {
    setHex(newColor);
  };

  return { hex, color, updateColor };
}
