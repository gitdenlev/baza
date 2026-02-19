"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Cloud } from "lucide-react";
import { getStorageUsage } from "@/lib/file.api";
import { formatFileSize } from "@/utils/formatFileSize";

interface StorageUsage {
  usedBytes: number;
  trashBytes: number;
  quotaBytes: number;
  freeBytes: number;
  percentUsed: number;
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
        <span className="text-sm">Storage</span>
      </div>

      <div className="mt-1 space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs">
              {formatFileSize(storage.usedBytes)} used of{" "}
              {formatFileSize(storage.quotaBytes)}
            </p>
          </div>

          <span className="text-xs">{storage.percentUsed}%</span>
        </div>

        <Progress
          value={storage.percentUsed}
          className="h-2 rounded-full bg-gray-200"
        />
      </div>
    </div>
  );
};
