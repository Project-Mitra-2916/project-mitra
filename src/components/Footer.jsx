import { Github, ShieldCheck, Gavel, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-center gap-4">

                {/* Left: Made with love */}
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                        Made with
                        <Heart className="w-4 h-4 text-red-500 inline" strokeWidth={2} />
                        by <strong>Our Developers</strong> © {new Date().getFullYear()}
                    </span>
                </div>

                {/* Center: About the Developers (as text link) */}
                <Link
                    to="/about"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition"
                >
                    👨‍💻 Meet Our Developers
                </Link>

                {/* Right: GitHub, Privacy, Terms */}
                <div className="flex gap-6">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <Github className="w-4 h-4" /> GitHub
                    </a>
                    <Link
                        to="/privacy-policy"
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <ShieldCheck className="w-4 h-4" /> Privacy
                    </Link>

                    <Link
                        to="/terms-and-conditions"
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <Gavel className="w-4 h-4" /> Terms
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
