// =====================================================================
// The ONLY place that decides where data is stored.
// Controllers import these repositories and never touch storage directly.
//
// MongoDB phase: replace each createMemoryRepository(...) with a
// Mongoose-based repository that has the same methods
// (findAll, findById, findOne, create, update, updateMany, remove, count).
// =====================================================================
import { createMemoryRepository } from '../store/memoryRepository.js';
import { clubs } from '../data/clubs.js';
import { teams } from '../data/teams.js';
import { players } from '../data/players.js';
import { matches } from '../data/matches.js';
import { tournaments, standings } from '../data/tournaments.js';
import { trainingSessions, initialAttendance } from '../data/training.js';
import { notifications } from '../data/notifications.js';
import { users } from '../data/users.js';

// Standings and attendance are stored inside their parent document,
// which is also how they will look in MongoDB.
const tournamentSeed = tournaments.map((t) => ({ ...t, standings: standings[t.id] ?? [] }));
const sessionSeed = trainingSessions.map((s) => ({ ...s, attendance: initialAttendance[s.id] ?? {} }));

// Every user gets their own copy of the starter notifications.
const notificationSeed = users.flatMap((u) =>
  notifications.map((n) => ({ ...n, id: `${n.id}-${u.id}`, userId: u.id })),
);

export const userRepository = createMemoryRepository(users);
export const clubRepository = createMemoryRepository(clubs);
export const teamRepository = createMemoryRepository(teams);
export const playerRepository = createMemoryRepository(players);
export const matchRepository = createMemoryRepository(matches);
export const tournamentRepository = createMemoryRepository(tournamentSeed);
export const trainingRepository = createMemoryRepository(sessionSeed);
export const notificationRepository = createMemoryRepository(notificationSeed);
