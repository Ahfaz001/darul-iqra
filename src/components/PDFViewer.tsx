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
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Use CDN for PDF.js worker - more reliable across environments
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  title: string;
  bookId?: string;
  onClose: () => void;
  autoStartOcr?: boolean;
}

interface SearchResult {
  pageIndex: number;
  matchIndex: number;
  text: string;
}

interface PageTextData {
  text: string;
  normalizedText: string;
  fromDb: boolean;
}

// Normalize text for search
const normalizeForSearch = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىئ]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ہ')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
};

const PDFViewer = ({ fileUrl, title, bookId, onClose, autoStartOcr = false }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [documentKey, setDocumentKey] = useState(0);
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
  
  // Text/OCR state
  const [isScannedPDF, setIsScannedPDF] = useState(false);
  const [pageTexts, setPageTexts] = useState<Map<number, PageTextData>>(new Map());
  const [ocrInProgress, setOcrInProgress] = useState(false);
  const [ocrAllProgress, setOcrAllProgress] = useState(0);
  const [ocrAllInProgress, setOcrAllInProgress] = useState(false);
  const [dbTextLoaded, setDbTextLoaded] = useState(false);
  const [ocrAutoStarted, setOcrAutoStarted] = useState(false);
  
  // Copy state
  const [copied, setCopied] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<any>(null);

  // Load pre-extracted text from database
  useEffect(() => {
    if (bookId && !dbTextLoaded) {
      loadTextFromDatabase();
    }
  }, [bookId, dbTextLoaded]);

  const loadTextFromDatabase = async () => {
    if (!bookId) return;
    
    try {
      const { data, error } = await supabase
        .from('book_pages')
        .select('page_number, text_content, normalized_text')
        .eq('book_id', bookId)
        .order('page_number');

      if (error) throw error;

      if (data && data.length > 0) {
        const textsMap = new Map<number, PageTextData>();
        data.forEach(page => {
          textsMap.set(page.page_number, {
            text: page.text_content,
            normalizedText: page.normalized_text,
            fromDb: true
          });
        });
        setPageTexts(textsMap);
        toast.success(`${data.length} صفحات کا متن لوڈ ہو گیا`);
      }
      setDbTextLoaded(true);
    } catch (error) {
      console.error('Error loading text from DB:', error);
      setDbTextLoaded(true);
    }
  };

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

  // Check if PDF is scanned
  const checkIfScannedPDF = useCallback(async () => {
    if (!pdfDocRef.current) return false;
    
    try {
      const pagesToCheck = Math.min(3, numPages);
      let totalTextLength = 0;
      
      for (let i = 1; i <= pagesToCheck; i++) {
        const page = await pdfDocRef.current.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join('');
        totalTextLength += pageText.trim().length;
      }
      
      return totalTextLength / pagesToCheck < 50;
    } catch (error) {
      console.error('Error checking PDF type:', error);
      return false;
    }
  }, [numPages]);

  // OCR single page
  const runOCROnPage = useCallback(async (pageNum: number): Promise<PageTextData | null> => {
    if (!pdfDocRef.current) return null;
    
    // Check if already loaded
    const existing = pageTexts.get(pageNum);
    if (existing?.text) return existing;
    
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport }).promise;
      
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.92);
      
      const { data, error } = await supabase.functions.invoke('ocr-extract-text', {
        body: { imageBase64, pageNumber: pageNum }
      });
      
      if (error) throw error;
      
      if (data.success) {
        const ocrData: PageTextData = {
          text: data.text || '',
          normalizedText: data.normalizedText || normalizeForSearch(data.text || ''),
          fromDb: false
        };
        
        // Save to database if we have bookId
        if (bookId && ocrData.text) {
          await supabase.from('book_pages').upsert({
            book_id: bookId,
            page_number: pageNum,
            text_content: ocrData.text,
            normalized_text: ocrData.normalizedText,
          }, { onConflict: 'book_id,page_number' });
        }
        
        setPageTexts(prev => new Map(prev).set(pageNum, { ...ocrData, fromDb: true }));
        return ocrData;
      }
      
      return null;
    } catch (error) {
      console.error(`OCR error for page ${pageNum}:`, error);
      return null;
    }
  }, [pageTexts, bookId]);

  // OCR current page
  const runOCROnCurrentPage = useCallback(async () => {
    if (ocrInProgress) return;
    
    setOcrInProgress(true);
    
    try {
      const result = await runOCROnPage(currentPage);
      
      if (result?.text) {
        toast.success('متن نکال لیا گیا!');
      } else {
        toast.error('اس صفحے پر کوئی متن نہیں ملا');
      }
    } catch (error) {
      toast.error('OCR ناکام');
    } finally {
      setOcrInProgress(false);
    }
  }, [currentPage, runOCROnPage, ocrInProgress]);

  // OCR all pages with DB progress updates
  const runOCROnAllPages = useCallback(async () => {
    if (ocrAllInProgress) return;
    
    setOcrAllInProgress(true);
    setOcrAllProgress(0);
    
    try {
      let successCount = 0;
      
      for (let i = 1; i <= numPages; i++) {
        // Skip if already have text
        if (pageTexts.get(i)?.text) {
          setOcrAllProgress(Math.round((i / numPages) * 100));
          successCount++;
          continue;
        }
        
        const result = await runOCROnPage(i);
        if (result?.text) successCount++;
        setOcrAllProgress(Math.round((i / numPages) * 100));
        
        // Update progress in DB every 5 pages or at the end
        if (bookId && (i % 5 === 0 || i === numPages)) {
          await supabase
            .from('books')
            .update({ 
              ocr_pages_done: successCount,
              ocr_status: 'processing'
            })
            .eq('id', bookId);
        }
      }
      
      // Update book OCR status to completed
      if (bookId) {
        await supabase
          .from('books')
          .update({ ocr_status: 'completed', ocr_pages_done: successCount })
          .eq('id', bookId);
      }
      
      toast.success(`تمام ${successCount} صفحات اسکین ہو گئے!`);
    } catch (error) {
      console.error('OCR All error:', error);
      // Mark as failed if error occurs
      if (bookId) {
        await supabase
          .from('books')
          .update({ ocr_status: 'failed' })
          .eq('id', bookId);
      }
      toast.error('OCR ناکام');
    } finally {
      setOcrAllInProgress(false);
    }
  }, [numPages, runOCROnPage, ocrAllInProgress, pageTexts, bookId]);

  // Auto-start OCR when autoStartOcr prop is true
  useEffect(() => {
    if (autoStartOcr && numPages > 0 && !ocrAutoStarted && !loading && dbTextLoaded) {
      // Check if already has OCR data
      const existingPages = pageTexts.size;
      if (existingPages < numPages) {
        setOcrAutoStarted(true);
        toast.info('OCR خود بخود شروع ہو رہا ہے...');
        runOCROnAllPages();
      }
    }
  }, [autoStartOcr, numPages, ocrAutoStarted, loading, dbTextLoaded, pageTexts.size, runOCROnAllPages]);

  const handleDocumentError = useCallback((err: any) => {
    console.error('PDF load error:', err);
    setLoading(false);
    setLoadError(err?.message || 'PDF failed to load');
    toast.error('PDF لوڈ نہیں ہوا');
  }, []);

  const handleRetryLoad = () => {
    setLoadError(null);
    setLoading(true);
    setNumPages(0);
    setCurrentPage(1);
    setOcrAutoStarted(false);
    setDocumentKey((k) => k + 1);
  };

  const onDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages);
    pdfDocRef.current = pdf;
    setLoadError(null);
    setLoading(false);
    
    // Update total_pages in DB if bookId exists
    if (bookId) {
      await supabase
        .from('books')
        .update({ total_pages: pdf.numPages })
        .eq('id', bookId);
    }
    
    setTimeout(async () => {
      const isScanned = await checkIfScannedPDF();
      setIsScannedPDF(isScanned);
      
      if (isScanned && pageTexts.size === 0 && !autoStartOcr) {
        toast.info('یہ اسکین شدہ PDF ہے۔ تلاش کے لیے OCR استعمال کریں', { duration: 5000 });
      }
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

  // Get text for a page
  const getPageText = useCallback((pageNum: number): string => {
    return pageTexts.get(pageNum)?.text || '';
  }, [pageTexts]);

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const availablePages = Array.from(pageTexts.entries())
      .filter(([_, data]) => data.text);
    
    if (availablePages.length === 0) {
      toast.error('پہلے OCR چلائیں تاکہ تلاش ہو سکے');
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const normalizedQuery = normalizeForSearch(searchQuery);

    for (const [pageNum, data] of availablePages) {
      const normalizedText = data.normalizedText || normalizeForSearch(data.text);
      
      let position = normalizedText.indexOf(normalizedQuery);
      let matchIndex = 0;
      
      while (position !== -1) {
        const start = Math.max(0, position - 40);
        const end = Math.min(data.text.length, position + normalizedQuery.length + 40);
        const contextText = data.text.substring(start, end);
        
        results.push({ pageIndex: pageNum, matchIndex, text: contextText });
        matchIndex++;
        position = normalizedText.indexOf(normalizedQuery, position + 1);
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

  const handleCopyPageText = async () => {
    let pageText = getPageText(currentPage);
    
    if (!pageText && isScannedPDF) {
      toast.info('OCR چل رہا ہے...');
      setOcrInProgress(true);
      const result = await runOCROnPage(currentPage);
      setOcrInProgress(false);
      pageText = result?.text || '';
    }
    
    if (pageText) {
      try {
        await navigator.clipboard.writeText(pageText);
        setCopied(true);
        toast.success('متن کاپی ہو گیا!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('کاپی ناکام');
      }
    } else {
      toast.error('اس صفحے پر کوئی متن نہیں');
    }
  };

  // Calculate responsive page width
  const getPageWidth = () => {
    if (!fitToWidth) return undefined;
    const sidebarWidth = showThumbnails ? 112 : 0;
    const padding = 16;
    const availableWidth = containerWidth - sidebarWidth - padding;
    return Math.max(280, Math.min(availableWidth, 1200));
  };

  const pageWidth = getPageWidth();
  const hasOcrForCurrentPage = !!pageTexts.get(currentPage)?.text;
  const ocrPagesCount = Array.from(pageTexts.values()).filter(p => p.text).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-gradient-to-r from-teal-900 to-teal-800 text-white shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-9 w-9 shrink-0">
            <X className="h-5 w-5" />
          </Button>
          <BookOpen className="h-4 w-4 shrink-0 hidden xs:block" />
          <h2 className="text-sm sm:text-base font-semibold truncate">{title}</h2>
        </div>
        
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* OCR All Button */}
          {isScannedPDF && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runOCROnAllPages}
              disabled={ocrAllInProgress}
              className="text-white hover:bg-white/20 h-9 px-2 text-xs gap-1"
            >
              {ocrAllInProgress ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">{ocrAllProgress}%</span>
                </>
              ) : (
                <>
                  <ScanText className="h-4 w-4" />
                  <span className="hidden sm:inline">OCR All</span>
                  {ocrPagesCount > 0 && (
                    <span className="text-xs bg-white/20 px-1 rounded">{ocrPagesCount}/{numPages}</span>
                  )}
                </>
              )}
            </Button>
          )}
          
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyPageText}
            disabled={ocrInProgress}
            className="text-white hover:bg-white/20 h-9 w-9"
          >
            {ocrInProgress ? <Loader2 className="h-4 w-4 animate-spin" /> : copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className={`text-white hover:bg-white/20 h-9 w-9 ${showSearch ? 'bg-white/20' : ''}`}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Thumbnails */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`text-white hover:bg-white/20 h-9 w-9 hidden sm:flex ${showThumbnails ? 'bg-white/20' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20 h-9 w-9">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-teal-800/90 px-2 sm:px-4 py-2 flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="تلاش کریں..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 h-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
              dir="auto"
            />
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-white/20 hover:bg-white/30 h-10 px-3"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-white text-xs">{currentSearchIndex + 1}/{searchResults.length}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={goToPrevSearchResult} className="text-white hover:bg-white/20 h-8 w-8 p-0">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={goToNextSearchResult} className="text-white hover:bg-white/20 h-8 w-8 p-0">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {isScannedPDF && ocrPagesCount === 0 && (
            <div className="flex items-center gap-2 text-orange-300 text-xs">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>پہلے OCR چلائیں تاکہ تلاش ہو سکے</span>
            </div>
          )}
          
          {ocrAllInProgress && (
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Loader2 className="h-3 w-3 animate-spin shrink-0" />
              <span>OCR {ocrAllProgress}%</span>
              <div className="flex-1 bg-white/20 rounded-full h-1.5">
                <div className="bg-teal-400 h-1.5 rounded-full transition-all" style={{ width: `${ocrAllProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {showThumbnails && (
          <div className="w-28 bg-gray-900 border-r border-gray-700 shrink-0">
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
                        <Page pageNumber={pageNum} width={80} renderTextLayer={false} renderAnnotationLayer={false} />
                      </Document>
                    </div>
                    <div className="bg-gray-800 text-center py-1 flex items-center justify-center gap-1">
                      <span className="text-xs text-gray-300">{pageNum}</span>
                      {pageTexts.get(pageNum)?.text && <Check className="h-3 w-3 text-green-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div ref={containerRef} className="flex-1 overflow-auto bg-gray-800 flex justify-center items-start p-2 sm:p-4">
          {loadError ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md">
              <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
              <p className="text-gray-200 font-medium mb-1">PDF لوڈ نہیں ہو رہی</p>
              <p className="text-gray-400 text-sm mb-4 break-words">{loadError}</p>
              <Button onClick={handleRetryLoad} className="bg-teal-600 hover:bg-teal-700">
                دوبارہ کوشش کریں
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-teal-500 animate-spin mb-4" />
              <p className="text-gray-400">کتاب لوڈ ہو رہی ہے...</p>
            </div>
          ) : (
            <Document
              key={documentKey}
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={handleDocumentError}
              onSourceError={handleDocumentError}
              loading={null}
              className="flex flex-col items-center select-text"
            >
              <Page 
                pageNumber={currentPage}
                width={pageWidth}
                scale={fitToWidth ? undefined : scale}
                className="shadow-2xl max-w-full"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                canvasBackground="white"
              />
            </Document>
          )}
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

          {/* OCR current page */}
          {isScannedPDF && (
            <Button
              variant="ghost"
              size="sm"
              onClick={runOCROnCurrentPage}
              disabled={ocrInProgress || ocrAllInProgress}
              className={`text-white hover:bg-white/10 h-8 px-2 text-xs ml-2 ${hasOcrForCurrentPage ? 'text-green-400' : ''}`}
            >
              {ocrInProgress ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : hasOcrForCurrentPage ? (
                <Check className="h-4 w-4" />
              ) : (
                <>
                  <ScanText className="h-4 w-4 mr-1" />
                  <span className="hidden xs:inline">OCR</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
