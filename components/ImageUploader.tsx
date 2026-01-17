
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (img: ImageFile) => void;
  hasImage: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, hasImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案！');
      return;
    }
    const preview = URL.createObjectURL(file);
    onImageUpload({ file, preview });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative h-80 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : hasImage 
            ? 'border-green-200 bg-green-50/30' 
            : 'border-gray-300 bg-white hover:border-blue-400'
      }`}
    >
      <input
        type="file"
        id="imageInput"
        className="hidden"
        accept="image/*"
        onChange={onChange}
      />
      
      {hasImage ? (
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
            <ImageIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-800 font-medium">圖片已就緒</p>
          <label 
            htmlFor="imageInput"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-semibold cursor-pointer underline decoration-dotted"
          >
            點擊此處更換圖片
          </label>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 p-5 rounded-full mb-4">
            <Upload className="w-10 h-10 text-blue-500" />
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-2">拖曳圖片到此處</p>
          <p className="text-gray-500 text-sm mb-6">支援 JPG, PNG, WEBP 格式</p>
          <label
            htmlFor="imageInput"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            選取檔案
          </label>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
