// Created by Yesha Patel
//
// Layered anime-style characters.
// Each character is a stack of transparent SVG layers that are drawn on top
// of each other. Because the layers are separate, each one can move a little
// differently (breathing, hair sway, blinking) without redrawing the art.


// -------------------------
// SIZE SETTINGS
// -------------------------

// Every layer (SVG or PNG) is drawn on the same 300 x 500 "art" canvas.
// A PNG layer can be any size with a 3:5 ratio (for example 600 x 1000);
// it is scaled to fit automatically.
export const ART_WIDTH = 300;
export const ART_HEIGHT = 500;

// How tall a character appears on screen (in pixels).
// Change this one number to make the pets bigger or smaller.
export const DISPLAY_HEIGHT = 300;

export const SCALE = DISPLAY_HEIGHT / ART_HEIGHT;
export const CHARACTER_WIDTH = ART_WIDTH * SCALE;


// -------------------------
// LAYER RECIPE (drawn from back to front)
// -------------------------
//
// name   : the SVG file name (without ".svg")
// bob    : how much this layer follows the breathing motion (0 = none, 1 = full)
// sway   : optional swinging motion, rotating around a pivot point
//          pivot   = [x, y] in art coordinates (where the layer "hangs" from)
//          degrees = how far it swings
//          speed   = how fast it swings
//          phase   = offset so layers don't all swing in sync
// when   : 'open' = only draw while eyes are open
//          'closed' = only draw while blinking
// look   : layer shifts a little when the character looks left/right

const LAYERS = [
    { name: 'hair_back',   bob: 0.6, sway: { pivot: [150, 40],  degrees: 1.4, speed: 1.3, phase: 0.0 } },
    { name: 'cloak_back',  bob: 0.3, sway: { pivot: [150, 186], degrees: 0.8, speed: 1.0, phase: 1.2 } },
    { name: 'body',        bob: 0.5 },
    { name: 'cloak_front', bob: 0.5 },
    { name: 'head',        bob: 1 },
    { name: 'eye_white',   bob: 1, when: 'open' },
    { name: 'iris',        bob: 1, when: 'open', look: true },
    { name: 'lids_open',   bob: 1, when: 'open' },
    { name: 'lids_closed', bob: 1, when: 'closed' },
    { name: 'brows',       bob: 1 },
    { name: 'hair_side_l', bob: 1, sway: { pivot: [112, 64], degrees: 2.2, speed: 1.5, phase: 0.4 } },
    { name: 'hair_side_r', bob: 1, sway: { pivot: [188, 64], degrees: 2.2, speed: 1.5, phase: 1.1 } },
    { name: 'hair_front',  bob: 1, sway: { pivot: [150, 34], degrees: 0.5, speed: 1.7, phase: 0.8 } },
    { name: 'accessories', bob: 1 }
];

// Strength of the breathing motion, in art units.
const BREATH_AMOUNT = 3.5;

// How far the eyes slide when looking left/right, in art units.
const LOOK_AMOUNT = 2.5;


