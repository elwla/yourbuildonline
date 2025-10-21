// components/TruncatedUrlWithCopy.tsx
'use client';

import { useState } from 'react';

interface TruncatedUrlWithCopyProps {
  url: string;
  maxLength?: number;
  className?: string;
}

const TruncatedUrlWithCopy = ({ 
  url, 
  maxLength = 40, 
  className = "" 
}: TruncatedUrlWithCopyProps) => {
  const [copied, setCopied] = useState(false);

  const truncateUrl = (url: string, maxLength: number) => {
    if (url.length <= maxLength) return url;
    
    const start = url.substring(0, Math.floor(maxLength / 2) - 3);
    const end = url.substring(url.length - Math.floor(maxLength / 2) + 3);
    return `${start}...${end}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  };

  const displayUrl = truncateUrl(url, maxLength);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* URL truncada con tooltip */}
      <div 
        className="relative group"
        title={url} // Tooltip nativo con URL completa
      >
        <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all cursor-help">
          {displayUrl}
        </code>
        
        {/* Tooltip personalizado (opcional) */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
          <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            {url}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Botón de copiar */}
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
        title="Copiar URL completa"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Copiado!</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copiar</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TruncatedUrlWithCopy;