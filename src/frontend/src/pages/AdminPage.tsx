import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  FileText,
  HardDrive,
  Inbox,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { CourseMaterial } from "../backend.d";
import { useActor } from "../hooks/useActor";

const BATCHES = [
  "9th",
  "10th",
  "11th JEE",
  "11th NEET",
  "11th School PCM",
  "11th School PCB",
];

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

export function AdminPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { actor, isFetching } = useActor();

  const [title, setTitle] = useState("");
  const [batch, setBatch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeBatchFilter, setActiveBatchFilter] = useState<string>("all");

  const { data: allMaterials = [], isLoading: isLoadingAll } = useQuery<
    CourseMaterial[]
  >({
    queryKey: ["admin-all-materials"],
    queryFn: async () => {
      if (!actor) return [];
      const results = await Promise.all(
        BATCHES.map((b) => actor.getCourseMaterialsByBatch(b)),
      );
      return results.flat();
    },
    enabled: !!actor && !isFetching,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-all-materials"] });
    for (const b of BATCHES) {
      queryClient.invalidateQueries({ queryKey: ["materials", b] });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCourseMaterial(id);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success("Material deleted successfully");
    },
    onError: () => toast.error("Failed to delete material"),
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim() || !batch || !actor) {
      toast.error("Please fill in all fields and select a file");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      await actor.uploadFileToCourseMaterial(
        title.trim(),
        batch,
        "",
        BigInt(selectedFile.size),
        "admin",
        selectedFile.name,
        blob,
      );
      toast.success(`"${title}" uploaded successfully!`);
      setTitle("");
      setBatch("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadProgress(0);
      invalidateAll();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredMaterials =
    activeBatchFilter === "all"
      ? allMaterials
      : allMaterials.filter((m) => m.batch === activeBatchFilter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="font-display font-black text-3xl text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload and manage study materials
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Plus className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="font-display font-bold text-xl text-card-foreground">
              Upload Study Material
            </h2>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="upload-title">Title</Label>
                <Input
                  id="upload-title"
                  placeholder="e.g. Physics Chapter 3 - Kinematics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-ocid="admin.upload_title_input"
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Batch</Label>
                <Select
                  value={batch}
                  onValueChange={setBatch}
                  disabled={isUploading}
                >
                  <SelectTrigger data-ocid="admin.upload_batch_select">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BATCHES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>File (up to 10 GB)</Label>
              <button
                type="button"
                className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                data-ocid="admin.upload_button"
                disabled={isUploading}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-5 h-5 text-gold" />
                    <div className="text-left">
                      <p className="font-medium text-sm text-card-foreground truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(BigInt(selectedFile.size))}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-card-foreground">
                      Click to select file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Any format supported, up to 10 GB
                    </p>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                disabled={isUploading}
              />
            </div>

            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  data-ocid="admin.upload.loading_state"
                  className="space-y-1.5"
                >
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isUploading || !selectedFile || !title.trim() || !batch}
              data-ocid="admin.upload_submit_button"
              className="gradient-gold text-foreground font-bold border-0 hover:opacity-90 w-full sm:w-auto gap-2"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-bounce" /> Uploading{" "}
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload Material
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Materials List */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-border flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-bold text-xl text-card-foreground">
                All Materials
              </h2>
            </div>
            <Select
              value={activeBatchFilter}
              onValueChange={setActiveBatchFilter}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {BATCHES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(isLoadingAll || isFetching) && (
            <div
              className="space-y-3"
              data-ocid="admin.materials.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border border-border rounded-xl"
                >
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          )}

          {!isLoadingAll && !isFetching && filteredMaterials.length === 0 && (
            <div
              className="text-center py-12"
              data-ocid="admin.materials.empty_state"
            >
              <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No materials found. Upload your first material above.
              </p>
            </div>
          )}

          {!isLoadingAll && !isFetching && filteredMaterials.length > 0 && (
            <div className="space-y-2">
              {filteredMaterials.map((material, index) => (
                <div
                  key={material.id}
                  data-ocid={`admin.materials.item.${index + 1}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border border-border rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-card-foreground truncate">
                      {material.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <HardDrive className="w-3 h-3" />{" "}
                        {formatFileSize(material.fileSize)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />{" "}
                        {formatDate(material.uploadDate)}
                      </span>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        {material.batch}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-ocid={`admin.delete_button.${index + 1}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 flex-shrink-0"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="admin.delete.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          Delete Material
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <strong>&ldquo;{material.title}&rdquo;</strong>? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.delete.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(material.id)}
                          data-ocid="admin.delete.confirm_button"
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
