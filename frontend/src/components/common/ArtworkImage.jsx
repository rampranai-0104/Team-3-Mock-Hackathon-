import React, { useState } from 'react';

/**
 * Reusable ArtworkImage component with:
 * - Loading state (shimmer skeleton)
 * - onError fallback (graceful Warli earth-tone SVG placeholder)
 * - Object-fit handling
 */
export default function ArtworkImage({
  src,
  alt = 'Artisan Artwork',
  className = '',
  style = {},
  aspectRatio = 'auto',
  ...props
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SVG Fallback for authentic Warli tribal earth-canvas pattern
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%239f3c16">
    <rect width="100%" height="100%" fill="%23822801"/>
    <circle cx="300" cy="200" r="140" fill="none" stroke="%23f5f3ed" stroke-width="4" stroke-dasharray="8 8"/>
    <circle cx="300" cy="200" r="90" fill="none" stroke="%23ffdbcf" stroke-width="3"/>
    <circle cx="300" cy="200" r="40" fill="%23f5f3ed"/>
    <polygon points="300,60 315,100 285,100" fill="%23f5f3ed"/>
    <polygon points="300,340 315,300 285,300" fill="%23f5f3ed"/>
    <polygon points="160,200 200,215 200,185" fill="%23f5f3ed"/>
    <polygon points="440,200 400,215 400,185" fill="%23f5f3ed"/>
    <text x="300" y="206" font-family="serif" font-size="14" fill="%23822801" text-anchor="middle" font-weight="bold">TVARITA</text>
    <text x="300" y="380" font-family="sans-serif" font-size="13" fill="%23ffdbcf" text-anchor="middle" letter-spacing="1">AUTHENTIC GOND &amp; WARLI HERITAGE</text>
  </svg>`;

  return (
    <div
      className={`artwork-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: aspectRatio,
        ...style,
      }}
    >
      {isLoading && (
        <div
          className="image-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />
      )}

      <img
        src={hasError ? fallbackSvg : (src || fallbackSvg)}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        {...props}
      />
    </div>
  );
}
