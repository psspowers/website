import React, { useState, useRef, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  className?: string;
}

const ZoomableContent: React.FC<Props> = ({
  children,
  minZoom = 0.25,
  maxZoom = 4,
  defaultZoom = 1,
  className = ''
}) => {
  const [zoom, setZoom] = useState(defaultZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset to default state
  const resetView = () => {
    setZoom(defaultZoom);
    setPosition({ x: 0, y: 0 });
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, minZoom));
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: WheelEvent) => {
    if (!e.shiftKey) return;
    e.preventDefault();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate mouse position relative to container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom
    const delta = -e.deltaY;
    const factor = 0.1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * (1 + factor * Math.sign(delta))));

    // Calculate new position to zoom towards mouse
    const scaleChange = newZoom - zoom;
    const newX = position.x - (mouseX - rect.width / 2) * scaleChange;
    const newY = position.y - (mouseY - rect.height / 2) * scaleChange;

    setZoom(newZoom);
    setPosition({ x: newX, y: newY });
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '0') {
        e.preventDefault();
        resetView();
      } else if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
    }
  };

  // Initialize event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.addEventListener('keydown', handleKeyDown);
    };
  }, [zoom, position]);

  return (
    <div className="relative" aria-label="Zoomable content area">
      {/* Zoom Controls */}
      <div 
        className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 z-10"
        role="toolbar"
        aria-label="Zoom controls"
      >
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Zoom in"
          title="Zoom in (Ctrl + +)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Zoom out"
          title="Zoom out (Ctrl + -)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={resetView}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Reset view"
          title="Reset view (Ctrl + 0)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <div 
          className="text-sm font-medium text-center py-1 border-t"
          aria-live="polite"
          aria-atomic="true"
        >
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className={`overflow-hidden cursor-grab ${className}`}
        style={{ 
          touchAction: 'none',
          cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default')
        }}
      >
        <div
          ref={contentRef}
          className="origin-center transition-transform duration-200"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          }}
        >
          {children}
        </div>
      </div>

      {/* Keyboard Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 text-sm">
        <p className="font-medium mb-2">Keyboard Shortcuts:</p>
        <ul className="space-y-1 text-gray-600">
          <li>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Scroll</kbd> to zoom
          </li>
          <li>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + +/-</kbd> to zoom in/out
          </li>
          <li>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + 0</kbd> to reset view
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ZoomableContent;