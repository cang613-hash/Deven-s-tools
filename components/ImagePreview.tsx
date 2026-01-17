
import React from 'react';
import { Eye, ImageIcon } from 'lucide-react';
import { ImageFile } from '../types';

interface ImagePreviewProps {
  processedImageUrl: string | null;
  originalImage: ImageFile | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ processedImageUrl, originalImage }) => {
  return (
    <div className="h-80 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center relative">
      {!originalImage ? (
        <div className="text-center text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>等待照片上傳中...</p>
        </div>
      ) : (
        <div className="w-full h-full p-4 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {processedImageUrl ? (
            <img 
              src={processedImageUrl} 
              alt="Watermarked Preview" 
              className="max-w-full max-h-full object-contain rounded shadow-lg"
            />
          ) : (
            <div className="animate-pulse text-blue-500 flex flex-col items-center">
              <ImageIcon className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">生成預覽中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
