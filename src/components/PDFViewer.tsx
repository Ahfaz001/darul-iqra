import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Maximize2, Minimize2 } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  onClose: () => void;
}

const PDFViewer = ({ fileUrl, title, onClose }: PDFViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  useEffect(() => {
    // Prevent body scroll when viewer is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/95 flex flex-col ${isFullscreen ? '' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-teal-900 to-teal-800 text-white">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-[400px]">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="text-white hover:bg-white/20"
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <span className="text-sm min-w-[50px] text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="text-white hover:bg-white/20"
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-900 flex justify-center">
        <div 
          className="h-full w-full"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
            className="w-full h-full min-h-screen"
            title={title}
            style={{ border: 'none' }}
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="bg-gray-900 text-gray-400 text-center py-2 text-sm">
        Press <kbd className="bg-gray-700 px-2 py-0.5 rounded text-white">ESC</kbd> to close
      </div>
    </div>
  );
};

export default PDFViewer;
