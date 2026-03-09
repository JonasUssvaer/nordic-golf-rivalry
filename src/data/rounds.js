/**
 * ROUND DATA — Edit this file to add new rounds!
 *
 * After adding a round:
 *   1. Save this file
 *   2. In Terminal: cd ~/nordic-golf-rivalry
 *   3. git add . && git commit -m "Add round at [course name]" && git push
 *   4. Vercel auto-deploys in ~30 seconds
 *
 * Game modes:
 *   "Scramble"  — Both hit, pick best ball, both play from there
 *   "Shamble"   — Both hit tee shot, pick best, play own ball from there
 *   "Best Ball"  — Everyone plays their own ball, best score on each hole counts
 */

export const TEAMS = {
  team1: {
    name: "Team Shotshaper",
    color: "#1a5632",
    players: [
      { name: "Christian Ulfsrud", nickname: "The Insurer", emoji: "🛡️" },
      { name: "Jonas Ussvær", nickname: "Shotshaper", emoji: "🎯" },
    ],
  },
  team2: {
    name: "Team Cyber",
    color: "#1e3a5f",
    players: [
      { name: "Hans Oscar Morstad", nickname: "Freeze, Cyber Security", emoji: "🧊" },
      { name: "Håkon Skår", nickname: "The Thinner", emoji: "✂️" },
    ],
  },
};

export const ROUNDS = [
  // ──────────────────────────────────────────────
  // EXAMPLE ROUNDS — Replace with real data!
  // ──────────────────────────────────────────────
  {
    id: 1,
    date: "2026-04-12",
    course: "Oslo Golfklubb",
    gameMode: "Scramble",
    team1Score: 66,
    team2Score: 69,
    team1Handicap: 18,
    team2Handicap: 20,
    winner: "team1",
    mvp: "Jonas Ussvær",
    highlight: "Jonas drained a 30-foot birdie putt on 17 to seal it.",
  },
  {
    id: 2,
    date: "2026-04-19",
    course: "Losby Golfklubb",
    gameMode: "Best Ball",
    team1Score: 71,
    team2Score: 68,
    team1Handicap: 18,
    team2Handicap: 20,
    winner: "team2",
    mvp: "Hans Oscar Morstad",
    highlight: "Hans Oscar went full cyber mode on the back nine — 3 birdies in a row.",
  },
  {
    id: 3,
    date: "2026-04-26",
    course: "Miklagard Golfklubb",
    gameMode: "Shamble",
    team1Score: 70,
    team2Score: 70,
    team1Handicap: 17,
    team2Handicap: 19,
    winner: "tie",
    mvp: null,
    highlight: "Dead heat. Both teams refused to lose. Rematch demanded.",
  },
  {
    id: 4,
    date: "2026-05-03",
    course: "Bærum Golfklubb",
    gameMode: "Scramble",
    team1Score: 64,
    team2Score: 67,
    team1Handicap: 17,
    team2Handicap: 19,
    winner: "team1",
    mvp: "Christian Ulfsrud",
    highlight: "The Insurer covered every risk — didn't miss a fairway all day.",
  },
  {
    id: 5,
    date: "2026-05-10",
    course: "Oslo Golfklubb",
    gameMode: "Best Ball",
    team1Score: 73,
    team2Score: 71,
    team1Handicap: 16,
    team2Handicap: 19,
    winner: "team2",
    mvp: "Håkon Skår",
    highlight: "The Thinner sliced through the competition. Eagle on 14.",
  },
];
