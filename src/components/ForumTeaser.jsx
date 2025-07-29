import Lottie from "lottie-react";
import leftLottie from "../assets/left-chat.json";
import rightLottie from "../assets/right-growth.json";

export default function ForumTeaser() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
        
        <div className="w-40 md:w-56 opacity-80">
          <Lottie animationData={leftLottie} autoplay loop />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="text-blue-700 dark:text-blue-400">Mitra Forum</span> is Coming Soon 💬
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            A space where juniors can ask, seniors can guide — project ideas, tech help, or doubts. Connect. Learn. Grow. Together.
          </p>
        </div>

        <div className="w-40 md:w-56 opacity-80">
          <Lottie animationData={rightLottie} autoplay loop />
        </div>
      </div>
    </section>
  );
}
