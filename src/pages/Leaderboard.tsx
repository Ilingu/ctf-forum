import { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { api } from "../lib/api";
import { Trophy, Medal, Award } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const myId = localStorage.getItem("my_user_id") || "";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getLeaderboard();
      setData(res);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
    if (!data.length) return null;

    // We want a line chart with time on X axis and score on Y axis.
    // Each user is a dataset.
    const colors = [
      "#00ff41",
      "#00d4ff",
      "#a855f7",
      "#ff0055",
      "#ffaa00",
      "#00ffaa",
      "#4400ff",
      "#ff00aa",
      "#aaff00",
      "#00aaff",
    ];

    const datasets = data.slice(0, 10).map((user, idx) => {
      let cumulativeScore = 0;

      // Add a 0 point at start of competition or user registration time
      // For simplicity, let's just use their first submission time - 1 min
      const firstSolve = user.solves[0]
        ? new Date(user.solves[0].solved_at).getTime() - 60000
        : Date.now();

      const datapoints = [{ x: firstSolve, y: 0 }];

      user.solves.forEach((s: any) => {
        cumulativeScore += s.points;
        datapoints.push({
          x: new Date(s.solved_at).getTime(),
          y: cumulativeScore,
        });
      });

      // Add a current point to extend the line to now
      datapoints.push({ x: Date.now(), y: cumulativeScore });

      const isMe = user.id === myId;
      const color = isMe ? "#00ff41" : colors[idx % colors.length];

      return {
        label: user.username + (isMe ? " (Toi)" : ""),
        data: datapoints,
        borderColor: color,
        backgroundColor: color,
        borderWidth: isMe ? 3 : 1.5,
        tension: 0.1,
        pointRadius: isMe ? 4 : 2,
        pointHoverRadius: 6,
        stepped: "after" as const, // Makes it a step chart which makes more sense for CTFs
      };
    });

    return { datasets };
  }, [data, myId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // Too messy on mobile
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#00ff41",
        bodyColor: "#e0e0e0",
        borderColor: "#00ff41",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "minute" as const,
          displayFormats: {
            minute: "HH:mm",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#888",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#888",
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-8 pb-24 h-screen flex flex-col">
      <header className="mb-6 flex items-center gap-3">
        <Trophy className="text-terminal" size={28} />
        <div>
          <h1 className="text-2xl font-bold font-mono text-textMain tracking-tight">
            /leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Top 20 • Mise à jour auto
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="flex justify-center mb-5">
          <LoadingSpinner size={40} />
        </div>
      )}

      {chartData && (
        <div className="w-full h-48 sm:h-64 mb-6 bg-[#121218] p-2 rounded-xl border border-gray-800 shrink-0 shadow-inner relative overflow-hidden">
          <Line options={chartOptions as any} data={chartData} />
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-[10px] text-terminal font-mono border border-terminal/30">
            <div className="w-2 h-2 rounded-full bg-terminal animate-pulse" />{" "}
            Live
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121218] rounded-xl border border-gray-800 p-1 shadow-inner">
        <div className="sticky top-0 bg-[#121218] z-10 grid grid-cols-[3rem_1fr_4rem_4rem] gap-2 p-3 text-xs font-mono text-gray-500 border-b border-gray-800">
          <div className="text-center">RANG</div>
          <div>PSEUDO</div>
          <div className="text-right">PTS</div>
          <div className="text-right">RÉSOLUS</div>
        </div>

        <div className="divide-y divide-gray-800/50">
          {data.map((user, idx) => {
            const isMe = user.id === myId;
            return (
              <div
                key={user.id}
                className={`grid grid-cols-[3rem_1fr_4rem_4rem] gap-2 p-3 items-center transition-colors ${
                  isMe
                    ? "bg-terminal/10 border-l-2 border-l-terminal"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="text-center font-mono font-bold">
                  {idx === 0 ? (
                    <Trophy
                      size={16}
                      className="mx-auto text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"
                    />
                  ) : idx === 1 ? (
                    <Medal
                      size={16}
                      className="mx-auto text-gray-300 drop-shadow-[0_0_5px_rgba(209,213,219,0.5)]"
                    />
                  ) : idx === 2 ? (
                    <Award
                      size={16}
                      className="mx-auto text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]"
                    />
                  ) : (
                    <span className="text-gray-500">#{idx + 1}</span>
                  )}
                </div>

                <div
                  className={`truncate font-bold text-sm ${isMe ? "text-terminal" : "text-gray-300"}`}
                >
                  {user.username}{" "}
                  {isMe && (
                    <span className="text-xs font-normal text-terminal/60">
                      (Toi)
                    </span>
                  )}
                </div>

                <div className="text-right font-mono text-cyan text-sm">
                  {user.totalPoints}
                </div>
                <div className="text-right font-mono text-gray-500 text-sm">
                  <span className="bg-black/40 px-2 py-0.5 rounded">
                    {user.solves.length}/5
                  </span>
                </div>
              </div>
            );
          })}

          {data.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              Aucun participant pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
