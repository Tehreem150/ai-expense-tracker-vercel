import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Home,
  BarChart,
  Settings,
  PlusCircle,
  List,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Ensure client-only rendering
  useEffect(() => {
    setHydrated(true);
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart size={20} /> },
    {
      href: "/addexpense",
      label: "Add Expense",
      icon: <PlusCircle size={20} />,
    },
    { href: "/expense-lists", label: "Expense List", icon: <List size={20} /> },
    { href: "/reports", label: "Reports", icon: <FileText size={20} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={20} /> },
    { href: "/index", label: "Home", icon: <Home size={20} /> },
  ];

  // ⛔ Don’t render until hydrated
  if (!hydrated) return null;

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-gradient-to-r from-indigo-500 to-pink-500 text-white min-h-screen p-4 transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-8 p-2 rounded bg-indigo-700 hover:bg-indigo-600 transition"
      >
        {isCollapsed ? "➡️" : "⬅️"}
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">
        {links.map(({ href, label, icon }) => (
          <Link key={href} href={href}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition 
                ${
                  router.pathname === href
                    ? "bg-indigo-600"
                    : "hover:bg-indigo-700"
                }`}
            >
              {icon}
              {!isCollapsed && <span>{label}</span>}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
