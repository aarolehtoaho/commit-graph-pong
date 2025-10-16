import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import GIFEncoder from 'gif-encoder-2';
import UPNG from 'upng-js';

const TIME = 10;
const FPS = 2.5;
const TOTAL_FRAMES = TIME * FPS;
const TIME_BETWEEN_FRAMES = 1000 / FPS;
const WIDTH = 1116 + 10;
const HEIGHT = 201 + 10;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATH = 'file://' + path.join(__dirname, 'index.html');

const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
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

const gif = GIFEncoder(WIDTH, HEIGHT);
gif.start();
gif.setRepeat(0);
gif.setDelay(TIME_BETWEEN_FRAMES);
gif.setQuality(10);

for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
  const buffer = fs.readFileSync(`frames/frame${frame}.png`);
  const rgbaData = UPNG.toRGBA8(UPNG.decode(buffer))[0];

  gif.addFrame(rgbaData);
}

gif.finish();
fs.writeFileSync('public/game.gif', gif.out.getData());