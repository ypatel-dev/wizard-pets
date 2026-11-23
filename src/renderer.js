
// Created By Yesha Patel

import {
    drawCharacter,
    draco,
    harry
} from './characters.js';

import { createMovement } from './animation/movement.js';
import { createBehavior } from './animation/behavior.js';
import { startAnimation } from './animation/engine.js';


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

        // Combine appearance, movement, and behavior.
        const animatedCharacter = {
            ...character.data,
            movement: character.movement,
            behavior: character.behavior
        };

        // Draw character at its current position.
        drawCharacter(
            ctx,
            character.movement.x,
            height - 140,
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

resizeCanvas();

const stopAnimation = startAnimation(
    characters,
    renderCharacters
);


// -------------------------
// CLEANUP
// -------------------------

window.addEventListener('beforeunload', () => {
    stopAnimation();
    window.removeEventListener('resize', resizeCanvas);
});