// -------------------------
// IMAGE LOADING
// -------------------------

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Could not load image: ${url}`));
        img.src = url;
    });
}

// Loads every layer for one character and stores them in character.images.
//
// For each layer it tries a PNG first (your painted art), and if that file
// doesn't exist it falls back to the SVG placeholder. That means you can
// replace layers one at a time and the app keeps working the whole time.
export async function loadCharacterArt(character) {
    const images = {};

    // Sprite mode: one finished picture per character (full.png).
    if (character.sprite) {
        const url = new URL(
            `./assets/characters/${character.folder}/${character.sprite}.png`,
            import.meta.url
        ).href;

        images.full = await loadImage(url);
        character.images = images;
        return character;
    }

    // Layered mode: one picture per layer (see LAYERS above).
    await Promise.all(LAYERS.map(async (layer) => {
        // new URL(..., import.meta.url) builds the path relative to this file,
        // so it works no matter where Electron opens the page from.
        const base = new URL(
            `./assets/characters/${character.folder}/${layer.name}`,
            import.meta.url
        ).href;

        images[layer.name] = await loadImage(`${base}.png`)
            .catch(() => loadImage(`${base}.svg`));
    }));

    character.images = images;
    return character;
}


// -------------------------
// DRAWING
// -------------------------

// Draws one character with the same signature as before:
// drawCharacter(ctx, x, y, character)
export function drawCharacter(ctx, x, y, character) {
    const { movement, behavior, images } = character;

    if (!images) return; // art not loaded yet

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Position character on the canvas.
    ctx.translate(x, y);

    // Flip character when walking left.
    if (movement.direction === -1) {
        ctx.translate(CHARACTER_WIDTH, 0);
        ctx.scale(-1, 1);
    }

    // Stand the character on the bottom-centre of its box.
    // heightScale lets one character be taller than the other (1 = normal).
    const size = SCALE * (character.heightScale || 1);
    ctx.translate(CHARACTER_WIDTH / 2, DISPLAY_HEIGHT);
    ctx.scale(size, size);
    ctx.translate(-ART_WIDTH / 2, -ART_HEIGHT);

    // Everything below is measured in art units (300 x 500).
    const walking = movement.state === 'walking';

    // ---- SPRITE MODE: one picture, animated as a whole ----
    if (images.full) {
        const t = behavior.breathing;

        // Feet stay planted; the body gently grows and shrinks (breathing),
        // leans a little (sway), and bobs while walking.
        const breathe = 1 + Math.sin(t) * 0.006;
        const lean = Math.sin(t * 0.7) * (walking ? 0.9 : 0.5) * Math.PI / 180;
        const bob = walking ? -Math.abs(Math.sin(t * 3)) * 4 : 0;

        ctx.translate(ART_WIDTH / 2, ART_HEIGHT + bob);
        ctx.rotate(lean);
        ctx.scale(1, breathe);
        ctx.translate(-ART_WIDTH / 2, -ART_HEIGHT);

        ctx.drawImage(images.full, 0, 0, ART_WIDTH, ART_HEIGHT);
        ctx.restore();
        return;
    }

    // ---- LAYERED MODE ----
    const breathing = Math.sin(behavior.breathing) * BREATH_AMOUNT;
    const eyesOpen = !behavior.isBlinking;

    for (const layer of LAYERS) {

        // Skip eye layers that don't match the current blink state.
        if (layer.when === 'open' && !eyesOpen) continue;
        if (layer.when === 'closed' && eyesOpen) continue;

        ctx.save();

        // Breathing: move up and down.
        ctx.translate(0, breathing * layer.bob);

        // Looking around: slide the iris sideways.
        if (layer.look) {
            ctx.translate(behavior.lookDirection * LOOK_AMOUNT, 0);
        }

        // Hair and cloak sway: rotate around the pivot point.
        if (layer.sway) {
            const s = layer.sway;
            const angle = Math.sin(behavior.breathing * s.speed + s.phase)
                * s.degrees * Math.PI / 180;

            ctx.translate(s.pivot[0], s.pivot[1]);
            ctx.rotate(angle);
            ctx.translate(-s.pivot[0], -s.pivot[1]);
        }

        ctx.drawImage(images[layer.name], 0, 0, ART_WIDTH, ART_HEIGHT);

        ctx.restore();
    }

    // Restore original canvas state.
    ctx.restore();
}


// -------------------------
// DRACONIA CHARACTER
// -------------------------

export const draco = {
    name: 'Draconia',
    folder: 'draconia',

    // Sprite mode: use assets/characters/draconia/full.png.
    // Delete this line to switch to the 14-layer version later.
    sprite: 'full',

    heightScale: 1
};


// -------------------------
// HARRY CHARACTER
// -------------------------

export const harry = {
    name: 'Harry',
    folder: 'harry',

    // Sprite mode: use assets/characters/harry/full.png.
    // Delete this line to switch to the 14-layer version later.
    sprite: 'full',

    // Harry is a little taller than Draconia.
    heightScale: 1.1
};
