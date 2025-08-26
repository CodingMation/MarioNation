import React, { useRef, useState, useEffect, useCallback } from "react";

const ZoomableImage = ({ src, alt, zoomEnabled = true }) => {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });
  const [showZoomHint, setShowZoomHint] = useState(false);
  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);

  // Clamp scale between min and max values
  const clampScale = useCallback((newScale) => {
    return Math.min(Math.max(newScale, 1), 5);
  }, []);

  // Update scale with boundary checks
  const updateScale = useCallback((newScale, focusX = 0.5, focusY = 0.5) => {
    if (!zoomEnabled) return;
    
    const clampedScale = clampScale(newScale);
    setScale(clampedScale);
    
    // Adjust scroll position to maintain focus point
    if (containerRef.current && clampedScale !== 1) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollLeft = (focusX * containerRect.width * clampedScale) - (containerRect.width / 2);
      const scrollTop = (focusY * containerRect.height * clampedScale) - (containerRect.height / 2);
      
      containerRef.current.scrollLeft = scrollLeft;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [zoomEnabled, clampScale]);

  // Reset zoom to initial state
  const resetZoom = useCallback(() => {
    setScale(1);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Double click to toggle zoom
  const handleDoubleClick = useCallback((e) => {
    if (!zoomEnabled) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const focusX = (e.clientX - containerRect.left) / containerRect.width;
    const focusY = (e.clientY - containerRect.top) / containerRect.height;
    
    if (scale === 1) {
      updateScale(2, focusX, focusY);
    } else {
      resetZoom();
    }
  }, [scale, updateScale, resetZoom, zoomEnabled]);

  // Pinch zoom for touch devices - Fixed implementation
  const handleTouchStart = useCallback((e) => {
    if (!zoomEnabled) return;
    
    if (e.touches.length === 2) {
      e.preventDefault();
      // Calculate the initial distance between fingers
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      setInitialTouchDistance(distance);
      setInitialScale(scale);
      
      // Calculate the center point between the two fingers
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const focusX = (centerX - containerRect.left) / containerRect.width;
      const focusY = (centerY - containerRect.top) / containerRect.height;
      
      setLastPointerPos({ x: focusX, y: focusY });
    } else if (e.touches.length === 1 && scale > 1) {
      // Single touch for dragging when zoomed
      setIsDragging(true);
      setLastPointerPos({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  }, [zoomEnabled, scale]);

  const handleTouchMove = useCallback((e) => {
    if (!zoomEnabled) return;
    
    if (e.touches.length === 2) {
      e.preventDefault();
      
      // Calculate current distance between fingers
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (initialTouchDistance !== null) {
        // Calculate scale based on the change in distance
        const scaleChange = distance / initialTouchDistance;
        const newScale = clampScale(initialScale * scaleChange);
        
        setScale(newScale);
        
        // Calculate the center point for zoom focus
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const focusX = (centerX - containerRect.left) / containerRect.width;
        const focusY = (centerY - containerRect.top) / containerRect.height;
        
        // Adjust scroll position to maintain the pinch center
        if (containerRef.current && newScale !== 1) {
          containerRef.current.scrollLeft = focusX * containerRect.width * newScale - (containerRect.width / 2);
          containerRef.current.scrollTop = focusY * containerRect.height * newScale - (containerRect.height / 2);
        }
      }
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      const dx = e.touches[0].clientX - lastPointerPos.x;
      const dy = e.touches[0].clientY - lastPointerPos.y;

      if (containerRef.current) {
        containerRef.current.scrollLeft -= dx;
        containerRef.current.scrollTop -= dy;
      }

      setLastPointerPos({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  }, [zoomEnabled, initialTouchDistance, initialScale, isDragging, lastPointerPos, clampScale]);

  const handleTouchEnd = useCallback((e) => {
    if (!zoomEnabled) return;
    
    if (e.touches.length === 0) {
      // All fingers lifted
      setInitialTouchDistance(null);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      // One finger lifted, keep tracking the remaining finger for dragging
      setLastPointerPos({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  }, [zoomEnabled]);

  // Mouse interactions
  const handleMouseDown = useCallback((e) => {
    if (!zoomEnabled || scale === 1) return;
    setIsDragging(true);
    setLastPointerPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, [scale, zoomEnabled]);

  const handleMouseMove = useCallback((e) => {
    if (!zoomEnabled || !isDragging || scale === 1) return;
    
    const dx = e.clientX - lastPointerPos.x;
    const dy = e.clientY - lastPointerPos.y;

    if (containerRef.current) {
      containerRef.current.scrollLeft -= dx;
      containerRef.current.scrollTop -= dy;
    }

    setLastPointerPos({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  }, [isDragging, lastPointerPos, scale, zoomEnabled]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Show zoom hint on first render
  useEffect(() => {
    if (zoomEnabled) {
      setShowZoomHint(true);
      const timer = setTimeout(() => setShowZoomHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [zoomEnabled]);

  return (
    <div className="zoomable-image-container" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      overflow: 'hidden'
    }}>
      <div
        ref={containerRef}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'black', 
          overflow: 'auto', 
          userSelect: 'none',
          cursor: zoomEnabled 
            ? (scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in") 
            : "default",
          touchAction: scale > 1 ? 'none' : 'pan-y'
        }}
      >
        <div 
          ref={imageWrapperRef}
          style={{ 
            width: `${scale * 100}%`, 
            height: `${scale * 100}%`, 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            transition: scale === 1 ? 'width 0.3s ease, height 0.3s ease' : 'none'
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: zoomEnabled ? "100%" : "60vh",
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        </div>
      </div>
      
      {showZoomHint && zoomEnabled && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 10,
          animation: 'fadeInOut 3s forwards'
        }}>
          Pinch or double-click to zoom • Drag to pan
        </div>
      )}
      
      {scale > 1 && (
        <button
          onClick={resetZoom}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Reset zoom"
        >
          ↺
        </button>
      )}
      
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ZoomableImage;