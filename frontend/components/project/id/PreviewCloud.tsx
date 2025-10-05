import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PreviewProps {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  alt?: string;
  className?: string;
}

const PreviewCloud: React.FC<PreviewProps> = ({ url, type, alt = 'Preview', className = '' }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reset error and loading states when URL or type changes
  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [url, type]);

  // Function to render different previews based on type
  const renderPreview = () => {
    if (error || !url) {
      return (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500">Preview not available</span>
        </div>
      );
    }

    switch (type) {
      case 'image':
        return (
          <div className="relative w-full h-full">
            <Image
              src={url}
              alt={alt}
              fill
              className="object-contain"
              onLoad={() => setLoading(false)}
              onError={() => setError(true)}
              unoptimized={url.includes('cloudinary')}
            />
          </div>
        );

      case 'video':
        return (
          <video
            className="w-full h-full object-contain"
            controls
            onLoadedData={() => setLoading(false)}
            onError={() => setError(true)}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center bg-primary dark:bg-gray-900 p-4">
            <audio
              className="w-full max-w-md"
              controls
              onLoadedData={() => setLoading(false)}
              onError={() => setError(true)}
            >
              <source src={url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case 'document':
        return (
          <div className="w-full h-full">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              onError={() => setError(true)}
              title="Document Preview"
            />
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">Preview not available for this file type</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-pulse">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      {renderPreview()}
    </div>
  );
};

export default PreviewCloud;