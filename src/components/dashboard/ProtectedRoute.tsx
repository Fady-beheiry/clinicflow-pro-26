import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!role) {
    return (
      <div className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <h1 className="text-2xl font-bold">No access</h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            Your account doesn't have a clinic role yet. Ask the clinic admin to grant you access.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}