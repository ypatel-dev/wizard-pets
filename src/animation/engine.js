// Created by Yesha Patel
import {updateMovement} from './movement.js';
import {updateBehavior} from './behavior.js';

export function startAnimation(characters, render) {
    let previousTime = 0;
    let animationId;

    function animate(currentTime) {
        const deltaTime = previousTime ? Math.min((currentTime - previousTime) / 1000, 0.1) : 0;
        previousTime = currentTime;

        for (const character of characters) {
            updateMovement(character, deltaTime, window.innerWidth);
            updateBehavior(character, deltaTime);
        }
        render();

        animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
}