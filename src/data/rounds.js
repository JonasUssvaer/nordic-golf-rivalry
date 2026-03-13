/**
 * BANG AVERAGE TOUR — Season 2026
 * ================================
 * Edit this file to add rounds, shame entries, and social posts.
 *
 * After editing:
 *   1. Save this file
 *   2. In Terminal: cd ~/nordic-golf-rivalry
 *   3. git add . && git commit -m "description" && git push
 *   4. Vercel auto-deploys in ~30 seconds
 *
 * Game modes:
 *   "Scramble"  — Both hit, pick best ball, both play from there
 *   "Shamble"   — Both hit tee shot, pick best, play own ball from there
 *   "Best Ball" — Everyone plays own ball, best score on each hole counts
 */

export const TEAMS = {
  team1: {
    name: "Tall Boys with Short Drives",
    color: "#1a5632",
    players: [
      {
        name: "Christian Ulfsrud",
        nickname: "The Insurer",
        emoji: "🛡️",
        photo: "/media/christian.jpg",
      },
      {
        name: "Jonas Ussvær",
        nickname: "Shotshaper",
        emoji: "🎯",
        photo: "/media/jonas.jpg",
      },
    ],
  },
  team2: {
    name: "Two Boys but Three off the Tee",
    color: "#1e3a5f",
    players: [
      {
        name: "Hans Oscar Morstad",
        nickname: "Freeze, Cyber Security",
        emoji: "🧊",
        photo: "/media/hans-oscar.jpg",
      },
      {
        name: "Håkon Skår",
        nickname: "The Thinner",
        emoji: "✂️",
        photo: "/media/hakon.jpg",
      },
    ],
  },
};

// ──────────────────────────────────────────────
// PLANNED ROUNDS — Add upcoming rounds here.
// They appear in the Calendar tab, sorted by date.
// The nearest upcoming round is also shown on the Scoreboard.
// ──────────────────────────────────────────────
export const PLANNED_ROUNDS = [
  {
    id: "planned-1",
    date: "2026-03-21",
    time: "TBD",
    course: "TBD",
    gameMode: "Shamble",
    notes: "Christian med ny driver, Håkon med ny dame. Let the season begin!",
  },
];

// ──────────────────────────────────────────────
// ROUNDS — Add real rounds as the season goes
// ──────────────────────────────────────────────
export const ROUNDS = [
  // {
  //   id: 1,
  //   date: "2026-04-18",
  //   course: "Oslo Golfklubb",
  //   gameMode: "Scramble",
  //   team1Score: 68,
  //   team2Score: 71,
  //   team1Handicap: 18,
  //   team2Handicap: 20,
  //   winner: "team1",  // "team1", "team2", or "tie"
  //   mvp: "Jonas Ussvær",
  //   highlight: "Shotshaper shaped a shot. Obviously.",
  // },
];

// ──────────────────────────────────────────────
// HALL OF SHAME
// The place where golf's worst moments live forever.
// Every shanked drive, every lake ball, every 4-putt.
// Add a photo if you caught it on camera.
//
// Categories: "water", "ob", "whiff", "temper", "4putt", "shank", "misc"
// ──────────────────────────────────────────────
export const HALL_OF_SHAME = [
  // {
  //   id: 1,
  //   date: "2026-04-18",
  //   round: 1,            // which round number (matches ROUNDS id)
  //   hole: 7,             // which hole
  //   player: "Håkon Skår",
  //   title: "The Lake Ball Collection",
  //   description: "Topped it straight into the water. Dropped, topped it again. Same water. New ball, same result. Three balls sleeping with the fish on a single par 3.",
  //   category: "water",
  //   photo: "/media/shame-hakon-hole7.jpg",  // optional — put image in public/media/
  // },
];

// ──────────────────────────────────────────────
// SOCIAL BOARD
// Post-round banter, on-course moments, celebration pics.
// Supports images, videos, and text-only posts.
//
// For images/videos: save file to public/media/ and use "/media/filename.jpg"
// For text-only posts: set type to "text" and skip the url field
// ──────────────────────────────────────────────
export const SOCIAL_POSTS = [
  // {
  //   id: 1,
  //   date: "2026-04-18",
  //   author: "Jonas Ussvær",
  //   type: "image",       // "image", "video", or "text"
  //   url: "/media/round1-win.jpg",
  //   caption: "Christian already making excuses on hole 1. Some things never change.",
  // },
  // {
  //   id: 2,
  //   date: "2026-04-18",
  //   author: "Håkon Skår",
  //   type: "text",
  //   caption: "I demand a recount. There's no way that was OB.",
  // },

  {
    id: 1,
    date: "2026-03-13",
    author: "Jonas Ussvær",
    type: "text",
    caption: "Ikke ",
  },
  {
    id: 2,
    date: "2026-03-13",
    author: "Håkon Skår",
    type: "text",
    caption: " Christian sine drives er like skeiv som Hanso!!!",
  }
];
