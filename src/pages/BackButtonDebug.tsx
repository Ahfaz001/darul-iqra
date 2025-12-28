import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Trash2, Home, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: number;
  time: string;
  event: string;
  data: string;
}

const BackButtonDebug: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const logIdRef = useRef(0);

  const addLog = (event: string, data: any = {}) => {
    const entry: LogEntry = {
      id: logIdRef.current++,
      time: new Date().toLocaleTimeString(),
      event,
      data: typeof data === 'string' ? data : JSON.stringify(data),
    };
    setLogs((prev) => [entry, ...prev].slice(0, 50));
  };

  // Update history index on every render
  useEffect(() => {
    const state = window.history.state as any;
    const idx = typeof state?.idx === 'number' ? state.idx : 0;
    setHistoryIdx(idx);
  }, [location]);

  // Listen to Capacitor backButton events
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      addLog('Platform', 'Web (not native)');
      return;
    }

    addLog('Platform', 'Native (Capacitor)');

    let listener: { remove: () => Promise<void> } | null = null;

    const setup = async () => {
      listener = await App.addListener('backButton', (ev) => {
        addLog('backButton', { canGoBack: ev?.canGoBack });
      });
    };

    setup();

    return () => {
      if (listener) listener.remove();
    };
  }, []);

  const clearLogs = () => setLogs([]);

  const getHistoryIndex = () => {
    const state = window.history.state as any;
    return typeof state?.idx === 'number' ? state.idx : 0;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Helmet>
        <title>Back Button Debug | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="/back-debug" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Back Button Debug</h1>
      </div>

      {/* Current State */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Current State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route:</span>
            <span className="font-mono text-foreground">{location.pathname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">History Index (idx):</span>
            <span className="font-mono text-foreground">{historyIdx}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">history.length:</span>
            <span className="font-mono text-foreground">{window.history.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Native Platform:</span>
            <span className="font-mono text-foreground">{Capacitor.isNativePlatform() ? 'Yes' : 'No'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Test Buttons */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Navigation Tests</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/dashboard')}>
            → Dashboard
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/exams')}>
            → Exams
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/books')}>
            → Books
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-1" /> Home
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>
            ← Back (-1)
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              addLog('Manual refresh idx', getHistoryIndex());
              setHistoryIdx(getHistoryIndex());
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Event Logs */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Event Logs</CardTitle>
          <Button size="sm" variant="ghost" onClick={clearLogs}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No events yet. Press back button on device to see logs.
              </p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="text-xs p-2 rounded bg-muted/50 border border-border/50"
                  >
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span className="font-semibold text-primary">{log.event}</span>
                      <span>{log.time}</span>
                    </div>
                    <pre className="font-mono text-foreground whitespace-pre-wrap break-all">
                      {log.data}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackButtonDebug;
