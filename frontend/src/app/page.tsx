import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";

export default function Home() {
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Busting your image… Hang tight.");
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      if (!res.ok) throw new Error("Scan failed");
      const data = await res.json();
      setResult(data);
      setStatus("Report’s ready! Here’s the lowdown:");
    } catch (err) {
      setError("Oops! Something went sideways. Try again or check your image name.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800">
      <div className="w-full max-w-md p-8 bg-white/80 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          {/* Logo */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
            <rect width="48" height="48" rx="12" fill="#0ea5e9" />
            <path d="M14 32h20M16 28h16M18 24h12M20 20h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">Docker Buster</h1>
          <p className="text-neutral-600 text-sm mt-1">Crack open any container. Get the facts. Stay secure.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="image" className="text-neutral-700 font-medium">What image are we busting today?</label>
          <Input
            id="image"
            placeholder="e.g. alpine:latest"
            value={image}
            autoFocus
            onChange={e => setImage(e.target.value)}
            disabled={loading}
            className="text-lg"
            required
          />
          <Button type="submit" disabled={loading || !image} className="mt-2 text-lg font-bold flex items-center gap-2">
            {loading ? (
              <span className="animate-spin">🔎</span>
            ) : (
              <span>🚀 Bust It</span>
            )}
          </Button>
        </form>
        {status && <div className="mt-6 text-center text-neutral-800 font-semibold animate-fade-in">{status}</div>}
        {error && <Toast variant="destructive" className="mt-4">{error}</Toast>}
        {result && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 justify-center">
              <Badge color={result.risk_score < 5 ? "success" : result.risk_score < 10 ? "warning" : "destructive"}>
                Risk Score: {result.risk_score} — {result.risk_score < 5 ? "Chill" : result.risk_score < 10 ? "Heads Up" : "Red Alert"}
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-700 transition"
                download
              >PDF Report</a>
              <a
                href="#"
                className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-900 font-semibold shadow hover:bg-neutral-300 transition"
                download
              >JSON Details</a>
            </div>
            <details className="mt-2 text-xs text-neutral-600">
              <summary className="cursor-pointer font-medium">For the nerds: Manifest & Signature</summary>
              <div className="break-all mt-1">
                <div><b>Manifest SHA-256:</b> {result.manifest_sha256}</div>
                <div><b>Signature:</b> {result.signature}</div>
              </div>
            </details>
          </div>
        )}
        <footer className="mt-10 text-xs text-neutral-500 text-center">
          Made with <span className="text-pink-500">❤️</span> by Docker Buster. Open source. Stay safe.
        </footer>
      </div>
    </main>
  );
}
