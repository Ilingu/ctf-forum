import { useState, useEffect } from "react";
import { api } from "../lib/api";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [typedText, setTypedText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fullText =
    "$ Bienvenue au CTF Métier Info\n$ Prêt·e à relever le défi ?";

  useEffect(() => {
    let currentText = "";
    let i = 0;

    const interval = setInterval(() => {
      currentText += fullText[i];
      setTypedText(currentText);
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowInput(true), 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!name.trim() || submitting) return;
    setSubmitting(true);

    try {
      const user = await api.registerUser(name.trim());
      localStorage.setItem("my_user_id", user.id);
      localStorage.setItem("my_username", user.username);
      // Force reload or redirect to load ProtectedRoute
      window.location.href = "/challenges";
      setSubmitting(false);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background font-mono">
      <div className="w-full max-w-md bg-[#121218] p-6 rounded-lg border border-terminal/30 shadow-[0_0_15px_rgba(0,255,65,0.15)] relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-[#1e1e24] rounded-t-lg flex items-center px-3 border-b border-terminal/20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="ml-4 text-xs text-gray-400">root@ctf-2026:~</span>
        </div>

        <div className="mt-8 text-terminal whitespace-pre-line text-sm md:text-base leading-relaxed h-20">
          {typedText}
          <span className="animate-pulse">_</span>
        </div>

        {showInput && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 animate-fade-in flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-cyan">
                Identifiant de session :
              </label>
              <div className="flex items-center gap-2">
                <span className="text-terminal">{">"}</span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entre ton pseudo..."
                  className="bg-transparent border-b border-terminal/50 focus:border-terminal outline-none text-textMain py-1 px-2 w-full font-mono placeholder-gray-600 transition-colors"
                  autoFocus
                  maxLength={20}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="mt-4 w-full py-3 bg-terminal/10 hover:bg-terminal/20 text-terminal border border-terminal/50 rounded transition-all font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed uppercase shadow-[0_0_10px_rgba(0,255,65,0.1)] hover:shadow-[0_0_15px_rgba(0,255,65,0.3)]"
            >
              [ COMMENCER ]
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
