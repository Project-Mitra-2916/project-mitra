import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { resetPassword } from "../context/AuthContext";
import { toast } from "react-toastify";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.warn("Please fill in both email and password ✉️", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.info("Please enter a valid email address ✉️", {
        icon: <Info size={20} color="#3b82f6" />,
      });
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.warn("Password should be at least 6 characters 🔐", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);

      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        toast.warn("Please verify your email before logging in 🔒", {
          icon: <AlertTriangle size={20} color="#f59e0b" />,
        });
        setLoading(false);
        return;
      }

      toast.success("Login successful ✅", {
        icon: <CheckCircle size={20} color="#10b981" />,
      });
      navigate("/projects");
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your internet.";
          break;
        default:
          errorMessage = "Login failed. Please check your credentials.";
      }

      toast.error(errorMessage, {
        icon: <AlertTriangle size={20} color="#ef4444" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.info("Please enter your email to reset password.", {
        icon: <Info size={20} color="#3b82f6" />,
      });
      return;
    }

    try {
      await resetPassword(trimmedEmail);
      toast.success("Password reset email sent! 📩", {
        icon: <CheckCircle size={20} color="#10b981" />,
      });
    } catch (error) {
      toast.error("Failed to send reset email. ❌", {
        icon: <AlertTriangle size={20} color="#ef4444" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 text-gray-800 dark:text-white transition-colors duration-700">
      <Navbar />

      <div className="flex items-center justify-center px-4">
        <Transition
          appear
          show={true}
          enter="transition ease-out duration-500"
          enterFrom="opacity-0 translate-y-10"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="w-full max-w-md
            bg-white/80 dark:bg-gray-900/90 shadow-2xl rounded-2xl p-10 border border-gray-100
            dark:border-blue-950 backdrop-blur-xl relative
            before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tr before:from-blue-300/10 before:to-violet-300/5 before:z-[-1]">
            <h2 className="text-3xl font-bold tracking-tight text-center text-blue-700 dark:text-blue-300 mb-8 drop-shadow">
              Login to Project Mitra
            </h2>

            <form className="space-y-6" autoComplete="off" onSubmit={handleLogin}>
              {/* Email field with icon */}
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 dark:text-blue-300 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password field with icon and toggle */}
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 dark:text-blue-300 pointer-events-none" />
                <input
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800 text-black dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 hover:from-violet-600 hover:to-blue-800 text-white py-3 rounded-xl font-semibold tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all duration-200
                  flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : null}
                Login
              </button>

              <p
                className="text-sm text-blue-600 dark:text-blue-300 hover:underline cursor-pointer text-center"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </p>
            </form>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-8 text-center">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-violet-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default Login;
