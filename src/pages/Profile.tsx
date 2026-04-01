import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, type Submission } from "../lib/api";
import { User, LogOut, CheckCircle2, Lock, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Profile() {
  const myId = localStorage.getItem("my_user_id") || "";
  const myUsername = localStorage.getItem("my_username") || "Anonyme";

  const challenges = api.getChallenges();
  const [submissions, setMySubmissions] = useState<Submission[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const mySubmissions = await api.getUserSubmissions(myId);
      setMySubmissions(mySubmissions);
      setLoading(false);
    }
    load();
  }, [myId]);

  const totalPoints = useMemo(() => {
    return submissions.reduce((sum, s) => sum + s.points, 0);
  }, [submissions]);

  const maxPoints = useMemo(() => {
    return challenges.reduce((sum, c) => sum + c.points, 0);
  }, [challenges]);

  const progress = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

  const handleReset = () => {
    if (
      window.confirm(
        "Es-tu sûr de vouloir réinitialiser ta session ? Ton score sera conservé sur le serveur, mais tu seras déconnecté de cet appareil.",
      )
    ) {
      localStorage.removeItem("my_user_id");
      localStorage.removeItem("my_username");
      window.location.href = "/onboarding";
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-8 pb-24">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-terminal/10 rounded-full flex items-center justify-center border border-terminal/30">
            <User className="text-terminal" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-textMain">
              {myUsername}
            </h1>
            <p className="text-gray-500 text-xs font-mono break-all">
              ID: {myId.substring(0, 8)}...{myId.substring(myId.length - 4)}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-2 bg-red-950/30 text-red-500 hover:text-red-400 border border-red-900/50 rounded-lg transition-colors flex items-center gap-2 text-xs font-mono shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          title="Déconnexion"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Sortir</span>
        </button>
      </header>

      {isLoading && (
        <div className="flex justify-center mb-5">
          <LoadingSpinner size={40} />
        </div>
      )}

      <div className="bg-[#121218] rounded-xl border border-gray-800 p-5 mb-8 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <h2 className="text-sm text-gray-400 font-mono mb-2 flex items-center gap-2">
          <Target size={16} /> SCORE GLOBAL
        </h2>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.3)]">
            {totalPoints}
          </span>
          <span className="text-gray-500 font-mono text-sm">
            / {maxPoints} pts
          </span>
        </div>

        <div className="w-full bg-black/50 rounded-full h-3 mb-2 overflow-hidden border border-gray-800">
          <div
            className="bg-gradient-to-r from-green-600 to-terminal h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,255,65,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-gray-500">
          <span>{submissions.length} résolus</span>
          <span>{challenges.length - submissions.length} restants</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold font-mono text-textMain mb-4 border-b border-gray-800 pb-2">
          Historique
        </h3>

        <div className="space-y-3">
          {challenges.map((challenge) => {
            const sub = submissions.find(
              (s) => s.challenge_id === challenge.id,
            );
            const isSolved = !!sub;

            return (
              <div
                key={challenge.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isSolved
                    ? "bg-green-950/10 border-green-900/40"
                    : "bg-black/20 border-gray-900/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm border ${
                      isSolved
                        ? "bg-terminal/10 text-terminal border-terminal/30"
                        : "bg-gray-900 text-gray-600 border-gray-800"
                    }`}
                  >
                    {challenge.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-300">
                      {challenge.title}
                    </div>
                    <div className="text-xs font-mono text-gray-600 mt-1">
                      {isSolved && sub ? (
                        <span className="text-green-500/80">
                          {new Date(sub.solved_at).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : (
                        <span>Non résolu</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold ${isSolved ? "text-cyan" : "text-gray-600"}`}
                  >
                    {challenge.points}
                  </span>
                  {isSolved ? (
                    <CheckCircle2 size={18} className="text-terminal" />
                  ) : (
                    <Lock size={18} className="text-gray-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
