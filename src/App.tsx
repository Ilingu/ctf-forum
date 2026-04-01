import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Onboarding from "./pages/Onboarding";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import { api } from "./lib/api";

function ProtectedRoute({
  children,
  is_non_protected = false,
}: {
  children: React.ReactNode;
  is_non_protected?: boolean;
}) {
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  let userInDb = false;

  async function checkIfUserReallyExists(myId: string) {
    if (userInDb) return;

    try {
      const existsInDb = await api.isUserExists(myId);
      if (!existsInDb) {
        localStorage.removeItem("my_user_id");
        localStorage.removeItem("my_username");
        return setHasUser(false);
      }

      userInDb = true;
    } catch (e) {
      localStorage.removeItem("my_user_id");
      localStorage.removeItem("my_username");
      return setHasUser(false);
    }
  }

  useEffect(() => {
    // Just check if we registered locally (simplistic for demo)
    const myId = localStorage.getItem("my_user_id");
    if (myId) {
      setHasUser(true);
      checkIfUserReallyExists(myId);
      return;
    }
    setHasUser(false);
  }, []);

  if (hasUser === null)
    return (
      <div className="min-h-screen bg-background text-terminal flex items-center justify-center font-mono">
        Loading...
      </div>
    );

  if (is_non_protected) {
    if (!hasUser) return <>{children}</>;
    return <Navigate to="/challenges" replace />;
  } else {
    if (!hasUser) return <Navigate to="/onboarding" replace />;
    return <>{children}</>;
  }
}

function Layout() {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/challenges/");

  return (
    <div className="min-h-screen bg-background text-textMain pb-20 relative font-sans overflow-x-hidden">
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-50 z-50"></div>
      <Routes>
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute is_non_protected={true}>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges/:id"
          element={
            <ProtectedRoute>
              <ChallengeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/challenges" replace />} />
      </Routes>
      {!isDetail && !location.pathname.includes("/onboarding") && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
