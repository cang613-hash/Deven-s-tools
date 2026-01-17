
import React from 'react';
import { WatermarkSettings, WatermarkTemplate, WatermarkColor } from '../types';

interface ControlPanelProps {
  settings: WatermarkSettings;
  onSettingsChange: (settings: WatermarkSettings) => void;
  type: 'content' | 'style';
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange, type }) => {
  
  const handleUpdate = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  if (type === 'content') {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">自訂文字 (XX)</label>
          <input
            type="text"
            value={settings.text}
            onChange={(e) => handleUpdate('text', e.target.value)}
            placeholder="例如：王小明"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">浮水印範本</label>
          <select
            value={settings.template}
            onChange={(e) => handleUpdate('template', e.target.value as WatermarkTemplate)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value={WatermarkTemplate.CUSTOM}>「XX」 (僅文字)</option>
            <option value={WatermarkTemplate.BANK}>僅提供「XX」銀行申請使用，如塗改或其他用途無效！</option>
            <option value={WatermarkTemplate.COMPANY}>僅供「XX」公司使用，如塗改或其他用途無效！</option>
            <option value={WatermarkTemplate.GENERAL}>僅供「XX」申請使用！</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">透明度 ({Math.round(settings.opacity * 100)}%)</label>
          <span className="text-xs text-gray-400">設定範圍: 30%~50%</span>
        </div>
        <input
          type="range"
          min="0.3"
          max="0.5"
          step="0.01"
          value={settings.opacity}
          onChange={(e) => handleUpdate('opacity', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">旋轉角度 ({settings.angle}°)</label>
          <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded">建議：45度</span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          step="1"
          value={settings.angle}
          onChange={(e) => handleUpdate('angle', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between mt-1 text-[10px] text-gray-400">
          <span>0°</span>
          <span>90°</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">浮水印顏色</label>
        <div className="flex flex-wrap gap-4 items-center">
          {(['black', 'red', 'gray'] as WatermarkColor[]).map((color) => (
            <button
              key={color}
              onClick={() => handleUpdate('color', color)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm ${
                settings.color === color 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-100" 
                style={{ backgroundColor: color === 'gray' ? '#888' : color }} 
              />
              {color === 'black' ? '黑色' : color === 'red' ? '紅色' : '灰色'}
            </button>
          ))}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdate('color', 'custom')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm ${
                settings.color === 'custom' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-100" 
                style={{ backgroundColor: settings.customColor }} 
              />
              自訂
            </button>
            
            {settings.color === 'custom' && (
              <input 
                type="color"
                value={settings.customColor}
                onChange={(e) => handleUpdate('customColor', e.target.value)}
                className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
