import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Challenge } from "../lib/api";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [points, setPoints] = useState(0);

  const challengeId = parseInt(id || "0", 10);
  const myId = localStorage.getItem("my_user_id") || "";

  async function verifyFlag() {
    try {
      setLoading(true);
      const subs = await api.getUserSubmissions(myId);
      const isSolved = subs.some((s) => s.challenge_id === challengeId);
      if (isSolved) {
        setSuccess(true);
        setFlag("FLAG{RÉSOLU}");
      }
      setLoading(false);
    } catch (error) {}
  }

  useEffect(() => {
    const ch = api.getChallenge(challengeId);
    if (!ch) {
      navigate("/challenges");
      return;
    }
    setChallenge(ch);

    verifyFlag();
  }, [challengeId, myId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (success || loading || !flag.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await api.verifyFlag(myId, challengeId, flag);

      if (result.success) {
        setSuccess(true);
        setPoints(result.points || 0);
      } else {
        setError(result.message);
        // Cooldown 3s
        setTimeout(() => setError(""), 3000);
      }
      setLoading(false);
    } catch (e) {}
  };

  if (!challenge)
    return (
      <div className="p-8 text-center text-gray-500 font-mono">Loading...</div>
    );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a0a0f] text-textMain relative">
      {/* Hidden Comment for Challenge 2 */}
      {challengeId === 2 && (
        <div
          className="hidden"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: "<!-- FLAG{l3s_d3vs_0ubl13nt_t0uj0urs_d3s_s3cr3ts} -->",
          }}
        />
      )}
      {challengeId === 2 && (
        <div
          className="hidden"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: "<!-- TODO: fix responsive layout -->",
          }}
        />
      )}
      {challengeId === 2 && (
        <div
          className="hidden"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: "<!-- NOTE: refactorer ce composant avant la v2 -->",
          }}
        />
      )}
      {challengeId === 2 && (
        <div
          className="hidden"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: "<!-- FLAG INCORRECT: ceci n'est pas le flag ;) -->",
          }}
        />
      )}

      <header className="sticky top-0 bg-[#0a0a0f]/90 backdrop-blur border-b border-gray-800 z-10 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate("/challenges")}
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2 font-mono text-sm tracking-tight text-terminal">
          <span className="text-gray-500">challenges/</span>
          {challengeId}
        </div>
      </header>

      <main className="p-4 pb-24 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl bg-black/40 p-2 rounded-xl border border-gray-800">
              {challenge.icon}
            </span>
            {challenge.title}
          </h1>
          <div className="flex items-center gap-3 mt-4 text-sm font-mono text-gray-400">
            <span className="bg-cyan/10 text-cyan px-2 py-1 rounded">
              {challenge.points} PTS
            </span>
            <span>DIFFICULTÉ : {"⭐".repeat(challenge.difficulty)}</span>
          </div>
        </div>

        <div className="bg-[#121218] border border-gray-800 rounded-xl p-5 shadow-inner">
          <div className="font-mono text-sm whitespace-pre-wrap text-gray-300 leading-relaxed custom-scrollbar">
            {challenge.description}
          </div>
        </div>

        {challenge.type === "image-select" && (
          <div className="bg-[#121218] p-4 rounded-xl border border-gray-800 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="relative aspect-square bg-gray-900 rounded-lg border border-gray-800 flex flex-col items-center justify-center overflow-hidden group"
                >
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 text-xs font-mono rounded text-white z-10">
                    #{num}
                  </div>
                  <img
                    src={`/assets/${num}.webp`}
                    className="text-gray-700 mb-2"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label
              htmlFor="flag"
              className="text-sm font-mono text-terminal flex items-center gap-2"
            >
              <ChevronRight size={16} /> Soumettre le flag
            </label>
            <div className="relative">
              <input
                id="flag"
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                disabled={success || loading}
                placeholder="FLAG{...}"
                className={`w-full bg-[#121218] border rounded-lg py-3 px-4 font-mono text-sm focus:outline-none transition-colors
                  ${
                    success
                      ? "border-green-500/50 text-green-400 opacity-80"
                      : error
                        ? "border-red-500 text-red-400 focus:border-red-400"
                        : "border-gray-700 focus:border-terminal text-textMain"
                  }`}
                autoComplete="off"
                spellCheck="false"
              />
              {success && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]" />
              )}
            </div>

            {error && (
              <div className="text-red-400 text-sm font-mono bg-red-950/20 p-2 rounded border border-red-900/50">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="text-terminal text-sm font-mono bg-green-950/20 p-3 rounded border border-green-900/50 animate-fade-in flex flex-col items-center text-center gap-1 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                <span className="text-lg">✅ Bravo ! Challenge validé.</span>
                <span className="text-cyan text-xs">
                  +{points || challenge.points} points attribués
                </span>
              </div>
            )}

            {!success && (
              <button
                type="submit"
                disabled={loading || !flag.trim() || !!error}
                className="w-full mt-2 py-3 bg-terminal/10 hover:bg-terminal/20 text-terminal border border-terminal/50 rounded-lg transition-all font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-terminal/10 uppercase"
              >
                {loading ? (
                  <div className="flex justify-center gap-x-2 items-center">
                    <LoadingSpinner size={20} /> VÉRIFICATION...
                  </div>
                ) : (
                  "[ VALIDER ]"
                )}
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
