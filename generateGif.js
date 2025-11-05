import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import GIFEncoder from 'gif-encoder-2';
import { createCanvas, loadImage } from 'canvas';

const TIME = 15;
const FPS = 2.5;
const TOTAL_FRAMES = TIME * FPS;
const TIME_BETWEEN_FRAMES = 1000 / FPS;
const WIDTH = 1170;
const HEIGHT = 257;
const THEME = Object.freeze({
    DARK:   'dark',
    LIGHT:  'light'
});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATH = 'file://' + path.join(__dirname, 'index.html');

async function generateFrames(theme) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(PATH);
    await page.setViewport({width: WIDTH, height: HEIGHT});
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await sleep(1000); // Wait game to render

    fs.mkdirSync("frames", { recursive: true });
    for (var frame = 0; frame < TOTAL_FRAMES; frame++) {
        await page.screenshot({ path: `frames/frame_${theme}_${frame}.png` });
        await sleep(TIME_BETWEEN_FRAMES);
    }

    await browser.close();
}

async function generateGif(theme) {
    const gif = new GIFEncoder(WIDTH, HEIGHT);
    gif.start();
    gif.setRepeat(0);
    gif.setDelay(TIME_BETWEEN_FRAMES);
    gif.setQuality(10);

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
        const img = await loadImage(`frames/frame_${theme}_${frame}.png`);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);

        const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        gif.addFrame(imageData.data);
    }

    gif.finish();
    fs.mkdirSync("public", { recursive: true });
    fs.writeFileSync(`public/pong_${theme}.gif`, gif.out.getData());
}

await generateFrames(THEME.DARK)
await generateGif(THEME.DARK);
await generateFrames(THEME.LIGHT);
await generateGif(THEME.LIGHT);