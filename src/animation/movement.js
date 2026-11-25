/Created by Yesha Patel on 11/20/26

import { CHARACTER_WIDTH } from '../characters.js';

export function createMovement(x,speed){
    return {
        x,
        speed,
        direction: Math.random() > 0.5 ? 1 : -1,
        state: 'idle',
        idleTimer: 0,

        // When this is a number, the character walks straight to that x
        // position instead of wandering. The director (interactions.js)
        // uses it. null = wander freely, as before.
        target: null
    };
}

export function updateMovement(character, deltaTime, screenWidth){
    const movement = character.movement;

    // Walking to a target (used for interactions).
    if (movement.target !== null) {
        const distance = movement.target - movement.x;

        if (Math.abs(distance) <= 4) {
            movement.x = movement.target;
            movement.target = null;
            movement.state = 'idle';
            movement.idleTimer = 2;
        } else {
            const step = movement.speed * deltaTime;
            movement.direction = distance > 0 ? 1 : -1;
            movement.state = 'walking';
            movement.x += Math.sign(distance) * Math.min(step, Math.abs(distance));
        }
        return;
    }

    if (movement.state === 'walking') {
        movement.x += movement.speed * movement.direction * deltaTime;

        if (movement.x <= 10) {
            movement.x = 10;
            movement.direction = 1;
        } 
        // The character is now CHARACTER_WIDTH pixels wide (was a fixed 100).
        if (movement.x >= screenWidth - CHARACTER_WIDTH) {
            movement.x = screenWidth - CHARACTER_WIDTH;
            movement.direction = -1;
        }
    }
    movement.idleTimer -= deltaTime;

    if (movement.idleTimer <= 0) {
        if (movement.state === 'idle') {
            movement.state = 'walking';
            movement.idleTimer = 3 + Math.random() * 4;
        } else {
            movement.state = 'idle';
            movement.idleTimer = 1.5 + Math.random() * 3;
        }
    }
}