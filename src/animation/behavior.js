// Created by Yesha Patel

export function createBehavior() {
    return {
        blinkTimer: 2 + Math.random() * 4,
        isBlinking: false,
        blinkDuration: 0,

        breathing: 0,

        lookDirection: 0,
        lookTimer: 2 + Math.random() * 3
    };
}

export function updateBehavior(character, deltaTime) {
    const behavior = character.behavior;

    // Blinking
    behavior.blinkTimer -= deltaTime;

    if (behavior.blinkTimer <= 0) {
        behavior.isBlinking = true;
        behavior.blinkDuration = 0.15;
        behavior.blinkTimer = 2 + Math.random() * 4;
    }

    if (behavior.isBlinking) {
        behavior.blinkDuration -= deltaTime;

        if (behavior.blinkDuration <= 0) {
            behavior.isBlinking = false;
        }
    }

    // Breathing
    behavior.breathing += deltaTime * 2;

    // Looking around
    behavior.lookTimer -= deltaTime;

    if (behavior.lookTimer <= 0) {
        behavior.lookDirection =
            Math.random() > 0.5 ? 1 : -1;

        behavior.lookTimer = 2 + Math.random() * 3;
    }
}
