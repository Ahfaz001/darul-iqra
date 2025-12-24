import { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
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
  Loader2,
  Copy,
  Check,
  ScanText,
  AlertCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

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
  text: string;
}

const PDFViewer = ({ fileUrl, title, onClose }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
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
  const [loadingAllText, setLoadingAllText] = useState(false);
  const [allTextLoaded, setAllTextLoaded] = useState(false);
  
  // OCR state for scanned PDFs
  const [isScannedPDF, setIsScannedPDF] = useState(false);
  const [ocrInProgress, setOcrInProgress] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrTexts, setOcrTexts] = useState<Map<number, string>>(new Map());
  const [ocrLoaded, setOcrLoaded] = useState(false);
  
  // Copy state
  const [copied, setCopied] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Check if PDF is scanned (no text layer)
  const checkIfScannedPDF = useCallback(async () => {
    if (!pdfDocRef.current) return false;
    
    try {
      // Check first 3 pages for text
      const pagesToCheck = Math.min(3, numPages);
      let totalTextLength = 0;
      
      for (let i = 1; i <= pagesToCheck; i++) {
        const page = await pdfDocRef.current.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join('');
        totalTextLength += pageText.trim().length;
      }
      
      // If very little text found, it's likely a scanned PDF
      const avgTextPerPage = totalTextLength / pagesToCheck;
      return avgTextPerPage < 50; // Less than 50 chars per page = scanned
    } catch (error) {
      console.error('Error checking PDF type:', error);
      return false;
    }
  }, [numPages]);

  // Load all pages text for search (regular PDFs)
  const loadAllPagesText = useCallback(async () => {
    if (!pdfDocRef.current || allTextLoaded || loadingAllText) return;
    
    setLoadingAllText(true);
    try {
      const pdf = pdfDocRef.current;
      const textsMap = new Map<number, string>();
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        textsMap.set(i, pageText);
      }
      
      setPageTexts(textsMap);
      setAllTextLoaded(true);
      
      // Check if this is a scanned PDF
      const isScanned = await checkIfScannedPDF();
      setIsScannedPDF(isScanned);
      
      if (isScanned) {
        toast.info('Scanned PDF detected. Use "OCR Scan" button to enable search.', {
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error loading page texts:', error);
    } finally {
      setLoadingAllText(false);
    }
  }, [numPages, allTextLoaded, loadingAllText, checkIfScannedPDF]);

  // OCR: Extract text from page image using Google Cloud Vision
  const extractTextFromPage = useCallback(async (pageNum: number): Promise<string> => {
    if (!pdfDocRef.current) return '';
    
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 }); // Higher scale for better OCR
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return '';
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert to base64
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
      
      // Call OCR edge function
      const { data, error } = await supabase.functions.invoke('ocr-extract-text', {
        body: { imageBase64 }
      });
      
      if (error) throw error;
      
      if (data.success && data.text) {
        return data.text;
      }
      
      return '';
    } catch (error) {
      console.error(`OCR error for page ${pageNum}:`, error);
      return '';
    }
  }, []);

  // Run OCR on all pages
  const runOCROnAllPages = useCallback(async () => {
    if (ocrInProgress || ocrLoaded) return;
    
    setOcrInProgress(true);
    setOcrProgress(0);
    
    const ocrTextsMap = new Map<number, string>();
    
    try {
      for (let i = 1; i <= numPages; i++) {
        const text = await extractTextFromPage(i);
        ocrTextsMap.set(i, text);
        setOcrProgress(Math.round((i / numPages) * 100));
        
        // Update state incrementally
        setOcrTexts(new Map(ocrTextsMap));
      }
      
      setOcrLoaded(true);
      toast.success(`OCR complete! ${numPages} pages scanned.`);
    } catch (error) {
      console.error('OCR failed:', error);
      toast.error('OCR failed. Please try again.');
    } finally {
      setOcrInProgress(false);
    }
  }, [numPages, extractTextFromPage, ocrInProgress, ocrLoaded]);

  // Run OCR on current page only
  const runOCROnCurrentPage = useCallback(async () => {
    if (ocrInProgress) return;
    
    setOcrInProgress(true);
    
    try {
      const text = await extractTextFromPage(currentPage);
      
      if (text) {
        setOcrTexts(prev => new Map(prev).set(currentPage, text));
        toast.success('Page text extracted!');
      } else {
        toast.error('No text found on this page');
      }
    } catch (error) {
      console.error('OCR failed:', error);
      toast.error('OCR failed');
    } finally {
      setOcrInProgress(false);
    }
  }, [currentPage, extractTextFromPage, ocrInProgress]);

  const onDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages);
    pdfDocRef.current = pdf;
    setLoading(false);
    
    // Start loading all text in background
    setTimeout(() => {
      loadAllPagesText();
    }, 500);
  };

  const onPageLoadSuccess = async (page: any) => {
    // Also extract text for current page if not already loaded
    if (!pageTexts.has(page.pageNumber)) {
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      setPageTexts(prev => new Map(prev).set(page.pageNumber, pageText));
    }
  };

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  }, [numPages]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 4));
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

  // Get text for a page (from OCR or regular text layer)
  const getPageText = useCallback((pageNum: number): string => {
    // Prefer OCR text for scanned PDFs
    if (ocrTexts.has(pageNum)) {
      return ocrTexts.get(pageNum) || '';
    }
    return pageTexts.get(pageNum) || '';
  }, [ocrTexts, pageTexts]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // For scanned PDFs, check if OCR is done
    if (isScannedPDF && !ocrLoaded && ocrTexts.size === 0) {
      toast.error('Please run OCR scan first to enable search on scanned PDFs');
      return;
    }

    // Ensure all text is loaded first
    if (!allTextLoaded && !isScannedPDF) {
      await loadAllPagesText();
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search through all available texts (OCR or regular)
    const textsToSearch = ocrLoaded || ocrTexts.size > 0 ? ocrTexts : pageTexts;
    
    textsToSearch.forEach((text, pageIndex) => {
      const lowerText = text.toLowerCase();
      let matchIndex = 0;
      let position = lowerText.indexOf(query);
      while (position !== -1) {
        // Get context around match
        const start = Math.max(0, position - 30);
        const end = Math.min(text.length, position + query.length + 30);
        const contextText = text.substring(start, end);
        
        results.push({ pageIndex, matchIndex, text: contextText });
        matchIndex++;
        position = lowerText.indexOf(query, position + 1);
      }
    });

    setSearchResults(results);
    setCurrentSearchIndex(0);
    
    // Go to first result page
    if (results.length > 0) {
      setCurrentPage(results[0].pageIndex);
      toast.success(`Found ${results.length} result(s)`);
    } else {
      toast.error('No results found');
    }
    
    setIsSearching(false);
  }, [searchQuery, pageTexts, ocrTexts, allTextLoaded, isScannedPDF, ocrLoaded, loadAllPagesText]);

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

  const handleCopySelectedText = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    
    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText);
        setCopied(true);
        toast.success('Text copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy text');
      }
    } else {
      toast.info('Select some text first to copy');
    }
  };

  const handleCopyPageText = async () => {
    const pageText = getPageText(currentPage);
    if (pageText) {
      try {
        await navigator.clipboard.writeText(pageText);
        setCopied(true);
        toast.success('Page text copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy text');
      }
    } else if (isScannedPDF) {
      toast.info('Run OCR scan first to extract text from this scanned page');
    } else {
      toast.error('No text available on this page');
    }
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
          
          {/* Scanned PDF indicator */}
          {isScannedPDF && (
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs">
              <AlertCircle className="h-3 w-3" />
              Scanned PDF
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* OCR Button - only show for scanned PDFs */}
          {isScannedPDF && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runOCROnAllPages}
              disabled={ocrInProgress || ocrLoaded}
              className="text-white hover:bg-white/20 h-8 text-xs gap-1"
              title="Scan all pages with OCR for search"
            >
              {ocrInProgress ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="hidden sm:inline">{ocrProgress}%</span>
                </>
              ) : ocrLoaded ? (
                <>
                  <Check className="h-3 w-3 text-green-400" />
                  <span className="hidden sm:inline">OCR Done</span>
                </>
              ) : (
                <>
                  <ScanText className="h-3 w-3" />
                  <span className="hidden sm:inline">OCR Scan</span>
                </>
              )}
            </Button>
          )}
          
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopySelectedText}
            className="text-white hover:bg-white/20 h-8 w-8"
            title="Copy selected text"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
          
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
              disabled={scale >= 4}
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
        <div className="bg-teal-800/90 px-4 py-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-white/70" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search in book... (کتاب میں تلاش کریں)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="flex-1 h-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
              dir="auto"
            />
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={isSearching || loadingAllText}
              className="bg-white/20 hover:bg-white/30 h-8"
            >
              {isSearching || loadingAllText ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
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
          
          {/* Loading/OCR indicator */}
          {loadingAllText && (
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Loading book text...</span>
            </div>
          )}
          
          {/* OCR required warning */}
          {isScannedPDF && !ocrLoaded && ocrTexts.size === 0 && (
            <div className="flex items-center gap-2 text-orange-300 text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>This is a scanned PDF. Click "OCR Scan" button to enable search.</span>
            </div>
          )}
          
          {/* OCR progress */}
          {ocrInProgress && (
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>OCR scanning pages... {ocrProgress}%</span>
              <div className="flex-1 bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-teal-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Search result preview */}
          {searchResults.length > 0 && searchResults[currentSearchIndex] && (
            <div className="bg-white/10 rounded px-3 py-2 text-white/80 text-sm" dir="auto">
              <span className="text-white/50">Page {searchResults[currentSearchIndex].pageIndex}: </span>
              ...{searchResults[currentSearchIndex].text}...
            </div>
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
                    <div className="bg-gray-800 text-center py-1 flex items-center justify-center gap-1">
                      <span className="text-xs text-gray-300">Page {pageNum}</span>
                      {ocrTexts.has(pageNum) && (
                        <Check className="h-3 w-3 text-green-400" />
                      )}
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
            className="flex flex-col items-center select-text"
          >
            <Page 
              pageNumber={currentPage} 
              scale={scale}
              onLoadSuccess={onPageLoadSuccess}
              className="shadow-2xl"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              canvasBackground="white"
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
            
            {/* OCR This Page / Copy Page Text Button */}
            {isScannedPDF && !ocrTexts.has(currentPage) ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={runOCROnCurrentPage}
                disabled={ocrInProgress}
                className="text-white hover:bg-white/10 ml-2"
                title="Scan this page with OCR"
              >
                {ocrInProgress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ScanText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline text-xs">OCR Page</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPageText}
                className="text-white hover:bg-white/10 ml-2"
                title="Copy entire page text"
              >
                <Copy className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-xs">Copy Page</span>
              </Button>
            )}
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
            disabled={scale >= 4}
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
      
      {/* Hidden canvas for OCR rendering */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PDFViewer;
