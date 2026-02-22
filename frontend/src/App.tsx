import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Wizard } from "./pages/Wizard";
import { Templates } from "./pages/Templates";
import { DocumentDetails } from "./pages/DocumentDetails";
import { Dashboard } from "./pages/Dashboard";
import { Board } from "./pages/Board";
import { Personas } from "./pages/Personas";
import { Login } from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/AppLayout";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

// Route guard: redirects to /login if not authenticated
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      {/* Protected routes (with sidebar) */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/pessoas" element={<ProtectedRoute><Personas /></ProtectedRoute>} />
      <Route path="/wizard/:templateId" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
      <Route path="/wizard" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
      <Route path="/document/:id" element={<ProtectedRoute><DocumentDetails /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
