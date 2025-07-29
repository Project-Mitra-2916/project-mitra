import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CheckCircle, AlertTriangle, Menu, X } from "lucide-react";
import { adminEmails, siteConfig } from "../config";

function Navbar() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const dropdownRef = useRef();

  const [typedText, setTypedText] = useState("");
  const greeting = user ? `Namaste, ${user.displayName || "there"} 🙏` : "";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(greeting.slice(0, i + 1));
      i++;
      if (i === greeting.length) clearInterval(interval);
    }, 75);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully ✅", {
        icon: <CheckCircle size={20} color="#10b981" />,
      });
    } catch (error) {
      toast.error("Logout failed ❌", {
        icon: <AlertTriangle size={20} color="#ef4444" />,
      });
    }
  };

  if (loading) return null;

  const renderLinks = () => (
    <>
      {["/", "/projects", "/submit", "/code-generator"].map((path, i) => (
        <Link
          key={i}
          to={path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`block md:inline px-2 py-2 md:py-0 ${pathname === path
            ? "text-blue-700 dark:text-blue-400 font-semibold"
            : "text-gray-700 dark:text-gray-200"
            } hover:text-blue-600 dark:hover:text-blue-400 transition`}
        >
          {path === "/"
            ? "Home"
            : path === "/projects"
              ? "Projects"
              : path === "/submit"
                ? "Submit your project!"
                : "Code Buddy"}
        </Link>
      ))}

      {user && adminEmails.includes(user.email) && (
        <Link
          to="/admin"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`block md:inline px-4 py-2 md:py-0 ${pathname === "/admin"
            ? "text-blue-700 dark:text-blue-400 font-semibold"
            : "text-gray-700 dark:text-gray-200"
            } hover:text-blue-600 dark:hover:text-blue-400 transition`}
        >
          Admin Panel
        </Link>
      )}
    </>
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md border-b border-gray-200 dark:border-gray-700"
        : "bg-white dark:bg-gray-900"
        }`}
    >
      <div className="w-full flex items-center px-4 sm:px-6 md:px-10 py-3">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 dark:text-white tracking-tight whitespace-nowrap"
        >
          {siteConfig.name}
        </Link>

        {/* Center: Greeting (grow, center) */}
        <div className="flex-1 flex justify-center px-2">
          {user && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden lg:block text-gray-600 dark:text-gray-300 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                maxWidth: "420px"
              }}
            >
              {typedText}
              <span className="typewriter-cursor" />
            </motion.span>
          )}
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium whitespace-nowrap">
          {renderLinks()}
          {siteConfig.themeToggle && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center text-xl"
              title="Toggle Dark Mode"
            >
              <motion.span
                key={darkMode ? "sun-desktop" : "moon-desktop"}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {darkMode ? "🌞" : "🌙"}
              </motion.span>
            </button>
          )}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <div
                  title={user.displayName || "User"}
                  className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-semibold text-base uppercase"
                >
                  {user.displayName
                    ? user.displayName
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase())
                        .slice(0, 2)
                        .join("")
                    : "U"}
                </div>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <Link
                      to="/submit"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Submit Project
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-700 border border-blue-600 px-4 py-1.5 rounded hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {siteConfig.themeToggle && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center text-xl"
              title="Toggle Theme"
            >
              <motion.span
                key={darkMode ? "sun-mobile" : "moon-mobile"}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {darkMode ? "🌞" : "🌙"}
              </motion.span>
            </button>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900">
          {renderLinks()}

          {!user ? (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border border-blue-600 text-blue-700 text-center px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white text-center px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;
