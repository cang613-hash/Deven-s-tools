
export enum WatermarkTemplate {
  CUSTOM = '1',
  BANK = '2',
  COMPANY = '3',
  GENERAL = '4'
}

export type WatermarkColor = 'black' | 'red' | 'gray' | 'custom';

export interface WatermarkSettings {
  text: string;
  template: WatermarkTemplate;
  opacity: number;
  angle: number;
  color: WatermarkColor;
  customColor: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}
