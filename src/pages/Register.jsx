import { useState } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!name || !email || !password) {
      toast.warn("Please fill in all required fields 📝", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|net|org|edu|gov|ai|tech)$/i;
    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address ✉️", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    if (password.length < 6) {
      toast.warn("Password should be at least 6 characters 🔐", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await sendEmailVerification(userCredential.user);
      await signOut(auth); // ❗️Important — Log them out after registration

      toast.success("Registration successful ✅ Verification email sent!", {
        icon: <CheckCircle size={20} color="#10b981" />,
      });
      toast.info("📩 Please check your inbox or spam folder to verify your email.", {
        icon: "📬",
      });


      navigate("/login");
    } catch (error) {
      let errorMessage = "Something went wrong ❌";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = "Registration failed. Please try again.";
      }

      toast.error(errorMessage, {
        icon: <AlertTriangle size={20} color="#ef4444" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 text-gray-800 dark:text-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              className="input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
