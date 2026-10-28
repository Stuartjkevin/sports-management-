// =====================================================================
// The ONLY place that decides where data is stored.
// Controllers import these repositories and never touch storage directly.
//
// Data lives in MongoDB Atlas (one collection per repository). Each
// collection is seeded with the demo data below the first time it is empty.
// createMemoryRepository (store/memoryRepository.js) has the same methods
// and can still be swapped in for offline testing.
// =====================================================================
import { createMongoRepository } from '../store/mongoRepository.js';
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

export const userRepository = createMongoRepository('users', users);
export const clubRepository = createMongoRepository('clubs', clubs);
export const teamRepository = createMongoRepository('teams', teams);
export const playerRepository = createMongoRepository('players', players);
export const matchRepository = createMongoRepository('matches', matches);
export const tournamentRepository = createMongoRepository('tournaments', tournamentSeed);
export const trainingRepository = createMongoRepository('training_sessions', sessionSeed);
export const notificationRepository = createMongoRepository('notifications', notificationSeed);
