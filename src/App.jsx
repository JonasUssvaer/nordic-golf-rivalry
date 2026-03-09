import { useState, useMemo } from "react";
import { Trophy, Flag, TrendingUp, Calendar, MapPin, Star, Flame, Target, ChevronDown, ChevronUp } from "lucide-react";
import { TEAMS, ROUNDS } from "./data/rounds";

// ─── Utility functions ─────────────────────────────────────────────────────
function getStats(rounds) {
  const team1Wins = rounds.filter((r) => r.winner === "team1").length;
  const team2Wins = rounds.filter((r) => r.winner === "team2").length;
  const ties = rounds.filter((r) => r.winner === "tie").length;
  const total = rounds.length;

  const team1AvgScore = total > 0 ? rounds.reduce((s, r) => s + r.team1Score, 0) / total : 0;
  const team2AvgScore = total > 0 ? rounds.reduce((s, r) => s + r.team2Score, 0) / total : 0;

  const team1BestScore = total > 0 ? Math.min(...rounds.map((r) => r.team1Score)) : null;
  const team2BestScore = total > 0 ? Math.min(...rounds.map((r) => r.team2Score)) : null;

  // Current streak
  let streak = { team: null, count: 0 };
  const sorted = [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const r of sorted) {
    if (r.winner === "tie") break;
    if (streak.team === null) {
      streak = { team: r.winner, count: 1 };
    } else if (r.winner === streak.team) {
      streak.count++;
    } else {
      break;
    }
  }

  // MVP counts
  const mvpCounts = {};
  rounds.forEach((r) => {
    if (r.mvp) mvpCounts[r.mvp] = (mvpCounts[r.mvp] || 0) + 1;
  });
  const topMvp = Object.entries(mvpCounts).sort((a, b) => b[1] - a[1])[0];

  // Game mode breakdown
  const byMode = {};
  rounds.forEach((r) => {
    if (!byMode[r.gameMode]) byMode[r.gameMode] = { team1: 0, team2: 0, ties: 0 };
    if (r.winner === "team1") byMode[r.gameMode].team1++;
    else if (r.winner === "team2") byMode[r.gameMode].team2++;
    else byMode[r.gameMode].ties++;
  });

  return { team1Wins, team2Wins, ties, total, team1AvgScore, team2AvgScore, team1BestScore, team2BestScore, streak, topMvp, byMode };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Components ────────────────────────────────────────────────────────────

function HeroSection({ stats }) {
  const leader = stats.team1Wins > stats.team2Wins ? "team1" : stats.team2Wins > stats.team1Wins ? "team2" : null;
  const margin = Math.abs(stats.team1Wins - stats.team2Wins);

  return (
    <div className="text-center py-8 px-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Flag className="w-5 h-5 text-green-400" />
        <span className="text-green-400 uppercase tracking-widest text-xs font-semibold">Season 2026</span>
        <Flag className="w-5 h-5 text-green-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "Georgia, serif" }}>
        The Nordic Golf Rivalry
      </h1>
      <p className="text-green-300 text-sm mb-8">Where friendships are tested and excuses are made</p>

      {/* Big scoreboard */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-right flex-1">
          <p className="text-green-300 text-xs uppercase tracking-wider mb-1">{TEAMS.team1.name}</p>
          <p className="text-6xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>{stats.team1Wins}</p>
        </div>
        <div className="flex flex-col items-center px-4">
          <span className="text-2xl text-green-500 font-light">—</span>
          <span className="text-green-500 text-xs mt-1">{stats.ties} ties</span>
        </div>
        <div className="text-left flex-1">
          <p className="text-green-300 text-xs uppercase tracking-wider mb-1">{TEAMS.team2.name}</p>
          <p className="text-6xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>{stats.team2Wins}</p>
        </div>
      </div>

      {leader && (
        <div className="inline-flex items-center gap-2 bg-green-900 bg-opacity-50 rounded-full px-4 py-1.5">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-green-200 text-sm">
            {TEAMS[leader].name} leads by {margin}
          </span>
        </div>
      )}

      {stats.streak.count >= 2 && (
        <div className="mt-3 inline-flex items-center gap-2 bg-orange-900 bg-opacity-40 rounded-full px-4 py-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-200 text-sm">
            {TEAMS[stats.streak.team].name} on a {stats.streak.count}-round win streak!
          </span>
        </div>
      )}
    </div>
  );
}

function TeamCard({ teamKey, stats }) {
  const team = TEAMS[teamKey];
  const wins = teamKey === "team1" ? stats.team1Wins : stats.team2Wins;
  const avg = teamKey === "team1" ? stats.team1AvgScore : stats.team2AvgScore;
  const best = teamKey === "team1" ? stats.team1BestScore : stats.team2BestScore;
  const winPct = stats.total > 0 ? ((wins / stats.total) * 100).toFixed(0) : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
        <h3 className="text-white font-semibold text-lg">{team.name}</h3>
      </div>
      {team.players.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-2 ml-6">
          <span>{p.emoji}</span>
          <span className="text-gray-300 text-sm">{p.name}</span>
          <span className="text-gray-500 text-xs italic">"{p.nickname}"</span>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{winPct}%</p>
          <p className="text-gray-500 text-xs">Win Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{avg > 0 ? avg.toFixed(1) : "—"}</p>
          <p className="text-gray-500 text-xs">Avg Score</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{best ?? "—"}</p>
          <p className="text-gray-500 text-xs">Best Round</p>
        </div>
      </div>
    </div>
  );
}

function GameModeBreakdown({ byMode }) {
  const modes = Object.entries(byMode);
  if (modes.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Target className="w-4 h-4 text-green-400" />
        By Game Mode
      </h3>
      <div className="space-y-3">
        {modes.map(([mode, record]) => {
          const total = record.team1 + record.team2 + record.ties;
          return (
            <div key={mode}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 text-sm font-medium">{mode}</span>
                <span className="text-gray-500 text-xs">{total} rounds</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-700">
                {record.team1 > 0 && (
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(record.team1 / total) * 100}%`, backgroundColor: TEAMS.team1.color }}
                  />
                )}
                {record.ties > 0 && (
                  <div
                    className="h-full bg-gray-500 transition-all"
                    style={{ width: `${(record.ties / total) * 100}%` }}
                  />
                )}
                {record.team2 > 0 && (
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(record.team2 / total) * 100}%`, backgroundColor: TEAMS.team2.color }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: TEAMS.team1.color }}>
                  {TEAMS.team1.name.split(" ").pop()} {record.team1}
                </span>
                <span className="text-xs" style={{ color: TEAMS.team2.color }}>
                  {record.team2} {TEAMS.team2.name.split(" ").pop()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoundCard({ round, index }) {
  const [expanded, setExpanded] = useState(false);
  const isTeam1Win = round.winner === "team1";
  const isTeam2Win = round.winner === "team2";
  const isTie = round.winner === "tie";

  const winnerColor = isTeam1Win ? TEAMS.team1.color : isTeam2Win ? TEAMS.team2.color : "#6b7280";

  return (
    <div
      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(round.date)}
            </div>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{round.gameMode}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            {round.course}
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className="text-gray-400 text-xs mb-0.5">{TEAMS.team1.name}</p>
            <p className={`text-3xl font-bold ${isTeam1Win ? "text-green-400" : isTie ? "text-yellow-400" : "text-gray-400"}`}>
              {round.team1Score}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {isTie ? (
              <span className="text-yellow-400 text-sm font-semibold">TIE</span>
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: winnerColor }}>
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-400 text-xs mb-0.5">{TEAMS.team2.name}</p>
            <p className={`text-3xl font-bold ${isTeam2Win ? "text-green-400" : isTie ? "text-yellow-400" : "text-gray-400"}`}>
              {round.team2Score}
            </p>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex justify-center mt-2">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-700 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Team handicaps: {round.team1Handicap} vs {round.team2Handicap}</span>
            <span>Margin: {isTie ? "Even" : `${Math.abs(round.team1Score - round.team2Score)} strokes`}</span>
          </div>
          {round.mvp && (
            <div className="flex items-center gap-2 bg-yellow-900 bg-opacity-30 rounded-lg px-3 py-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-200 text-sm">MVP: {round.mvp}</span>
            </div>
          )}
          {round.highlight && (
            <p className="text-gray-400 text-sm italic">"{round.highlight}"</p>
          )}
        </div>
      )}
    </div>
  );
}

function SeasonMomentum({ rounds }) {
  const sorted = [...rounds].sort((a, b) => new Date(a.date) - new Date(b.date));
  let team1Running = 0;
  let team2Running = 0;

  const data = sorted.map((r) => {
    if (r.winner === "team1") team1Running++;
    else if (r.winner === "team2") team2Running++;
    return { ...r, team1Running, team2Running, diff: team1Running - team2Running };
  });

  if (data.length < 2) return null;

  const maxAbsDiff = Math.max(...data.map((d) => Math.abs(d.diff)), 1);

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-400" />
        Season Momentum
      </h3>
      <div className="relative h-32">
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600" />
        <div className="absolute top-0 left-0 text-xs text-gray-500">{TEAMS.team1.name}</div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-500">{TEAMS.team2.name}</div>

        {/* Bars */}
        <div className="flex items-center h-full gap-1 px-0">
          {data.map((d, i) => {
            const height = (Math.abs(d.diff) / maxAbsDiff) * 50;
            const isTeam1Leading = d.diff > 0;
            return (
              <div key={d.id} className="flex-1 relative h-full flex items-center">
                <div
                  className="w-full rounded-sm absolute"
                  style={{
                    height: `${Math.max(height, 4)}%`,
                    backgroundColor: d.diff === 0 ? "#6b7280" : isTeam1Leading ? TEAMS.team1.color : TEAMS.team2.color,
                    top: d.diff >= 0 ? `${50 - height}%` : "50%",
                    opacity: 0.8,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{formatDate(sorted[0].date)}</span>
        <span>{formatDate(sorted[sorted.length - 1].date)}</span>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [filter, setFilter] = useState("all");

  const filteredRounds = useMemo(() => {
    let r = [...ROUNDS].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filter !== "all") {
      r = r.filter((round) => round.gameMode === filter);
    }
    return r;
  }, [filter]);

  const stats = useMemo(() => getStats(ROUNDS), []);
  const gameModes = [...new Set(ROUNDS.map((r) => r.gameMode))];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(135deg, #0a1f12 0%, #1a3a2a 40%, #0f2318 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <HeroSection stats={stats} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TeamCard teamKey="team1" stats={stats} />
          <TeamCard teamKey="team2" stats={stats} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GameModeBreakdown byMode={stats.byMode} />
          <SeasonMomentum rounds={ROUNDS} />
        </div>

        {/* MVP of the Season */}
        {stats.topMvp && (
          <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 bg-opacity-30 rounded-xl p-4 border border-yellow-700 border-opacity-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-700 bg-opacity-50 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <p className="text-yellow-200 text-sm font-semibold">Season MVP</p>
              <p className="text-white font-bold">{stats.topMvp[0]}</p>
              <p className="text-yellow-300 text-xs">{stats.topMvp[1]} MVP awards</p>
            </div>
          </div>
        )}

        {/* Round History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Round History
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  filter === "all" ? "bg-green-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              {gameModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    filter === mode ? "bg-green-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredRounds.map((round, i) => (
              <RoundCard key={round.id} round={round} index={i} />
            ))}
          </div>

          {filteredRounds.length === 0 && (
            <p className="text-gray-500 text-center py-8">No rounds yet for this game mode.</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-600 text-xs">
            The Nordic Golf Rivalry — Season 2026
          </p>
          <p className="text-gray-700 text-xs mt-1">
            Built with questionable handicaps and undeniable ambition
          </p>
        </div>
      </div>
    </div>
  );
}
