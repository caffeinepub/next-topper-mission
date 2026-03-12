import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  HardDrive,
  Inbox,
} from "lucide-react";
import { motion } from "motion/react";
import type { CourseMaterial } from "../backend.d";
import { useActor } from "../hooks/useActor";

function formatFileSize(bytes: bigint): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface MaterialsPageProps {
  batch: string;
  onBack: () => void;
}

export function MaterialsPage({ batch, onBack }: MaterialsPageProps) {
  const { actor, isFetching } = useActor();

  const {
    data: materials = [],
    isLoading,
    isError,
  } = useQuery<CourseMaterial[]>({
    queryKey: ["materials", batch],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCourseMaterialsByBatch(batch);
    },
    enabled: !!actor && !isFetching,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            data-ocid="materials.back_button"
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
              {batch}
            </h1>
            <p className="text-muted-foreground text-sm">Study Materials</p>
          </div>
        </div>

        {(isLoading || isFetching) && (
          <div className="space-y-3" data-ocid="materials.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16" data-ocid="materials.error_state">
            <p className="text-destructive font-medium">
              Failed to load materials. Please try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={onBack}>
              Go Back
            </Button>
          </div>
        )}

        {!isLoading && !isFetching && !isError && materials.length === 0 && (
          <div className="text-center py-20" data-ocid="materials.empty_state">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              No materials yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Study materials for {batch} will be available soon. Check back
              later!
            </p>
          </div>
        )}

        {!isLoading && !isFetching && !isError && materials.length > 0 && (
          <div className="space-y-3" data-ocid="materials.list">
            {materials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                data-ocid={`materials.item.${index + 1}`}
                className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-accent/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-card-foreground truncate">
                    {material.title}
                  </h3>
                  <p className="text-muted-foreground text-xs truncate">
                    {material.originalFileName}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <HardDrive className="w-3 h-3" />
                      {formatFileSize(material.fileSize)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(material.uploadDate)}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => window.open(material.fileUrl, "_blank")}
                  data-ocid={`materials.download_button.${index + 1}`}
                  className="gradient-gold text-foreground font-semibold border-0 hover:opacity-90 gap-1.5 flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
