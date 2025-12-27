import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep it minimal; logs help diagnose native crashes
    console.error("[app] crashed:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">App Error</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kuch issue aa gaya. Please reload karein.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button
              variant="default"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Home
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
