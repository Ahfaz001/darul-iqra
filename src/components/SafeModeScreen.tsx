import { Button } from "@/components/ui/button";
import { disableSafeMode, getLastError, clearLastError, CrashInfo } from "@/lib/crashGuard";
import { AlertTriangle, RotateCcw, Bug } from "lucide-react";
import { useState } from "react";

const SafeModeScreen = () => {
  const [lastError] = useState<CrashInfo | null>(() => getLastError());

  const handleReset = () => {
    disableSafeMode();
    clearLastError();
    window.location.href = "/";
  };

  const handleDebug = () => {
    window.location.href = "/debug";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>

        <h1 className="text-xl font-semibold text-foreground">Safe Mode</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          App bar bar crash ho rahi thi, isliye safe mode enable hua hai. Push notifications disabled hain.
        </p>

        {lastError && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-left">
            <p className="text-xs font-medium text-muted-foreground mb-1">Last error:</p>
            <p className="text-xs text-foreground break-words">{lastError.message}</p>
            {lastError.stack && (
              <pre className="mt-2 text-[10px] text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-32">
                {lastError.stack}
              </pre>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <Button variant="default" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset & Continue
          </Button>
          <Button variant="outline" onClick={handleDebug} className="gap-2">
            <Bug className="h-4 w-4" />
            Debug
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Agar masla bar bar aaye to developer ko report karein.
        </p>
      </div>
    </div>
  );
};

export default SafeModeScreen;
