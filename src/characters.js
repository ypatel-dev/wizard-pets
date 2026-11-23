
// Created by Yesha Patel

// Draws rounded shapes for the chibi characters.
export function drawCharacter(ctx, x, y, character) {
    ctx.save();

    const movement = character.movement;
    const behavior = character.behavior;

    // Character dimensions
    const WIDTH = 100;

    // Position character on the canvas.
    ctx.translate(x, y);

    // Flip character when walking left.
    if (movement.direction === -1) {
        ctx.translate(WIDTH, 0);
        ctx.scale(-1, 1);
    }

    // Breathing animation.
    const breathing = Math.sin(behavior.breathing) * 1.5;
    ctx.translate(0, breathing);

    // Helper function: rounded rectangle.
    const roundedRect = (x, y, w, h, r, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
    };

    // Helper function: ellipse.
    const ellipse = (x, y, rx, ry, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
    };

    // Character appearance.
    const skin = character.skin;
    const hair = character.hair;
    const eyes = character.eyes;
    const robe = character.robe;
    const robeLight = character.robeLight;
    const scarf = character.scarf;

    // -------------------------
    // SHOES
    // -------------------------

    ellipse(34, 119, 15, 7, '#292532');
    ellipse(66, 119, 15, 7, '#292532');

    // -------------------------
    // LEGS
    // -------------------------

    roundedRect(29, 99, 13, 20, 5, '#292532');
    roundedRect(58, 99, 13, 20, 5, '#292532');

    // -------------------------
    // ROBE
    // -------------------------

    roundedRect(17, 67, 66, 42, 15, robe);

    // Center of robe.
    roundedRect(43, 72, 14, 36, 4, robeLight);

    // Arms.
    ellipse(17, 84, 9, 17, robe);
    ellipse(83, 84, 9, 17, robe);

    // Hands.
    ellipse(17, 99, 6, 6, skin);
    ellipse(83, 99, 6, 6, skin);

    // -------------------------
    // SCARF
    // -------------------------

    roundedRect(35, 65, 30, 9, 4, scarf[0]);
    roundedRect(35, 72, 30, 4, 2, scarf[1]);
    roundedRect(57, 72, 9, 20, 3, scarf[0]);

    // -------------------------
    // HEAD
    // -------------------------

    // Back of hair.
    ellipse(50, 43, 35, 35, hair);

    // Face.
    ellipse(50, 47, 28, 27, skin);

    // -------------------------
    // HAIRSTYLE
    // -------------------------

    if (character.style === 'blonde') {

        // Draco's longer blonde hairstyle.
        ellipse(31, 28, 12, 17, hair);
        ellipse(50, 17, 22, 12, hair);
        ellipse(69, 29, 12, 16, hair);

        // Long side locks.
        ellipse(24, 47, 7, 18, hair);
        ellipse(76, 47, 7, 18, hair);

    } else {

        // Harry's messy hairstyle.
        ellipse(29, 25, 13, 12, hair);
        ellipse(45, 15, 14, 11, hair);
        ellipse(62, 19, 14, 13, hair);
        ellipse(74, 29, 9, 12, hair);
    }

    // -------------------------
    // EYES
    // -------------------------

    if (behavior.isBlinking) {

        // Closed eyes.
        ctx.strokeStyle = '#30252b';
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(35, 47);
        ctx.lineTo(43, 47);

        ctx.moveTo(57, 47);
        ctx.lineTo(65, 47);

        ctx.stroke();

    } else {

        // Eye movement.
        const eyeOffset = behavior.lookDirection * 1.5;

        // White parts of eyes.
        ellipse(39 + eyeOffset, 47, 4, 6, '#ffffff');
        ellipse(61 + eyeOffset, 47, 4, 6, '#ffffff');

        // Iris.
        ellipse(40 + eyeOffset, 48, 2.5, 4, eyes);
        ellipse(62 + eyeOffset, 48, 2.5, 4, eyes);

        // Eye highlights.
        ellipse(41 + eyeOffset, 46, 1, 1.5, '#ffffff');
        ellipse(63 + eyeOffset, 46, 1, 1.5, '#ffffff');
    }

    // -------------------------
    // GLASSES
    // -------------------------

    if (character.glasses) {

        ctx.strokeStyle = '#30252b';
        ctx.lineWidth = 2.5;

        // Left lens.
        ctx.beginPath();
        ctx.arc(39, 47, 9, 0, Math.PI * 2);
        ctx.stroke();

        // Right lens.
        ctx.beginPath();
        ctx.arc(61, 47, 9, 0, Math.PI * 2);
        ctx.stroke();

        // Bridge.
        ctx.beginPath();
        ctx.moveTo(48, 47);
        ctx.lineTo(52, 47);
        ctx.stroke();
    }

    // -------------------------
    // MOUTH
    // -------------------------

    ctx.strokeStyle = '#a94e60';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(50, 57, 4, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // Restore original canvas state.
    ctx.restore();
}


// -------------------------
// DRACO CHARACTER
// -------------------------

export const draco = {
    name: 'Draco',

    style: 'blonde',

    skin: '#f8dcc0',
    hair: '#f3e6a8',
    eyes: '#50a77c',

    robe: '#28543c',
    robeLight: '#376d4c',

    scarf: ['#28543c', '#d2c9b2'],

    glasses: false
};


// -------------------------
// HARRY CHARACTER
// -------------------------

export const harry = {
    name: 'Harry',

    style: 'messy',

    skin: '#e0ac69',
    hair: '#59351f',
    eyes: '#50c878',

    robe: '#7a1f2b',
    robeLight: '#a32c3b',

    scarf: ['#7a1f2b', '#e0b030'],

    glasses: true
};
