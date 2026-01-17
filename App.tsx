
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Download, Settings, Type, Palette, ShieldCheck, RefreshCw } from 'lucide-react';
import { WatermarkTemplate, WatermarkSettings, ImageFile, WatermarkColor } from './types';
import ControlPanel from './components/ControlPanel';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>({
    text: '您的姓名',
    template: WatermarkTemplate.CUSTOM,
    opacity: 0.4,
    angle: 45,
    color: 'gray',
    customColor: '#ff0000',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyWatermark = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.preview;

    img.onload = () => {
      // Set canvas size to original image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Setup Watermark Style
      const { text, template, opacity, angle, color, customColor } = settings;
      
      let watermarkText = '';
      switch (template) {
        case WatermarkTemplate.CUSTOM:
          watermarkText = text;
          break;
        case WatermarkTemplate.BANK:
          watermarkText = `僅提供「${text}」銀行申請使用，如塗改或其他用途無效！`;
          break;
        case WatermarkTemplate.COMPANY:
          watermarkText = `僅供「${text}」公司使用，如塗改或其他用途無效！`;
          break;
        case WatermarkTemplate.GENERAL:
          watermarkText = `僅供「${text}」申請使用！`;
          break;
      }

      const textColor = color === 'custom' ? customColor : color;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = textColor;
      
      // Dynamic font size based on image width
      const fontSize = Math.max(20, Math.floor(canvas.width / 25));
      ctx.font = `bold ${fontSize}px "Noto Sans TC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Tiled Watermark Logic
      const rad = (angle * Math.PI) / 180;
      const spacingX = fontSize * 10;
      const spacingY = fontSize * 6;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-rad);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Increase area for rotation coverage
      const overScan = 1.5;
      const startX = -canvas.width * (overScan - 1);
      const startY = -canvas.height * (overScan - 1);
      const endX = canvas.width * overScan;
      const endY = canvas.height * overScan;

      for (let x = startX; x < endX; x += spacingX) {
        for (let y = startY; y < endY; y += spacingY) {
          ctx.fillText(watermarkText, x, y);
        }
      }

      setProcessedImageUrl(canvas.toDataURL('image/jpeg', 0.95));
    };
  }, [image, settings]);

  useEffect(() => {
    if (image) {
      applyWatermark();
    }
  }, [image, settings, applyWatermark]);

  const handleDownload = () => {
    if (!processedImageUrl) return;
    const link = document.createElement('a');
    link.download = `watermarked_${Date.now()}.jpg`;
    link.href = processedImageUrl;
    link.click();
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImageUrl(null);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">證件照浮水印工具</h1>
          </div>
          <div className="flex items-center gap-4">
            {image && (
              <button 
                onClick={handleReset}
                className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重新上傳
              </button>
            )}
            <button 
              disabled={!processedImageUrl}
              onClick={handleDownload}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                processedImageUrl 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              下載結果
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Top Section: Upload & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <Upload className="w-5 h-5" />
              1. 上傳照片
            </div>
            <ImageUploader onImageUpload={(img) => setImage(img)} hasImage={!!image} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              2. 即時預覽
            </div>
            <ImagePreview processedImageUrl={processedImageUrl} originalImage={image} />
          </div>
        </div>

        {/* Bottom Section: Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Watermark Content */}
            <section>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-6">
                <Type className="w-5 h-5" />
                浮水印內容設定
              </div>
              <ControlPanel 
                settings={settings} 
                onSettingsChange={(newSettings) => setSettings(newSettings)}
                type="content"
              />
            </section>

            {/* Watermark Style */}
            <section>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-6">
                <Palette className="w-5 h-5" />
                浮水印樣式風格
              </div>
              <ControlPanel 
                settings={settings} 
                onSettingsChange={(newSettings) => setSettings(newSettings)}
                type="style"
              />
            </section>
          </div>
        </div>

        {/* Hidden Canvas for Processing */}
        <canvas ref={canvasRef} className="hidden" />
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2024 隱私第一，照片僅在瀏覽器本地處理，不會上傳至伺服器。</p>
      </footer>
    </div>
  );
};

export default App;
