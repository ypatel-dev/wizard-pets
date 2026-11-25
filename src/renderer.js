// Created By Yesha Patel

import {
    drawCharacter,
    loadCharacterArt,
    DISPLAY_HEIGHT,
    draco,
    harry
} from './characters.js';

import { createMovement } from './animation/movement.js';
import { createBehavior } from './animation/behavior.js';
import { startAnimation } from './animation/engine.js';
import { createDirector, updateDirector } from './animation/interactions.js';


// -------------------------
// CANVAS SETUP
// -------------------------

const canvas = document.getElementById('desktopCanvas');

if (!canvas) {
    throw new Error('Could not find canvas element: desktopCanvas');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error('Could not create 2D canvas context.');
}


// -------------------------
// CHARACTER SETUP
// -------------------------

const characters = [
    {
        data: draco,
        movement: createMovement(150, 65),
        behavior: createBehavior()
    },
    {
        data: harry,
        movement: createMovement(400, 75),
        behavior: createBehavior()
    }
];


// -------------------------
// CANVAS RESIZING
// -------------------------

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Scale drawing coordinates for Retina displays.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}


// -------------------------
// CHARACTER RENDERING
// -------------------------

function renderCharacters() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear the previous frame.
    ctx.clearRect(0, 0, width, height);

    for (const character of characters) {

        // Combine appearance (including loaded art), movement, and behavior.
        const animatedCharacter = {
            ...character.data,
            movement: character.movement,
            behavior: character.behavior
        };

        // Draw character at its current position,
        // standing on the bottom edge of the screen.
        drawCharacter(
            ctx,
            character.movement.x,
            height - DISPLAY_HEIGHT,
            animatedCharacter
        );
    }
}


// -------------------------
// EVENT LISTENERS
// -------------------------

window.addEventListener('resize', resizeCanvas);


// -------------------------
// START APPLICATION
// -------------------------

let stopAnimation = () => {};

async function start() {
    resizeCanvas();

    try {
        // Wait until every layer image has loaded before animating.
        await Promise.all(characters.map((c) => loadCharacterArt(c.data)));
    } catch (error) {
        console.error('Character art failed to load:', error);
        return;
    }

    // The director makes the two characters meet up now and then.
    const director = createDirector(characters);

    stopAnimation = startAnimation(
        characters,
        renderCharacters,
        (deltaTime) => updateDirector(director, deltaTime, window.innerWidth)
    );
}

start();


// -------------------------
// CLEANUP
// -------------------------

window.addEventListener('beforeunload', () => {
    stopAnimation();
    window.removeEventListener('resize', resizeCanvas);
});
