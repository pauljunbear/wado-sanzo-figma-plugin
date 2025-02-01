export interface Color {
  name: string;
  combinations: number[];
  swatch: number;
  cmyk: number[];
  lab: number[];
  rgb: number[];
  hex: string;
}

export interface ColorData {
  colors: Color[];
}

// Import the JSON data
import colorData from './colors.json';
export const colors: ColorData = { colors: colorData }; 