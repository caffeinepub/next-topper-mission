import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { MaterialsPage } from "./pages/MaterialsPage";

const queryClient = new QueryClient();

export type View =
  | { type: "home" }
  | { type: "materials"; batch: string }
  | { type: "admin" };

export default function App() {
  const [view, setView] = useState<View>({ type: "home" });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminLoggedIn");
    if (stored === "true") setIsAdmin(true);
  }, []);

  const handleAdminLogin = (password: string): boolean => {
    if (password === "12345678") {
      sessionStorage.setItem("adminLoggedIn", "true");
      setIsAdmin(true);
      setView({ type: "admin" });
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    setIsAdmin(false);
    setView({ type: "home" });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          isAdmin={isAdmin}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onAdminDashboard={() => setView({ type: "admin" })}
          onHome={() => setView({ type: "home" })}
        />
        <main className="flex-1">
          {view.type === "home" && (
            <HomePage
              onSelectBatch={(batch) => setView({ type: "materials", batch })}
            />
          )}
          {view.type === "materials" && (
            <MaterialsPage
              batch={(view as { type: "materials"; batch: string }).batch}
              onBack={() => setView({ type: "home" })}
            />
          )}
          {view.type === "admin" && isAdmin && <AdminPage />}
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
