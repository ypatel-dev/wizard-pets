//Created by Yesha Patel
//
// The "director": watches both characters and now and then makes them
// interact. Right now there is one interaction, a meet-up:
//   1. One character walks over to the other (the other waits).
//   2. They stand facing each other for a few seconds.
//   3. They go back to wandering on their own.
//
// To add more interactions later (following each other, waving, sitting
// together), add a new phase to update() below.

import { CHARACTER_WIDTH } from '../characters.js';

// How close they stand when they meet (pixels between their left edges).
const MEET_GAP = CHARACTER_WIDTH * 0.8;

// Timing, in seconds.
const APART_MIN = 10;
const APART_MAX = 25;
const CHAT_MIN = 4;
const CHAT_MAX = 8;
const GIVE_UP_AFTER = 25;   // stop walking over if it takes too long

const rand = (min, max) => min + Math.random() * (max - min);

export function createDirector(characters) {
    return {
        characters,
        phase: 'apart',          // 'apart' | 'approaching' | 'chat'
        timer: rand(APART_MIN, APART_MAX),
        walker: null,            // the character walking over
        waiter: null,            // the character standing still
        side: 1                  // which side of the waiter the walker stops on
    };
}

function faceEachOther(a, b) {
    a.movement.direction = b.movement.x >= a.movement.x ? 1 : -1;
    b.movement.direction = a.movement.x >= b.movement.x ? 1 : -1;
}

function clampX(x, screenWidth) {
    return Math.max(10, Math.min(screenWidth - CHARACTER_WIDTH, x));
}

export function updateDirector(director, deltaTime, screenWidth) {
    const [first, second] = director.characters;
    if (!first || !second) return;

    director.timer -= deltaTime;

    // ---- APART: wander freely until it is time to meet ----
    if (director.phase === 'apart') {
        if (director.timer > 0) return;

        // Pick who walks over and who waits.
        const firstWalks = Math.random() > 0.5;
        director.walker = firstWalks ? first : second;
        director.waiter = firstWalks ? second : first;

        // The waiter stands still until the walker arrives.
        director.waiter.movement.state = 'idle';
        director.waiter.movement.idleTimer = GIVE_UP_AFTER;

        director.phase = 'approaching';
        director.timer = GIVE_UP_AFTER;
        return;
    }

    const walker = director.walker;
    const waiter = director.waiter;

    // ---- APPROACHING: walker heads for the spot next to the waiter ----
    if (director.phase === 'approaching') {
        // Stop on whichever side the walker is already on (if there is room).
        const side = walker.movement.x <= waiter.movement.x ? -1 : 1;
        let goalX = waiter.movement.x + side * MEET_GAP;

        // If that spot is off-screen, use the other side.
        if (goalX < 10 || goalX > screenWidth - CHARACTER_WIDTH) {
            goalX = waiter.movement.x - side * MEET_GAP;
        }
        goalX = clampX(goalX, screenWidth);

        walker.movement.target = goalX;

        const arrived = Math.abs(walker.movement.x - goalX) <= 8;

        if (arrived || director.timer <= 0) {
            const chatTime = rand(CHAT_MIN, CHAT_MAX);

            for (const c of [walker, waiter]) {
                c.movement.target = null;
                c.movement.state = 'idle';
                c.movement.idleTimer = chatTime;
            }

            faceEachOther(walker, waiter);

            director.phase = 'chat';
            director.timer = chatTime;
        }
        return;
    }

    // ---- CHAT: stand facing each other for a while ----
    if (director.phase === 'chat') {
        faceEachOther(walker, waiter);

        if (director.timer <= 0) {
            director.phase = 'apart';
            director.timer = rand(APART_MIN, APART_MAX);
            director.walker = null;
            director.waiter = null;
        }
    }
}