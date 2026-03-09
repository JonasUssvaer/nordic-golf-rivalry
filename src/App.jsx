import { useState, useMemo } from "react";
import {
  Trophy, Flag, TrendingUp, Calendar, MapPin, Star, Flame, Target,
  ChevronDown, ChevronUp, Clock, Camera, MessageCircle, Skull,
  Droplets, Wind, ThumbsDown, Play, AlertOctagon, CircleOff, Frown, Hash,
} from "lucide-react";
import { TEAMS, ROUNDS, NEXT_MATCH, HALL_OF_SHAME, SOCIAL_POSTS } from "./data/rounds";

// ─── Utilities ─────────────────────────────────────────────────────────────

function getStats(rounds) {
  const team1Wins = rounds.filter((r) => r.winner === "team1").length;
  const team2Wins = rounds.filter((r) => r.winner === "team2").length;
  const ties = rounds.filter((r) => r.winner === "tie").length;
  const total = rounds.length;
  const team1AvgScore = total > 0 ? rounds.reduce((s, r) => s + r.team1Score, 0) / total : 0;
  const team2AvgScore = total > 0 ? rounds.reduce((s, r) => s + r.team2Score, 0) / total : 0;
  const team1BestScore = total > 0 ? Math.min(...rounds.map((r) => r.team1Score)) : null;
  const team2BestScore = total > 0 ? Math.min(...rounds.map((r) => r.team2Score)) : null;

  let streak = { team: null, count: 0 };
  const sorted = [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const r of sorted) {
    if (r.winner === "tie") break;
    if (!streak.team) streak = { team: r.winner, count: 1 };
    else if (r.winner === streak.team) streak.count++;
    else break;
  }

  const mvpCounts = {};
  rounds.forEach((r) => { if (r.mvp) mvpCounts[r.mvp] = (mvpCounts[r.mvp] || 0) + 1; });
  const topMvp = Object.entries(mvpCounts).sort((a, b) => b[1] - a[1])[0];

  const byMode = {};
  rounds.forEach((r) => {
    if (!byMode[r.gameMode]) byMode[r.gameMode] = { team1: 0, team2: 0, ties: 0 };
    if (r.winner === "team1") byMode[r.gameMode].team1++;
    else if (r.winner === "team2") byMode[r.gameMode].team2++;
    else byMode[r.gameMode].ties++;
  });

  // Shame leaderboard
  const shameCounts = {};
  HALL_OF_SHAME.forEach((e) => { shameCounts[e.player] = (shameCounts[e.player] || 0) + 1; });
  const shameLeader = Object.entries(shameCounts).sort((a, b) => b[1] - a[1])[0];

  return { team1Wins, team2Wins, ties, total, team1AvgScore, team2AvgScore, team1BestScore, team2BestScore, streak, topMvp, byMode, shameLeader };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

const SHAME_ICONS = { water: Droplets, ob: Wind, whiff: CircleOff, temper: AlertOctagon, "4putt": Frown, shank: ThumbsDown, misc: Skull };
const SHAME_COLORS = { water: "text-blue-400", ob: "text-red-400", whiff: "text-purple-400", temper: "text-orange-400", "4putt": "text-yellow-400", shank: "text-pink-400", misc: "text-gray-400" };
const SHAME_LABELS = { water: "Water Ball", ob: "Out of Bounds", whiff: "Air Shot", temper: "Club Throw", "4putt": "4-Putt+", shank: "Shank", misc: "Other Disaster" };

// ─── Components ────────────────────────────────────────────────────────────

function PlayerAvatar({ player, size = "md" }) {
  const dims = size === "lg" ? "w-16 h-16" : size === "md" ? "w-10 h-10" : "w-8 h-8";
  const textSize = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";

  return (
    <div className={`${dims} rounded-full overflow-hidden bg-gray-700 flex-shrink-0`}>
      {player.photo ? (
        <img
          src={player.photo}
          alt={player.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentNode.classList.add("flex", "items-center", "justify-center");
            const span = document.createElement("span");
            span.textContent = player.emoji;
            span.className = textSize;
            e.target.parentNode.appendChild(span);
          }}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${textSize}`}>{player.emoji}</div>
      )}
    </div>
  );
}

function HeroSection({ stats }) {
  const leader = stats.team1Wins > stats.team2Wins ? "team1" : stats.team2Wins > stats.team1Wins ? "team2" : null;
  const margin = Math.abs(stats.team1Wins - stats.team2Wins);
  const noRounds = stats.total === 0;

  return (
    <div className="text-center py-10 px-4">
      <p className="text-green-400 uppercase tracking-widest text-xs font-semibold mb-3">Season 2026</p>
      <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
        Bang Average Tour
      </h1>
      <p className="text-green-300 text-sm mb-10">Four guys. Two teams. Questionable handicaps. Undeniable ambition.</p>

      {/* Scoreboard */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="text-right flex-1">
          <p className="text-green-300 text-xs uppercase tracking-wider mb-1">{TEAMS.team1.name}</p>
          <p className="text-6xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>{stats.team1Wins}</p>
        </div>
        <div className="flex flex-col items-center px-5">
          <span className="text-2xl text-green-600 font-light">vs</span>
          {stats.ties > 0 && <span className="text-green-600 text-xs mt-1">{stats.ties} ties</span>}
        </div>
        <div className="text-left flex-1">
          <p className="text-green-300 text-xs uppercase tracking-wider mb-1">{TEAMS.team2.name}</p>
          <p className="text-6xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>{stats.team2Wins}</p>
        </div>
      </div>

      {noRounds && (
        <span className="text-green-500 text-sm">Season hasn't started yet.</span>
      )}

      {leader && (
        <div className="inline-flex items-center gap-2 bg-green-900 bg-opacity-50 rounded-full px-4 py-1.5">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-green-200 text-sm">{TEAMS[leader].name} leads by {margin}</span>
        </div>
      )}

      {stats.streak.count >= 2 && (
        <div className="mt-3 inline-flex items-center gap-2 bg-orange-900 bg-opacity-40 rounded-full px-4 py-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-200 text-sm">{TEAMS[stats.streak.team].name} — {stats.streak.count}-round win streak</span>
        </div>
      )}
    </div>
  );
}

function NextMatchCard() {
  if (!NEXT_MATCH) return null;
  const days = daysUntil(NEXT_MATCH.date);
  const isToday = days === 0;
  const isPast = days < 0;

  return (
    <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-5 border border-green-700 border-opacity-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-300" />
          Next Match
        </h3>
        {!isPast && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            isToday ? "bg-yellow-500 text-black" : days <= 3 ? "bg-orange-600 bg-opacity-40 text-orange-200" : "bg-green-700 bg-opacity-60 text-green-200"
          }`}>
            {isToday ? "TODAY" : `${days} day${days === 1 ? "" : "s"}`}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-green-400 text-xs uppercase tracking-wider mb-1">When</p>
          <p className="text-white">{formatDate(NEXT_MATCH.date)}{NEXT_MATCH.time && ` — ${NEXT_MATCH.time}`}</p>
        </div>
        <div>
          <p className="text-green-400 text-xs uppercase tracking-wider mb-1">Where</p>
          <p className="text-white flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-green-400" />{NEXT_MATCH.course}</p>
        </div>
        <div>
          <p className="text-green-400 text-xs uppercase tracking-wider mb-1">Format</p>
          <p className="text-white">{NEXT_MATCH.gameMode}</p>
        </div>
        {NEXT_MATCH.notes && (
          <div>
            <p className="text-green-400 text-xs uppercase tracking-wider mb-1">Notes</p>
            <p className="text-green-200 italic text-sm">"{NEXT_MATCH.notes}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCard({ teamKey, stats }) {
  const team = TEAMS[teamKey];
  const wins = teamKey === "team1" ? stats.team1Wins : stats.team2Wins;
  const avg = teamKey === "team1" ? stats.team1AvgScore : stats.team2AvgScore;
  const best = teamKey === "team1" ? stats.team1BestScore : stats.team2BestScore;
  const winPct = stats.total > 0 ? ((wins / stats.total) * 100).toFixed(0) + "%" : "—";

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-3 h-8 rounded-full" style={{ backgroundColor: team.color }} />
        <h3 className="text-white font-bold text-base">{team.name}</h3>
      </div>

      {/* Players with photos */}
      <div className="space-y-3 mb-5">
        {team.players.map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <PlayerAvatar player={p} size="md" />
            <div>
              <p className="text-white text-sm font-medium">{p.name}</p>
              <p className="text-gray-500 text-xs italic">"{p.nickname}"</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xl font-bold text-white">{winPct}</p>
          <p className="text-gray-500 text-xs">Win Rate</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{avg > 0 ? avg.toFixed(1) : "—"}</p>
          <p className="text-gray-500 text-xs">Avg Score</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{best ?? "—"}</p>
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
                {record.team1 > 0 && <div className="h-full" style={{ width: `${(record.team1/total)*100}%`, backgroundColor: TEAMS.team1.color }} />}
                {record.ties > 0 && <div className="h-full bg-gray-500" style={{ width: `${(record.ties/total)*100}%` }} />}
                {record.team2 > 0 && <div className="h-full" style={{ width: `${(record.team2/total)*100}%`, backgroundColor: TEAMS.team2.color }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoundCard({ round }) {
  const [expanded, setExpanded] = useState(false);
  const t1Win = round.winner === "team1";
  const t2Win = round.winner === "team2";
  const tie = round.winner === "tie";
  const color = t1Win ? TEAMS.team1.color : t2Win ? TEAMS.team2.color : "#6b7280";

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors" onClick={() => setExpanded(!expanded)}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(round.date)}</span>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{round.gameMode}</span>
          </div>
          <span className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{round.course}</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 text-right">
            <p className="text-gray-500 text-xs mb-0.5">{TEAMS.team1.name}</p>
            <p className={`text-3xl font-bold ${t1Win ? "text-green-400" : tie ? "text-yellow-400" : "text-gray-500"}`}>{round.team1Score}</p>
          </div>
          <div className="flex flex-col items-center">
            {tie ? <span className="text-yellow-400 text-sm font-semibold">TIE</span> : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-500 text-xs mb-0.5">{TEAMS.team2.name}</p>
            <p className={`text-3xl font-bold ${t2Win ? "text-green-400" : tie ? "text-yellow-400" : "text-gray-500"}`}>{round.team2Score}</p>
          </div>
        </div>
        <div className="flex justify-center mt-2">{expanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}</div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-700 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Handicaps: {round.team1Handicap} vs {round.team2Handicap}</span>
            <span>{tie ? "Dead even" : `Won by ${Math.abs(round.team1Score - round.team2Score)}`}</span>
          </div>
          {round.mvp && (
            <div className="flex items-center gap-2 bg-yellow-900 bg-opacity-20 rounded-lg px-3 py-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-200 text-sm">MVP: {round.mvp}</span>
            </div>
          )}
          {round.highlight && <p className="text-gray-400 text-sm italic">"{round.highlight}"</p>}
        </div>
      )}
    </div>
  );
}

function SeasonMomentum({ rounds }) {
  const sorted = [...rounds].sort((a, b) => new Date(a.date) - new Date(b.date));
  let t1 = 0, t2 = 0;
  const data = sorted.map((r) => {
    if (r.winner === "team1") t1++;
    else if (r.winner === "team2") t2++;
    return { ...r, t1, t2, diff: t1 - t2 };
  });
  if (data.length < 2) return null;
  const max = Math.max(...data.map((d) => Math.abs(d.diff)), 1);

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-400" />Season Momentum
      </h3>
      <div className="relative h-32">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600" />
        <div className="absolute top-0 left-0 text-xs text-gray-500">Short Drives</div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-500">Three off Tee</div>
        <div className="flex items-center h-full gap-1">
          {data.map((d) => {
            const h = (Math.abs(d.diff) / max) * 50;
            return (
              <div key={d.id} className="flex-1 relative h-full flex items-center">
                <div className="w-full rounded-sm absolute" style={{
                  height: `${Math.max(h, 4)}%`,
                  backgroundColor: d.diff === 0 ? "#6b7280" : d.diff > 0 ? TEAMS.team1.color : TEAMS.team2.color,
                  top: d.diff >= 0 ? `${50 - h}%` : "50%", opacity: 0.8,
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── HALL OF SHAME ─────────────────────────────────────────────────────────

function HallOfShame() {
  const allPlayers = [...TEAMS.team1.players, ...TEAMS.team2.players];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-950 to-gray-900 rounded-xl p-6 border border-red-900 border-opacity-40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-red-900 bg-opacity-50 flex items-center justify-center">
            <Skull className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Hall of Shame</h2>
            <p className="text-red-300 text-xs">Where golf's worst moments live forever</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Every shanked drive, every lake ball, every impossible 4-putt. If it happened on the course and it was embarrassing, it belongs here. Photos encouraged. Mercy not included.
        </p>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(SHAME_LABELS).map(([key, label]) => {
            const Icon = SHAME_ICONS[key];
            return (
              <span key={key} className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 bg-opacity-60 rounded-full px-2.5 py-1">
                <Icon className={`w-3 h-3 ${SHAME_COLORS[key]}`} />
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Shame entries */}
      {HALL_OF_SHAME.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <p className="text-5xl mb-3">🏌️‍♂️💨</p>
          <p className="text-gray-400 text-sm">No disasters recorded. Yet.</p>
          <p className="text-gray-600 text-xs mt-1">The season is young. The shame will come.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {HALL_OF_SHAME.map((entry) => {
            const Icon = SHAME_ICONS[entry.category] || Skull;
            const colorClass = SHAME_COLORS[entry.category] || "text-gray-400";
            const label = SHAME_LABELS[entry.category] || "Disaster";
            const player = allPlayers.find((p) => p.name === entry.player);

            return (
              <div key={entry.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Photo if available */}
                {entry.photo && (
                  <div className="relative">
                    <img src={entry.photo} alt={entry.title} className="w-full object-cover" style={{ maxHeight: "250px" }} />
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
                      <span className="text-white text-xs font-medium">{label}</span>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {!entry.photo && (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className={`w-5 h-5 ${colorClass}`} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-semibold">{entry.title}</h4>
                        {!entry.photo && (
                          <span className={`text-xs flex items-center gap-1 ${colorClass}`}>
                            <Icon className="w-3 h-3" />{label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        {player && <PlayerAvatar player={player} size="sm" />}
                        <span className="text-gray-400 text-sm">{entry.player}</span>
                        <span className="text-gray-600 text-xs">|</span>
                        <span className="text-gray-500 text-xs">{formatDate(entry.date)}</span>
                        {entry.hole && (
                          <>
                            <span className="text-gray-600 text-xs">|</span>
                            <span className="text-gray-500 text-xs flex items-center gap-0.5">
                              <Flag className="w-3 h-3" />Hole {entry.hole}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{entry.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SOCIAL BOARD ──────────────────────────────────────────────────────────

function SocialBoard() {
  const allPlayers = [...TEAMS.team1.players, ...TEAMS.team2.players];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-950 to-gray-900 rounded-xl p-6 border border-purple-900 border-opacity-40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-purple-900 bg-opacity-50 flex items-center justify-center">
            <Camera className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Social Board</h2>
            <p className="text-purple-300 text-xs">On-course moments, post-round banter, and questionable celebrations</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Photos, videos, and hot takes from the boys. The good shots, the bad swings, and the even worse excuses.
        </p>
      </div>

      {/* Posts */}
      {SOCIAL_POSTS.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <p className="text-5xl mb-3">📸</p>
          <p className="text-gray-400 text-sm">No posts yet.</p>
          <p className="text-gray-600 text-xs mt-1">Season memories will appear here — the good, the bad, and the shanked.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {SOCIAL_POSTS.map((post) => {
            const player = allPlayers.find((p) => p.name === post.author);

            return (
              <div key={post.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Author header */}
                <div className="p-4 pb-3 flex items-center gap-3">
                  {player ? <PlayerAvatar player={player} size="sm" /> : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{post.author}</p>
                    <p className="text-gray-500 text-xs">{formatDate(post.date)}</p>
                  </div>
                </div>

                {/* Media */}
                {post.type === "image" && post.url && (
                  <div className="bg-gray-900">
                    <img src={post.url} alt={post.caption || ""} className="w-full object-cover" style={{ maxHeight: "400px" }} />
                  </div>
                )}
                {post.type === "video" && post.url && (
                  <div className="bg-gray-900">
                    <video src={post.url} controls className="w-full" style={{ maxHeight: "400px" }} preload="metadata" />
                  </div>
                )}

                {/* Caption */}
                {post.caption && (
                  <div className="px-4 py-3">
                    <p className="text-gray-300 text-sm">
                      <span className="text-white font-medium">{post.author.split(" ")[0]}</span>{" "}
                      {post.caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────

export default function App() {
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("scoreboard");

  const filteredRounds = useMemo(() => {
    let r = [...ROUNDS].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filter !== "all") r = r.filter((round) => round.gameMode === filter);
    return r;
  }, [filter]);

  const stats = useMemo(() => getStats(ROUNDS), []);
  const gameModes = [...new Set(ROUNDS.map((r) => r.gameMode))];

  const tabs = [
    { id: "scoreboard", label: "Scoreboard", icon: Trophy },
    { id: "shame", label: "Wall of Shame", icon: Skull, count: HALL_OF_SHAME.length },
    { id: "social", label: "Social", icon: Camera, count: SOCIAL_POSTS.length },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #071a0e 0%, #132e1c 35%, #0d1f14 70%, #091510 100%)" }}>
        <div className="max-w-2xl mx-auto">
          <HeroSection stats={stats} />
        </div>
      </div>

      {/* Tab Navigation — sticky */}
      <div className="sticky top-0 z-10 bg-gray-900 bg-opacity-95 backdrop-blur border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "bg-green-800 bg-opacity-40 text-green-300" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-gray-700 text-gray-400 text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* ── SCOREBOARD ── */}
        {activeTab === "scoreboard" && (
          <>
            <NextMatchCard />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TeamCard teamKey="team1" stats={stats} />
              <TeamCard teamKey="team2" stats={stats} />
            </div>

            {ROUNDS.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GameModeBreakdown byMode={stats.byMode} />
                <SeasonMomentum rounds={ROUNDS} />
              </div>
            )}

            {stats.topMvp && (
              <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 bg-opacity-30 rounded-xl p-4 border border-yellow-700 border-opacity-40 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-700 bg-opacity-40 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <p className="text-yellow-200 text-sm font-semibold">Season MVP</p>
                  <p className="text-white font-bold">{stats.topMvp[0]}</p>
                  <p className="text-yellow-400 text-xs">{stats.topMvp[1]} MVP award{stats.topMvp[1] > 1 ? "s" : ""}</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-400" />Round History
                </h2>
                {gameModes.length > 0 && (
                  <div className="flex gap-1">
                    <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-full text-xs ${filter === "all" ? "bg-green-700 text-white" : "bg-gray-800 text-gray-400"}`}>All</button>
                    {gameModes.map((m) => (
                      <button key={m} onClick={() => setFilter(m)} className={`px-3 py-1 rounded-full text-xs ${filter === m ? "bg-green-700 text-white" : "bg-gray-800 text-gray-400"}`}>{m}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {filteredRounds.map((r) => <RoundCard key={r.id} round={r} />)}
              </div>
              {filteredRounds.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">⛳</p>
                  <p className="text-gray-400 text-sm">No rounds played yet.</p>
                  <p className="text-gray-600 text-xs mt-1">Get out there and settle this.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── WALL OF SHAME ── */}
        {activeTab === "shame" && <HallOfShame />}

        {/* ── SOCIAL ── */}
        {activeTab === "social" && <SocialBoard />}

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-600 text-xs">Bang Average Tour — Season 2026</p>
          <p className="text-gray-700 text-xs mt-1">Built with questionable handicaps and undeniable ambition</p>
        </div>
      </div>
    </div>
  );
}
