"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Upload, X, RefreshCw } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

type Stage = "upload" | "processing" | "result";

export function VtoDialog({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  const [stage, setStage] = useState<Stage>("upload");
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [view, setView] = useState<"before" | "after">("after");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setStage("upload");
      setInputPreview(null);
      setResultUrl(null);
      setView("after");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setInputPreview(String(e.target?.result));
    reader.readAsDataURL(file);

    setStage("processing");
    try {
      const res = await fetch("/api/vto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productSku: product.sku,
          productImage: product.primaryImage,
        }),
      });
      const data = (await res.json()) as { resultUrl?: string };
      setResultUrl(data.resultUrl ?? product.primaryImage);
    } catch {
      setResultUrl(product.primaryImage);
    } finally {
      setStage("result");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[color:var(--color-paper)] w-full max-w-3xl max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 hover:bg-[color:var(--color-cream)] rounded-full z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pt-10 pb-4 border-b border-[color:var(--color-line)]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4" />
            <p className="nav-link">Virtual Try-On</p>
          </div>
          <h2 className="heading-display text-xl">{product.name}</h2>
        </div>

        <div className="px-8 py-6 min-h-[380px]">
          {stage === "upload" && <UploadStep onFile={handleFile} inputRef={inputRef} />}
          {stage === "processing" && <ProcessingStep preview={inputPreview} />}
          {stage === "result" && resultUrl && inputPreview && (
            <ResultStep
              productName={product.name}
              before={inputPreview}
              after={resultUrl}
              view={view}
              setView={setView}
              onRetry={() => setStage("upload")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function UploadStep({
  onFile,
  inputRef,
}: {
  onFile: (f: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed cursor-pointer transition-colors py-16 px-6 text-center",
          dragOver
            ? "border-[color:var(--color-ink)] bg-[color:var(--color-cream)]"
            : "border-[color:var(--color-line)] hover:border-[color:var(--color-ink-muted)]",
        )}
      >
        <Upload className="mx-auto h-8 w-8 mb-3 text-[color:var(--color-ink-muted)]" strokeWidth={1.25} />
        <p className="nav-link mb-1">Drop a photo or click to upload</p>
        <p className="text-xs text-[color:var(--color-ink-muted)]">
          JPG or PNG, up to 5 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </div>

      <div className="text-xs text-[color:var(--color-ink-muted)] space-y-1">
        <p>For best results:</p>
        <ul className="list-disc pl-5 space-y-0.5">
          <li>Full body, front-facing</li>
          <li>Plain background, good lighting</li>
          <li>Fitted clothing makes the AI work better</li>
        </ul>
        <p className="pt-2 italic">
          Mock preview — production VTO will use a hosted model (e.g. fal.ai CatVTON / IDM-VTON).
        </p>
      </div>
    </div>
  );
}

function ProcessingStep({ preview }: { preview: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      {preview && (
        <div className="relative w-40 h-52 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Your photo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--color-paper)]/40 to-transparent animate-pulse" />
        </div>
      )}
      <div className="text-center">
        <p className="nav-link">Generating your try-on…</p>
        <p className="text-xs text-[color:var(--color-ink-muted)] mt-1">
          This usually takes a few seconds.
        </p>
      </div>
    </div>
  );
}

function ResultStep({
  productName,
  before,
  after,
  view,
  setView,
  onRetry,
}: {
  productName: string;
  before: string;
  after: string;
  view: "before" | "after";
  setView: (v: "before" | "after") => void;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-2 nav-link">
        <button
          type="button"
          onClick={() => setView("before")}
          className={cn(
            "px-4 py-2 border",
            view === "before"
              ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
              : "border-[color:var(--color-line)]",
          )}
        >
          Before
        </button>
        <button
          type="button"
          onClick={() => setView("after")}
          className={cn(
            "px-4 py-2 border",
            view === "after"
              ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-paper)]"
              : "border-[color:var(--color-line)]",
          )}
        >
          After
        </button>
      </div>

      <div className="relative aspect-[3/4] max-w-md mx-auto bg-[color:var(--color-cream)] overflow-hidden">
        {view === "before" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={before}
            alt="Your photo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <Image
              src={after}
              alt={`${productName} preview`}
              fill
              sizes="500px"
              className="object-cover"
            />
            <div className="absolute top-3 left-3 nav-link bg-[color:var(--color-paper)] text-[color:var(--color-ink)] px-2 py-1">
              MOCK PREVIEW
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="btn-ghost flex-1 inline-flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try another photo
        </button>
        <button type="button" className="btn-primary flex-1">
          Add to bag
        </button>
      </div>
    </div>
  );
}
