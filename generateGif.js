import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import path from 'path';
import { GIFEncoder, quantize, applyPalette } from 'gifencoder';
import fs from 'fs';
import UPNG from 'upng-js';

const TIME = 10;
const FPS = 2.5;
const TOTAL_FRAMES = TIME * FPS;
const TIME_BETWEEN_FRAMES = 1000 / FPS;
const WIDTH = 1116 + 10;
const HEIGHT = 201 + 10;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATH = 'file://' + path.join(__dirname, 'index.html');

const browser = await puppeteer.launch();
const page = await browser.newPage();

const sleep = ms => new Promise(r => setTimeout(r, ms));

await page.goto(PATH);
await page.setViewport({width: WIDTH, height: HEIGHT});

await sleep(1000); // Wait game to render

for (var frame = 0; frame < TOTAL_FRAMES; frame++) {
    await page.screenshot({ path: `frames/frame${frame}.png` });
    await sleep(TIME_BETWEEN_FRAMES);
}

await browser.close();

const gif = GIFEncoder({ width: WIDTH, height: HEIGHT });

for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const data = UPNG.toRGBA8(UPNG.decode(fs.readFileSync(`frames/frame${frame}.png`)))[0];

    const palette = quantize(data, 256);
    const indexData = applyPalette(data, palette);

    gif.writeFrame(indexData, WIDTH, HEIGHT, { palette });
}

gif.finish();
fs.writeFileSync('public/game.gif', gif.bytes());