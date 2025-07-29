import { motion } from "framer-motion";
import { User, Mail, Shield, Edit, Lock } from "lucide-react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <User className="size-6" />,
      title: "What Information We Collect",
      content:
        "We may collect personal details like name, email, academic branch, year, and project preferences when you register or interact with Project Mitra. We also gather limited usage data to improve our platform experience.",
    },
    {
      icon: <Mail className="size-6" />,
      title: "How We Use Your Data",
      content:
        "Your data helps us personalize recommendations, maintain your project submissions, and enhance community features. We never sell your personal information to third parties.",
    },
    {
      icon: <Shield className="size-6" />,
      title: "Sharing & Security",
      content:
        "Your data is stored securely using Firebase. We only share it with authorized admins to review project submissions. No public disclosure of private details happens without your consent.",
    },
    {
      icon: <Edit className="size-6" />,
      title: "Your Rights",
      content:
        "You can request to view, edit, or delete your data anytime by contacting us. We respect your privacy and follow necessary protocols to maintain data safety.",
    },
    {
      icon: <Lock className="size-6" />,
      title: "Contact Us",
      content:
        "For any questions related to privacy, feel free to reach out at ",
      contact: "projectmitra2916@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28">
        {/* Glass Card for Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-100/40 dark:border-gray-700/40 rounded-2xl shadow-xl overflow-hidden mb-8 py-8 px-6 text-center transition-all hover:shadow-[0_0_18px_4px_rgba(139,92,246,0.18)]"
        >
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-2xl z-0 p-px bg-gradient-to-tr from-blue-300/60 via-transparent to-violet-400/60 opacity-40 group-hover:opacity-70 transition" />
          <div className="absolute inset-[1px] rounded-[calc(1rem_-_1px)] bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm z-0" />
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Privacy Policy</h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Last updated: July 19, 2025
            </motion.p>
          </div>
        </motion.div>

        {/* Glass Cards for Privacy Clauses */}
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1), duration: 0.5 }}
            className="relative bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-100/40 dark:border-gray-700/40 rounded-xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-[0_0_14px_2px_rgba(139,92,246,0.1)]"
          >
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-xl z-0 p-px bg-gradient-to-tr from-blue-300/30 via-transparent to-violet-400/30 opacity-40 group-hover:opacity-60 transition" />
            <div className="absolute inset-[1px] rounded-[calc(13px)] bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm z-0" />
            <div className="relative z-10 p-6 pb-7"> {/* Increase pb for y/descender */}
              <div className="flex gap-4 items-start">
                <span className="bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 p-2 rounded-lg">
                  {section.icon}
                </span>
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-1">
                    {section.title}
                  </h2>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.content}
                    {idx === 4 && (
                      <>
                        <a
                          href={`mailto:${section.contact}`}
                          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          {section.contact}
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
