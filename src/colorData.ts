import colorJson from './colors.json';

interface Color {
  name: string;
  combinations: number[];
  swatch: number;
  cmyk: number[];
  lab: number[];
  rgb: number[];
  hex: string;
}

interface ColorCombination {
  name: string;
  colors: number[];
  type: 'duo' | 'trio' | 'quad';
}

interface ColorData {
  colors: Color[];
  combinations: ColorCombination[];
}

console.log('Total colors loaded:', colorJson.length);

export const colorData: ColorData = {
  colors: colorJson,
  combinations: []
}; 