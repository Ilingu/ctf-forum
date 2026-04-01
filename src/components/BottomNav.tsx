import { NavLink } from 'react-router-dom';
import { Terminal, Trophy, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-[#0a0a0f]/90 backdrop-blur-md border-t border-terminal/20 py-3 px-6 z-40">
      <ul className="flex justify-between items-center max-w-md mx-auto">
        <li>
          <NavLink
            to="/challenges"
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 text-sm transition-colors",
              isActive ? "text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" : "text-gray-500 hover:text-terminal/70"
            )}
          >
            <Terminal size={24} />
            <span>Défis</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 text-sm transition-colors",
              isActive ? "text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" : "text-gray-500 hover:text-terminal/70"
            )}
          >
            <Trophy size={24} />
            <span>Score</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 text-sm transition-colors",
              isActive ? "text-terminal drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" : "text-gray-500 hover:text-terminal/70"
            )}
          >
            <User size={24} />
            <span>Profil</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}