import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDebugState } from "@/contexts/DebugContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const mask = (v: string | null) => {
  if (!v) return "—";
  if (v.length <= 10) return v;
  return `${v.slice(0, 6)}…${v.slice(-4)}`;
};

const formatTs = (ts: number) => new Date(ts).toLocaleString();

const Debug = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const dbg = useDebugState();

  const copyReport = async () => {
    const report = {
      env: { isNative: dbg.isNative, platform: dbg.platform },
      auth: {
        loading,
        userId: user?.id ?? null,
        email: user?.email ?? null,
        role: role ?? null,
      },
      splash: {
        showing: dbg.splashShowing,
        finished: dbg.splashFinished,
        seen: dbg.splashSeen,
      },
      push: {
        permission: dbg.pushPermission,
        registered: dbg.pushRegistered,
        token: dbg.pushToken ? mask(dbg.pushToken) : null,
        lastError: dbg.pushLastError,
      },
      nav: {
        last: dbg.lastNavigation,
        recent: dbg.navigationHistory,
      },
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      toast.success("Debug report copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const resetSplash = () => {
    try {
      sessionStorage.removeItem("splash_seen");
      dbg.refreshSplashSeen();
      toast.success("Splash reset (this session)");
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>Debug | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="/debug" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <section className="mx-auto w-full max-w-3xl px-4 py-6">
          <header className="mb-4">
            <h1 className="text-xl font-semibold text-foreground">In‑App Debug</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              APK issues diagnose karne ke liye yahan current state dikhaya jata hai.
            </p>
          </header>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" variant="default" onClick={copyReport}>
              Copy report
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/back-debug")}>
              Back button test
            </Button>
            <Button size="sm" variant="outline" onClick={resetSplash}>
              Reset splash
            </Button>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platform</span>
                  <Badge variant="secondary">{dbg.platform}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Native</span>
                  <Badge variant={dbg.isNative ? "default" : "outline"}>
                    {dbg.isNative ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Loading</span>
                  <Badge variant={loading ? "secondary" : "outline"}>{loading ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">User</span>
                  <span className="text-sm text-foreground">{user?.email ?? "(guest)"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="secondary">{role ?? "—"}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Splash</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Showing</span>
                  <Badge variant={dbg.splashShowing ? "secondary" : "outline"}>
                    {dbg.splashShowing ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Finished</span>
                  <Badge variant={dbg.splashFinished ? "default" : "secondary"}>
                    {dbg.splashFinished ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Seen (session)</span>
                  <Badge variant={dbg.splashSeen ? "outline" : "secondary"}>
                    {dbg.splashSeen ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Push Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Permission</span>
                  <Badge variant="secondary">{dbg.pushPermission}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Registered</span>
                  <Badge variant={dbg.pushRegistered ? "default" : "outline"}>
                    {dbg.pushRegistered ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Token</span>
                  <span className="text-sm text-foreground font-mono">{mask(dbg.pushToken)}</span>
                </div>
                <div>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">Last error</div>
                  <div className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">
                    {dbg.pushLastError ?? "—"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground">Last</div>
                  <div className="mt-1 font-mono text-foreground">
                    {dbg.lastNavigation
                      ? `${dbg.lastNavigation.pathname}${dbg.lastNavigation.search}${dbg.lastNavigation.hash}`
                      : "—"}
                  </div>
                  {dbg.lastNavigation && (
                    <div className="text-xs text-muted-foreground mt-1">{formatTs(dbg.lastNavigation.ts)}</div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="text-xs text-muted-foreground mb-2">Recent</div>
                  <div className="space-y-1">
                    {dbg.navigationHistory.slice(0, 8).map((n) => (
                      <div key={n.ts} className="text-xs font-mono text-foreground/90">
                        {formatTs(n.ts)} — {n.pathname}
                        {n.search}
                        {n.hash}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
};

export default Debug;
