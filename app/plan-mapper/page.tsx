"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, AlertTriangle } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import { PRODUCTS, type ProductCode } from "../../lib/planMapperCatalog";

interface Placement {
  product: ProductCode;
  room: string;
  x_pct: number;
  y_pct: number;
  reasoning: string;
}

interface AnalyzeResult {
  planType: string;
  roomsIdentified: string[];
  placements: Placement[];
}

export default function PlanMapperPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function handleFileChange(f: File | null) {
    setResult(null);
    setError(null);
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("plan", file);
      const res = await fetch("/api/plan-mapper", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data as AnalyzeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const usedProducts = result
    ? (Array.from(new Set(result.placements.map((p) => p.product))) as ProductCode[])
    : [];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Plan Mapper</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Upload a floor plan or electrical plan and see where Xerovolt touch
              panels, sensors, and controllers would go -- an AI-generated
              starting point for your installer, not a substitute for a site
              survey.
            </p>
          </div>

          {/* UPLOAD CARD */}
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 sm:p-10 mb-10">
            <div
              className="border border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-[#155cfc] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              <UploadCloud className="w-10 h-10 mx-auto mb-3 text-[#155cfc]" />
              <p className="text-gray-300">
                {file ? file.name : "Click to choose a floor plan or electrical plan image"}
              </p>
              <p className="text-gray-500 text-xs mt-1">PNG or JPG, up to 15MB</p>
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={handleAnalyze} disabled={!file || loading} className="px-10 py-3 text-lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Plan"
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-3 bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* RESULTS */}
          {previewUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#121212] border border-white/10 rounded-3xl p-4 sm:p-6">
                <div className="relative inline-block w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded plan image, not a static asset */}
                  <img src={previewUrl} alt="Uploaded plan" className="w-full h-auto rounded-xl block" />
                  {result?.placements.map((p, i) => {
                    const meta = PRODUCTS[p.product];
                    if (!meta) return null;
                    const active = activeIndex === i;
                    return (
                      <div
                        key={i}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ left: `${p.x_pct}%`, top: `${p.y_pct}%` }}
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                      >
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-lg cursor-pointer"
                          style={{ backgroundColor: meta.color }}
                        />
                        {active && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-black border border-white/20 text-white text-xs rounded-lg px-2 py-1 shadow-xl">
                            <span className="font-semibold">{meta.short}</span> -- {p.room}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {result && (
                  <p className="text-gray-500 text-xs mt-4">
                    Hover a marker for details. Plan type detected: {result.planType.replace("_", " ")}.
                  </p>
                )}
              </div>

              <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-6 h-fit">
                {!result && !loading && (
                  <p className="text-gray-500 text-sm">Analyze the plan to see recommended product placements here.</p>
                )}

                {result && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Legend</h2>
                      <div className="space-y-2">
                        {usedProducts.map((code) => {
                          const meta = PRODUCTS[code];
                          return (
                            <div key={code} className="flex items-center gap-2 text-sm">
                              <span className="w-3 h-3 rounded-full border border-white/40 shrink-0" style={{ backgroundColor: meta.color }} />
                              <span className="text-gray-300">
                                <span className="font-semibold">{meta.short}</span> = {meta.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-3">
                        Placements ({result.placements.length})
                      </h2>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {result.placements.map((p, i) => {
                          const meta = PRODUCTS[p.product];
                          return (
                            <div
                              key={i}
                              className={`text-sm border rounded-xl p-3 cursor-pointer transition-colors ${
                                activeIndex === i ? "border-[#155cfc] bg-[#155cfc]/10" : "border-white/10"
                              }`}
                              onMouseEnter={() => setActiveIndex(i)}
                              onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                            >
                              <p className="font-medium text-white">
                                {meta?.label ?? p.product} -- {p.room}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">{p.reasoning}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <p className="text-gray-600 text-xs text-center mt-12 max-w-2xl mx-auto">
            Placements are AI-generated estimates from the uploaded image (&ldquo;right room,
            roughly right spot&rdquo;) -- always confirm exact positions and product SKUs with
            a Xerovolt installer before purchase or installation.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
