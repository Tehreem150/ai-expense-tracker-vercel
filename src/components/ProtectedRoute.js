import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Prevent hydration mismatch: render nothing until mounted
  if (!isMounted) return null;

  return isAuthenticated ? children : null;
}
