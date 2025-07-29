import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import male_2 from "../assets/male_2.jpg";
import female from "../assets/female.jpg";

const developers = [
  {
    name: "Gaurang Gupta",
    role: "Frontend & UX",
    email: "guptatech29@gmail.com",
    linkedin: "https://www.linkedin.com/in/gaurang-gupta-131689275",
    avatar: male_2, // <--- Use the imported variable
    bio: "Designed the homepage, login, card layouts, and implemented dark mode to deliver a smooth and interactive user experience. Passionate about building practical student-focused platforms with modern tools like React, Tailwind CSS, Figma, and Firebase.",
  },
  {
    name: "Vedanshi Gupta",
    role: "Firebase Integration & Deployment",
    email: "collab@email.com",
    linkedin: "https://www.linkedin.com/in/vedanshigupta/",
    avatar: female, // <--- Use the imported variable
    bio: "Worked on Firebase integration, authentication, Firestore, and project submission flow to ensure smooth and reliable backend performance. Believes in helping students find valuable projects with a clean and aesthetic UI. Skilled in Firebase, Tailwind CSS, React, and Figma.",
  },
];

const AboutDevelopers = () => {
  const [typedNames, setTypedNames] = useState(developers.map(() => ""));
  const [position, setPosition] = useState(0);

  // Text typewriter effect
  useEffect(() => {
    developers.forEach((dev, idx) => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedNames((prev) => {
          const updated = [...prev];
          updated[idx] = dev.name.slice(0, i + 1);
          return updated;
        });
        i++;
        if (i === dev.name.length) clearInterval(interval);
      }, 70);
    });
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const onScroll = () => setPosition(window.pageYOffset);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-24 pb-20 px-4 md:px-10 bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden relative">
        {/* Decorative Blobs */}
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <div
            className="absolute left-1/4 -translate-x-1/2 size-96 rounded-full bg-blue-400/20 blur-3xl"
            style={{ transform: `translateY(${(position * 0.15)}px)` }}
          />
          <div
            className="absolute right-1/4 translate-x-1/2 size-96 rounded-full bg-violet-400/20 blur-3xl"
            style={{ transform: `translateY(${-(position * 0.1)}px)` }}
          />
        </div>

        {/* Header */}
        <header>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 pb-4 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 bg-clip-text text-transparent">
            Meet the Builders
          </h2>
        </header>

        {/* Developer Grid */}
        <div className="grid gap-10 max-w-6xl mx-auto grid-cols-1 md:grid-cols-2">
          {developers.map((dev, idx) => (
            <div
              key={idx}
              className="relative group cursor-default"
              style={{
                transform: !idx
                  ? `translateY(${-(position * 0.05)}px)`
                  : `translateY(${position * 0.05}px)`
              }}
            >
              {/* Glass Card */}
              <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-100/30 dark:border-gray-700/30 rounded-3xl shadow-xl group-hover:shadow-[0_0_20px_4px_rgba(139,92,246,0.2)] transition-all overflow-hidden p-6 flex flex-col items-center text-center z-10">
                {/* Gradient Border */}
                <div className="absolute inset-0 z-0 rounded-3xl p-px bg-gradient-to-br from-blue-300 to-violet-400 via-transparent via-50% opacity-90 group-hover:opacity-100 transition" />
                <div className="absolute inset-[1px] rounded-[calc(1.5rem_-_1px)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm z-0" />

                {/* Avatar */}
                <div className="relative mb-6">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="size-36 rounded-full object-cover group-hover:opacity-95 transition-all duration-500 border-4 border-blue-400 dark:border-blue-600"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-violet-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>

                {/* Name (Typewriter) */}
                <h3 className="relative text-2xl font-semibold tracking-tight mb-2 z-10">
                  {typedNames[idx]}
                  <span
                    className="ml-0.5 w-px h-6 inline-block align-middle bg-blue-600 dark:bg-blue-400 animate-blink"
                    style={{ animationDuration: "750ms" }}
                    aria-hidden="true"
                  />
                </h3>

                {/* Role */}
                <p className="relative text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-1 z-10">
                  {dev.role}
                </p>

                {/* Email */}
                <p className="relative text-xs text-gray-600 dark:text-gray-400 mb-2 z-10">
                  {dev.email}
                </p>

                {/* LinkedIn */}
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium group/btn"
                >
                  <svg
                    className="size-4 group-hover/btn:-translate-y-0.5 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.3c-1 0-1.8-.8-1.8-1.8S5 4.1 6 4.1s1.8.8 1.8 1.8c0 .9-.8 1.8-1.8 1.8zm13.5 11.3h-3v-5.6c0-1.3-.5-2.2-1.6-2.2-1 0-1.5.7-1.8 1.3-.1.2-.1.5-.1.8v5.7h-3s.1-9.3 0-10.2h3v1.4c.4-.7 1.1-1.7 2.8-1.7 2.1 0 3.7 1.4 3.7 4.4v6.1z" />
                  </svg>
                  <span className="inline-block group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition">
                    LinkedIn
                  </span>
                </a>

                {/* Bio */}
                <p className="relative mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-w-md z-10">
                  {dev.bio}
                </p>

                {/* Tech Icons (absolute, decorative) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all pointer-events-none [&>*]:absolute [&>*]:rounded-full [&>*]:p-2 [&>*]:opacity-10 [&>*]:transition-all [&>*]:-z-10">
                  <span className="top-8 right-8 bg-blue-500/20">
                    <svg
                      className="size-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "hsl(221,83%,53%)" }}
                    >
                      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.149 1.181 2.45 2.519 5.51 2.519 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C15.052 7.492 13.751 6.151 10.691 6.151h-.001zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.149 1.181 2.45 2.519 5.51 2.519 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C9.052 14.692 7.751 13.351 4.691 13.351h-.001z" />
                    </svg>
                  </span>
                  <span className="top-16 left-12 bg-purple-500/20">
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "hsl(258,90%,66%)" }}
                    >
                      <path d="M22 2.25c-1 .5-1.5.75-2.25.75.75-.5 1.25-1.5 1.5-2.5-1 1-2 1.75-3 2.25C17 1.5 15 1 13 1 8 1 4 5 4 10c0 2.5 1.5 5 3.5 6.5-.5 0-1-.5-1.5-1 0 2 1.5 3.5 3.5 4-.5 0-1-.5-1-1.5V16c0 3.5 4 5 6.5 6.5l-2.5 2.5c1-1 2-2.5 2-4 2.5 0 5-1.5 6-3.5 0-1.5.5-3.5.5-5 1 0 1.5 1 1.5 1.5.5 0 1-.5 2-.5-.5 0-1.5 1.5-2.5 2.5z" />
                    </svg>
                  </span>
                  <span className="bottom-8 right-16 bg-green-500/20">
                    <svg
                      className="size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "hsl(142,71%,45%)" }}
                    >
                      <path d="M12.001 22c-5.523 0-10-4.477-10-10 0-4.418 2.86-8.166 7-9.498v3.498c-2.6.894-4.5 3.3-4.5 6 0 3.314 2.686 6 6 6 2.7 0 5.106-1.9 6-4.498h3.498c-1.332 4.14-5.08 7-9.498 7zM12.001 13c1.1 0 2-.9 2-2 0-1.1-.9-2-2-2s-2 .9-2 2c0 1.1.9 2 2 2z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutDevelopers;
