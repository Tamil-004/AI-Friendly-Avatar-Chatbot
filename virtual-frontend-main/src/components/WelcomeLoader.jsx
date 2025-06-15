import { useEffect, useRef, useState } from "react";

export const WelcomeLoader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const voicePlayedRef = useRef(false); // useRef avoids rerenders

  useEffect(() => {
    if (!voicePlayedRef.current) {
      // Speak only once
      const utterance = new SpeechSynthesisUtterance(
        "Welcome to the AI-powered avatar chatbot. Please wait while we get things ready for you."
      );
      utterance.lang = "en-US";
      utterance.pitch = 1;
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
      voicePlayedRef.current = true;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-24 h-24 mb-4 animate-spin-slow"
      />
      <h1 className="text-lg font-semibold text-center mb-2">
        Welcome to AI-Powered Avatar Chatbot
      </h1>
      <p className="text-sm">Loading... {progress}%</p>
    </div>
  );
};