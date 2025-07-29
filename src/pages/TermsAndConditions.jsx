import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Shield, Lock, HeartHandshake } from "lucide-react";
import Navbar from '../components/Navbar';

const TermsAndConditions = () => {
  const clauses = [
    {
      icon: <Sparkles className="size-6" />,
      title: "Use of Platform",
      text: "You must use Project Mitra for lawful and educational purposes only. Any misuse, unauthorized access, or tampering with content or user data will result in permanent ban and legal consequences.",
    },
    {
      icon: <GraduationCap className="size-6" />,
      title: "Content Ownership",
      text: "Users retain ownership of projects they submit. However, by submitting, you grant Project Mitra the right to showcase the content for academic, promotional, or community-building purposes.",
    },
    {
      icon: <Shield className="size-6" />,
      title: "Plagiarism Policy",
      text: "Plagiarism is strictly prohibited. Projects must be either original or properly credited. Repeated offenses may lead to user account suspension.",
    },
    {
      icon: <HeartHandshake className="size-6" />,
      title: "Community Conduct",
      text: "Treat fellow users with respect. Abusive, offensive, or spammy behavior is not tolerated and may result in account removal.",
    },
    {
      icon: <Lock className="size-6" />,
      title: "Modification of Terms",
      text: "We reserve the right to modify these terms at any time. Changes will be communicated via platform notifications or email.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 pt-28 min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900/90 dark:to-gray-800/90 text-gray-800 dark:text-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-100/40 dark:border-gray-700/40 rounded-2xl shadow-xl overflow-hidden mb-10 p-8 transition-all hover:shadow-[0_0_18px_4px_rgba(139,92,246,0.18)]"
        >
          {/* Gradient Accent Border */}
          <div className="absolute inset-0 rounded-2xl z-0 p-px bg-gradient-to-tr from-blue-300/60 via-transparent to-violet-400/60 opacity-40 group-hover:opacity-70 transition" />
          <div className="absolute inset-[1px] rounded-[calc(1rem_-_1px)] bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm z-0" />
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-violet-600 to-blue-700 dark:from-blue-400 dark:to-violet-400">
              Terms and Conditions
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-700 dark:text-gray-300 mb-2 leading-relaxed"
            >
              Welcome to <strong className="text-blue-700 dark:text-blue-400">Project Mitra</strong>. By accessing and using our platform, you agree to abide by the following terms and conditions. These terms are designed to ensure a safe, transparent, and respectful experience for all users.
            </motion.p>
          </div>
        </motion.div>

        {/* Glass Cards for Clauses */}
        {clauses.map((clause, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1), duration: 0.5 }}
            className="relative bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-100/40 dark:border-gray-700/40 rounded-xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-[0_0_14px_2px_rgba(139,92,246,0.1)]"
          >
            {/* Gradient Accent Border */}
            <div className="absolute inset-0 rounded-xl z-0 p-px bg-gradient-to-tr from-blue-300/30 via-transparent to-violet-400/30 opacity-40 group-hover:opacity-60 transition" />
            <div className="absolute inset-[1px] rounded-[calc(13px)] bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm z-0" />
            <div className="relative z-10 p-6">
              <div className="flex gap-4 items-start">
                <span className="bg-blue-100/60 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 p-2 rounded-lg">
                  {clause.icon}
                </span>
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-1">{clause.title}</h2>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {clause.text}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Last updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 italic text-sm text-gray-500 dark:text-gray-400"
        >
          Last updated: July 2025
        </motion.div>
      </div>
    </>
  );
};

export default TermsAndConditions;
