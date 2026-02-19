"use client";

import { useEffect, useState, use } from "react";
import { API_URL } from "@/lib/api";
import { Download, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SharedFile {
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  presignedUrl: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SharedFilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [file, setFile] = useState<SharedFile | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`${API_URL}/s/${token}`);
        if (!res.ok) {
          throw new Error("Link not found or deactivated");
        }
        const data = await res.json();
        setFile(data);
      } catch (e: any) {
        setError(e.message || "Loading error");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Error</h2>
          <p className="text-muted-foreground">{error || "File not found"}</p>
        </div>
      </div>
    );
  }

  const isPreviewable =
    file.mimeType.startsWith("image/") || file.mimeType === "application/pdf";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <FileText className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-semibold">{file.name}</h1>
          <p className="text-sm text-muted-foreground">
            {formatSize(file.size)} · {file.mimeType}
          </p>
        </div>

        {isPreviewable && (
          <div className="rounded-lg border overflow-hidden">
            {file.mimeType.startsWith("image/") ? (
              <img
                src={file.presignedUrl}
                alt={file.name}
                className="w-full object-contain max-h-[400px]"
              />
            ) : (
              <iframe
                src={file.presignedUrl}
                className="w-full h-[500px]"
                title={file.name}
              />
            )}
          </div>
        )}

        <div className="flex justify-center">
          <Button asChild size="lg">
            <a href={file.presignedUrl} download={file.originalName}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
