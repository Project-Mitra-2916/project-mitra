import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { useNavigate } from "react-router-dom";
import { Sparkles, Users, Rocket, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import ForumTeaser from "../components/ForumTeaser";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <HeroSection />

      {/* Animated Banner Section */}
      <section className="bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 dark:text-blue-400 mb-4 leading-tight">
            Empowering Students to{" "}
            <span className="text-blue-600 dark:text-blue-400">Create</span>,{" "}
            <span className="text-purple-600 dark:text-purple-400">Connect</span>{" "}
            &{" "}
            <span className="text-green-600 dark:text-green-400">
              Contribute
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-700 dark:text-gray-300 mt-2 max-w-2xl mx-auto"
          >
            Project Mitra is your companion in building academic projects that
            matter. Curated ideas, detailed guides, and a growing student
            community.
          </motion.p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-14">
            Why <span className="text-gray-900 dark:text-white">Project Mitra</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-blue-600" />,
                title: "Curated Ideas",
                desc: "Handpicked, innovative project ideas tailored for your curriculum.",
              },
              {
                icon: <Rocket className="w-8 h-8 text-purple-600" />,
                title: "Full Guide Access",
                desc: "Explore detailed documentation, steps, and implementation.",
              },
              {
                icon: <Users className="w-8 h-8 text-green-600" />,
                title: "Junior-Senior Connect",
                desc: "Learn and grow with community-driven mentorship and support.",
              },
              {
                icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
                title: "Submit Your Own",
                desc: "Contribute your unique project ideas and inspire others.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-blue-100/60 dark:bg-gray-700 p-3 rounded-full w-fit mx-auto mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 dark:bg-blue-800 py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Ready to Share or Start a Project?
          </h2>
          <p className="mb-8 text-lg">
            Project Mitra is the space where students build, share, and connect.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <button
              onClick={() => navigate("/projects")}
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition"
            >
              Explore Projects
            </button>
            <button
              onClick={() => navigate("/submit")}
              className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition"
            >
              Submit Your Idea
            </button>
          </div>
        </div>
      </section>

      <ForumTeaser />

    </div>
  );
}

export default Home;
