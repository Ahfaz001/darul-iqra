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
  List,
  ArrowUp,
  ArrowDown,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Use CDN for PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  onClose: () => void;
}

interface SearchResult {
  pageIndex: number;
  matchIndex: number;
  text: string;
}

const PDFViewer = ({ fileUrl, title, onClose }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  // Responsive state
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [fitToWidth, setFitToWidth] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pageTexts, setPageTexts] = useState<Map<number, string>>(new Map());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<any>(null);

  // Calculate container width
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    window.addEventListener('orientationchange', () => setTimeout(updateContainerWidth, 100));

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
      window.removeEventListener('orientationchange', updateContainerWidth);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSearch) setShowSearch(false);
        else if (isFullscreen) setIsFullscreen(false);
        else onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, showSearch, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Extract text from all pages for search
  const extractAllPageTexts = useCallback(async () => {
    if (!pdfDocRef.current) return;
    
    const textsMap = new Map<number, string>();
    
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdfDocRef.current.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        textsMap.set(i, pageText);
      } catch (error) {
        console.error(`Error extracting text from page ${i}:`, error);
      }
    }
    
    setPageTexts(textsMap);
  }, [numPages]);

  const onDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages);
    pdfDocRef.current = pdf;
    setLoading(false);
    
    // Extract text for search after a short delay
    setTimeout(() => {
      extractAllPageTexts();
    }, 500);
  };

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  }, [numPages]);

  const handleZoomIn = () => {
    setFitToWidth(false);
    setScale(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setFitToWidth(false);
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleFitToWidth = () => setFitToWidth(true);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
      setShowThumbnails(false);
    }
  };

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (pageTexts.size === 0) {
      toast.error('متن ابھی لوڈ ہو رہا ہے...');
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    for (const [pageNum, text] of pageTexts.entries()) {
      const lowerText = text.toLowerCase();
      let position = lowerText.indexOf(query);
      let matchIndex = 0;
      
      while (position !== -1) {
        const start = Math.max(0, position - 30);
        const end = Math.min(text.length, position + query.length + 30);
        const contextText = text.substring(start, end);
        
        results.push({ pageIndex: pageNum, matchIndex, text: contextText });
        matchIndex++;
        position = lowerText.indexOf(query, position + 1);
      }
    }

    setSearchResults(results);
    setCurrentSearchIndex(0);
    
    if (results.length > 0) {
      setCurrentPage(results[0].pageIndex);
      toast.success(`${results.length} نتائج ملے`);
    } else {
      toast.error('کوئی نتیجہ نہیں ملا');
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

  // Calculate responsive page width
  const getPageWidth = () => {
    if (!fitToWidth) return undefined;
    const padding = 16;
    const maxWidth = Math.min(containerWidth - padding * 2, 900);
    return maxWidth > 0 ? maxWidth : undefined;
  };

  const pageWidth = getPageWidth();

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gray-900 ${isFullscreen ? '' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between shrink-0 safe-area-top">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 shrink-0 h-9 w-9">
            <X className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-sm sm:text-lg truncate">{title}</h2>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`text-white hover:bg-white/20 h-9 w-9 ${showThumbnails ? 'bg-white/20' : ''}`}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className={`text-white hover:bg-white/20 h-9 w-9 ${showSearch ? 'bg-white/20' : ''}`}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20 h-9 w-9">
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-gray-800 px-2 sm:px-4 py-2 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2 max-w-xl mx-auto">
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="تلاش کریں..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-sm h-9"
              dir="auto"
            />
            <Button onClick={handleSearch} disabled={isSearching} size="sm" className="bg-teal-600 hover:bg-teal-700 h-9 px-3">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={goToPrevSearchResult} className="text-white hover:bg-white/10 h-7 w-7 p-0">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-white text-xs">
                {currentSearchIndex + 1} / {searchResults.length}
              </span>
              <Button variant="ghost" size="sm" onClick={goToNextSearchResult} className="text-white hover:bg-white/10 h-7 w-7 p-0">
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {showThumbnails && (
          <div className="w-24 sm:w-28 bg-gray-900 border-r border-gray-700 shrink-0">
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
                        <Page pageNumber={pageNum} width={70} renderTextLayer={false} renderAnnotationLayer={false} />
                      </Document>
                    </div>
                    <div className="bg-gray-800 text-center py-1">
                      <span className="text-xs text-gray-300">{pageNum}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div ref={containerRef} className="flex-1 overflow-auto bg-gray-800 flex justify-center items-start p-2 sm:p-4">
          <Document 
            file={fileUrl} 
            onLoadSuccess={onDocumentLoadSuccess} 
            loading={
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-teal-500 animate-spin mb-4" />
                <p className="text-gray-400">کتاب لوڈ ہو رہی ہے...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-red-400">PDF لوڈ نہیں ہوا</p>
              </div>
            }
            className="flex flex-col items-center select-text"
            onLoadError={(error) => {
              console.error('PDF load error:', error);
              setLoading(false);
              toast.error('PDF لوڈ نہیں ہوا');
            }}
          >
            {!loading && (
              <Page 
                pageNumber={currentPage} 
                width={pageWidth}
                scale={fitToWidth ? undefined : scale}
                className="shadow-2xl max-w-full"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                canvasBackground="white"
                loading={
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
                  </div>
                }
              />
            )}
          </Document>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-700 px-2 sm:px-4 py-2 sm:py-3 shrink-0 safe-area-bottom">
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" onClick={handlePrevPage} disabled={currentPage <= 1} className="text-white hover:bg-white/10 disabled:opacity-30 h-10 px-2 sm:px-3">
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline ml-1">پچھلا</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2">
            <Input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) setCurrentPage(page);
              }}
              className="w-14 sm:w-16 h-10 text-center bg-gray-800 border-gray-600 text-white text-sm"
            />
            <span className="text-gray-400 text-sm">/ {numPages}</span>
          </div>

          <Button variant="ghost" onClick={handleNextPage} disabled={currentPage >= numPages} className="text-white hover:bg-white/10 disabled:opacity-30 h-10 px-2 sm:px-3">
            <span className="hidden sm:inline mr-1">اگلا</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-white hover:bg-white/10 h-8 w-8 p-0" disabled={!fitToWidth && scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleFitToWidth} className={`text-white hover:bg-white/10 h-8 px-2 text-xs ${fitToWidth ? 'bg-white/20' : ''}`}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Fit
          </Button>
          
          <span className="text-white text-xs min-w-[45px] text-center">
            {fitToWidth ? 'Auto' : `${Math.round(scale * 100)}%`}
          </span>
          
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-white hover:bg-white/10 h-8 w-8 p-0" disabled={!fitToWidth && scale >= 4}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
