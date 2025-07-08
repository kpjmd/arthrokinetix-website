import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  thumbnailSrc = null,
  onLoad = null,
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(thumbnailSrc || src);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && thumbnailSrc && src !== thumbnailSrc) {
      // Load full-size image
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      img.src = src;
    } else if (isInView) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [isInView, src, thumbnailSrc, onLoad]);

  return (
    <div ref={imgRef} className={`relative ${className}`} style={style}>
      {isInView && (
        <>
          <img
            src={currentSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } w-full h-auto`}
            onLoad={() => {
              if (!thumbnailSrc) {
                setIsLoaded(true);
                if (onLoad) onLoad();
              }
            }}
          />
          {!isLoaded && thumbnailSrc && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
          )}
        </>
      )}
      {!isInView && (
        <div className="bg-gray-200 w-full h-48 rounded animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;