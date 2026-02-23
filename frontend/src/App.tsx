import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Wizard } from "./pages/Wizard";
import { Templates } from "./pages/Templates";
import { CustomTemplates } from "./pages/CustomTemplates";
import { ClauseLibrary } from "./pages/ClauseLibrary";
import { DocumentDetails } from "./pages/DocumentDetails";
import { Dashboard } from "./pages/Dashboard";
import { Board } from "./pages/Board";
import { Personas } from "./pages/Personas";
import { Imoveis } from "./pages/Imoveis";
import { Financeiro } from "./pages/Financeiro";
import { Profile } from "./pages/Profile";
import { EliaBeta } from "./pages/EliaBeta";
import { Login } from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/AppLayout";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-slate-400" />
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
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/meus-modelos" element={<ProtectedRoute><CustomTemplates /></ProtectedRoute>} />
      <Route path="/clausulas" element={<ProtectedRoute><ClauseLibrary /></ProtectedRoute>} />
      <Route path="/pessoas" element={<ProtectedRoute><Personas /></ProtectedRoute>} />
      <Route path="/imoveis" element={<ProtectedRoute><Imoveis /></ProtectedRoute>} />
      <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/elia-beta" element={<ProtectedRoute><EliaBeta /></ProtectedRoute>} />
      <Route path="/wizard/:schemaId" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
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
