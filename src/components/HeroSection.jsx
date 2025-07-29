import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import heroAnimation from "../assets/hero-animation.json";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-gray-900 py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Left Content with animation */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Build Projects. <br />
            Inspire Juniors. <br />
            Grow Together.
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-8">
            Discover amazing project ideas, share your work, and learn with the student community.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/projects")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Explore Projects
          </motion.button>
        </motion.div>

        {/* Right Lottie animation with motion */}
        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Lottie
            animationData={heroAnimation}
            loop
            className="w-full max-w-md"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
