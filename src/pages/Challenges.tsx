import { Link } from "react-router-dom";
import { api, type Submission } from "../lib/api";
import { CheckCircle2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Challenges() {
  const challenges = api.getChallenges();
  const myId = localStorage.getItem("my_user_id") || "";
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const mySubmissions = await api.getUserSubmissions(myId);
        setMySubmissions(mySubmissions);
      } catch (error) {}
      setLoading(false);
    }
    load();
  }, [myId]);

  return (
    <div className="max-w-md mx-auto p-4 pt-8 pb-24">
      <header className="mb-8 flex items-center justify-between border-b border-terminal/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-terminal tracking-tight">
            /challenges
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Sélectionne un puzzle pour commencer
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="flex justify-center mb-5">
          <LoadingSpinner size={40} />
        </div>
      )}

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const isSolved = mySubmissions.some(
            (s) => s.challenge_id === challenge.id,
          );

          return (
            <Link
              key={challenge.id}
              to={`/challenges/${challenge.id}`}
              className={`block relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
                isSolved
                  ? "bg-green-950/20 border-green-500/40 shadow-[0_0_15px_rgba(0,255,65,0.05)]"
                  : "bg-[#16161c] border-gray-800 hover:border-terminal/40 shadow-sm"
              }`}
            >
              {isSolved && (
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <CheckCircle2 size={100} className="text-terminal" />
                </div>
              )}

              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl bg-black/40 border ${isSolved ? "border-terminal/50 text-terminal" : "border-gray-800"}`}
                >
                  {challenge.icon}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2
                      className={`font-bold ${isSolved ? "text-terminal" : "text-textMain"}`}
                    >
                      {challenge.id}. {challenge.title}
                    </h2>
                    {isSolved ? (
                      <CheckCircle2
                        className="text-terminal drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]"
                        size={20}
                      />
                    ) : (
                      <Lock className="text-gray-600" size={20} />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                    <span className="text-cyan">{challenge.points} pts</span>
                    <span className="text-gray-500">•</span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${i < challenge.difficulty ? (challenge.difficulty === 1 ? "bg-green-500" : challenge.difficulty === 2 ? "bg-yellow-500" : "bg-red-500") : "bg-gray-800"}`}
                        />
                      ))}
                    </span>
                    <span className="text-gray-500 ml-auto bg-black/30 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                      {challenge.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
