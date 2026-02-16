"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Cloud } from "lucide-react";
import { getStorageUsage } from "@/lib/file.api";
import { formatFileSize } from "@/utils/formatFileSize";

interface StorageUsage {
  used: number;
  limit: number;
  percentage: number;
}

export const StorageLabel = () => {
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const data = await getStorageUsage();
        setStorage(data);
      } catch (error) {
        console.error("Failed to fetch storage usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorage();
  }, []);

  if (loading || !storage) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full text-black">
      <div className="flex items-center gap-2">
        <Cloud className="w-4 h-4" />
        <span className="text-sm">Сховище</span>
      </div>

      <div className="mt-1 space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs">
              {formatFileSize(storage.used)} з {formatFileSize(storage.limit)}
            </p>
          </div>

          <span className="text-xs">{storage.percentage}%</span>
        </div>

        <Progress
          value={storage.percentage}
          className="h-2 rounded-full bg-gray-200"
        />
      </div>
    </div>
  );
};
