"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { logoutUser } from "../redux/authSlice";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      router.push("/login");
    });
  };

  // ⛔ Don’t render until hydrated
  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar only if user is logged in */}
      {user && <Sidebar />}

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* ✅ Navbar always visible */}
        <Navbar onLogout={handleLogout} />

        {/* Page Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
