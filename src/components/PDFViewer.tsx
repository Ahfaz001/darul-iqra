import { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Maximize2, 
  Minimize2,
  Search,
  BookOpen,
  List,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  onClose: () => void;
}

interface SearchResult {
  pageIndex: number;
  matchIndex: number;
}

const PDFViewer = ({ fileUrl, title, onClose }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pageTexts, setPageTexts] = useState<Map<number, string>>(new Map());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      }
      if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, showSearch, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onPageLoadSuccess = async (page: any) => {
    // Extract text for search
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    setPageTexts(prev => new Map(prev).set(page.pageNumber, pageText));
  };

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  }, [numPages]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
      setShowThumbnails(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search through all loaded page texts
    pageTexts.forEach((text, pageIndex) => {
      const lowerText = text.toLowerCase();
      let matchIndex = 0;
      let position = lowerText.indexOf(query);
      while (position !== -1) {
        results.push({ pageIndex, matchIndex });
        matchIndex++;
        position = lowerText.indexOf(query, position + 1);
      }
    });

    setSearchResults(results);
    setCurrentSearchIndex(0);
    
    // Go to first result page
    if (results.length > 0) {
      setCurrentPage(results[0].pageIndex);
    }
    
    setIsSearching(false);
  }, [searchQuery, pageTexts]);

  const goToNextSearchResult = () => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(nextIndex);
    setCurrentPage(searchResults[nextIndex].pageIndex);
  };

  const goToPrevSearchResult = () => {
    if (searchResults.length === 0) return;
    const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentSearchIndex(prevIndex);
    setCurrentPage(searchResults[prevIndex].pageIndex);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/95 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gradient-to-r from-teal-900 to-teal-800 text-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          <BookOpen className="h-5 w-5 hidden sm:block" />
          <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-[300px]">{title}</h2>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className={`text-white hover:bg-white/20 h-8 w-8 ${showSearch ? 'bg-white/20' : ''}`}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Thumbnails Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`text-white hover:bg-white/20 h-8 w-8 ${showThumbnails ? 'bg-white/20' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20 h-8 w-8"
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20 h-8 w-8"
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-teal-800/90 px-4 py-2 flex items-center gap-2">
          <Search className="h-4 w-4 text-white/70" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search in book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="flex-1 h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
          />
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-white/20 hover:bg-white/30 h-8"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
          {searchResults.length > 0 && (
            <div className="flex items-center gap-1 text-white text-sm">
              <span>{currentSearchIndex + 1}/{searchResults.length}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevSearchResult}
                className="text-white hover:bg-white/20 h-6 w-6"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextSearchResult}
                className="text-white hover:bg-white/20 h-6 w-6"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          )}
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <span className="text-white/70 text-sm">No results</span>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails Sidebar */}
        {showThumbnails && (
          <div className="w-28 sm:w-36 bg-gray-900 border-r border-gray-700">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                  <div
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      currentPage === pageNum 
                        ? 'border-teal-500 ring-2 ring-teal-500/50' 
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="bg-white p-1">
                      <Document file={fileUrl} loading={null}>
                        <Page 
                          pageNumber={pageNum} 
                          width={80}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                    <div className="bg-gray-800 text-center py-1">
                      <span className="text-xs text-gray-300">Page {pageNum}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* PDF Content */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-800 flex justify-center items-start py-4"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-teal-500 animate-spin mb-4" />
              <p className="text-gray-400">Loading book...</p>
            </div>
          )}
          
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            className="flex flex-col items-center"
          >
            <Page 
              pageNumber={currentPage} 
              scale={scale}
              onLoadSuccess={onPageLoadSuccess}
              className="shadow-2xl"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-900 border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            variant="ghost"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Page</span>
            <Input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setCurrentPage(page);
                }
              }}
              className="w-16 h-8 text-center bg-gray-800 border-gray-600 text-white text-sm"
            />
            <span className="text-gray-400 text-sm">of {numPages}</span>
          </div>

          <Button
            variant="ghost"
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>

        {/* Mobile Zoom */}
        <div className="flex sm:hidden items-center justify-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white hover:bg-white/10"
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-white text-sm min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-white hover:bg-white/10"
            disabled={scale >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Keyboard Hints */}
        <div className="hidden sm:flex items-center justify-center gap-4 mt-2 text-gray-500 text-xs">
          <span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">←</kbd> Previous</span>
          <span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">→</kbd> Next</span>
          <span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">Ctrl+F</kbd> Search</span>
          <span><kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
