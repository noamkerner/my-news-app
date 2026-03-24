import { useState } from "react";
import { Settings, Copy, Check, X } from "lucide-react";

const DevSettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/articles`;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlExample = `curl -X POST '${apiUrl}' \\
  -H "apikey: ${anonKey}" \\
  -H "Authorization: Bearer ${anonKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "כותרת הכתבה",
    "summary": "תקציר הכתבה",
    "category": "AI Developments",
    "relevance_score": 8,
    "original_url": "https://example.com",
    "impact_on_israel": "השפעה על ישראל"
  }'`;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-2.5 rounded-full bg-muted hover:bg-accent transition-colors shadow-lg"
        title="הגדרות מפתח"
      >
        <Settings className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="bg-card border border-border rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">🔧 Dev Settings — Make.com Integration</h3>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Endpoint (POST)</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-xs break-all font-mono">{apiUrl}</code>
              <button onClick={() => copyToClipboard(apiUrl, "url")} className="shrink-0 p-1.5 rounded hover:bg-muted">
                {copied === "url" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Auth Token (apikey header)</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-xs break-all font-mono max-h-16 overflow-y-auto">{anonKey}</code>
              <button onClick={() => copyToClipboard(anonKey, "key")} className="shrink-0 p-1.5 rounded hover:bg-muted">
                {copied === "key" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Required Headers</label>
            <div className="bg-muted px-3 py-2 rounded text-xs font-mono mt-1 space-y-1">
              <p>apikey: <span className="text-muted-foreground">&lt;token above&gt;</span></p>
              <p>Authorization: Bearer <span className="text-muted-foreground">&lt;token above&gt;</span></p>
              <p>Content-Type: application/json</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories (use exact values)</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["World Economics", "AI Developments", "Engineering Innovations", "Global Politics & Israel"].map((c) => (
                <span key={c} className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">cURL Example</label>
              <button onClick={() => copyToClipboard(curlExample, "curl")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                {copied === "curl" ? <><Check className="w-3 h-3" /> הועתק</> : <><Copy className="w-3 h-3" /> העתק</>}
              </button>
            </div>
            <pre className="bg-muted px-3 py-2 rounded text-[11px] font-mono mt-1 overflow-x-auto whitespace-pre-wrap">{curlExample}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevSettingsPanel;
