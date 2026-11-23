//Created by Yesha Patel on 11/20/26

export function createMovement(x,speed){
    return {
        x,
        speed,
        direction: Math.random() > 0.5 ? 1 : -1,
        state: 'idle',
        idleTimer: 0
    };
}

export function updateMovement(character, deltaTime, screenWidth){
    const movement = character.movement;

    if (movement.state === 'walking') {
        movement.x += movement.speed * movement.direction * deltaTime;

        if (movement.x <= 10) {
            movement.x = 10;
            movement.direction = 1;
        } 
        if (movement.x >= screenWidth - 100) {
            movement.x = screenWidth - 100;
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