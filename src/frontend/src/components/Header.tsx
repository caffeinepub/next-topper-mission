import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  isAdmin: boolean;
  onAdminLogin: (password: string) => boolean;
  onAdminLogout: () => void;
  onAdminDashboard: () => void;
  onHome: () => void;
}

export function Header({
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  onAdminDashboard,
  onHome,
}: HeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const success = onAdminLogin(password);
      if (success) {
        setDialogOpen(false);
        setPassword("");
        toast.success("Admin access granted");
      } else {
        setError("Incorrect password. Please try again.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-deep/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onHome}
          data-ocid="header.link"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center shadow-gold">
            <GraduationCap className="w-5 h-5 text-foreground" />
          </div>
          <div className="text-left">
            <span className="block text-white font-display font-bold text-base leading-tight">
              Next Topper
            </span>
            <span className="block text-gold text-xs font-semibold tracking-wider leading-tight">
              MISSION
            </span>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAdminDashboard}
                data-ocid="admin.dashboard_button"
                className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAdminLogout}
                data-ocid="admin.logout_button"
                className="text-white/60 hover:text-white hover:bg-white/10 gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              data-ocid="header.admin_link"
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors px-2 py-1 rounded"
            >
              <Lock className="w-3 h-3" />
              Admin
            </button>
          )}
        </nav>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <Lock className="w-4 h-4 text-foreground" />
              </div>
              Admin Login
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                data-ocid="admin.login_input"
                autoFocus
              />
              {error && (
                <p
                  className="text-destructive text-sm flex items-center gap-1"
                  data-ocid="admin.login.error_state"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setPassword("");
                  setError("");
                }}
                data-ocid="admin.login.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !password}
                data-ocid="admin.login_button"
                className="gradient-gold text-foreground font-semibold border-0"
              >
                {loading ? "Verifying..." : "Login"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
