import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot"; // ✅ Chatbot import

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProjectList = lazy(() => import("./pages/ProjectList"));
const SubmitProject = lazy(() => import("./pages/SubmitProject"));
const ProjectView = lazy(() => import("./pages/ProjectView"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EditProject = lazy(() => import("./pages/EditProject"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutDevelopers = lazy(() => import("./pages/AboutDevelopers"));
const CodeGenerator = lazy(() => import("./pages/CodeGenerator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/register"];
  const hideChatbotRoutes = ["/login", "/register"]; // ✅ Add paths to hide chatbot

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/edit/:id" element={<EditProject />} />
          <Route path="/about" element={<AboutDevelopers />} />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/code-generator"
            element={
              <ProtectedRoute>
                <CodeGenerator />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {!hideChatbotRoutes.includes(location.pathname) && <Chatbot />}    
        {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        
      </Suspense>
    </div>
  );
}

export default App;
