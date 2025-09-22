import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { User, LogOut, Menu, X } from "lucide-react";
import { Orbitron } from "next/font/google";

// Load Orbitron font
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Modern AI + Finance SVG Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" className="opacity-20" />
            <path
              d="M12 6v12M9 9h6M9 15h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="6" cy="12" r="1.5" fill="currentColor" />
            <circle cx="18" cy="12" r="1.5" fill="currentColor" />
          </svg>

          {/* Logo Text */}
          <span
            className={`${orbitron.className} text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text tracking-wide`}
          >
            AI Expense Tracker
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Settings
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <User size={18} /> {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2 rounded-lg border border-gray-300 dark:border-gray-600"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Menu Modal */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col space-y-6 relative transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            <X size={26} />
          </button>

          {/* Mobile Logo at Top */}
          <div className="flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="10" className="opacity-20" />
              <path
                d="M12 6v12M9 9h6M9 15h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="6" cy="12" r="1.5" fill="currentColor" />
              <circle cx="18" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span
              className={`${orbitron.className} text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text`}
            >
              AI Expense Tracker
            </span>
          </div>

          {/* Nav Items */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsMenuOpen(false)}
            className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Settings
          </Link>

          {user ? (
            <>
              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <User size={18} /> {user.name}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
