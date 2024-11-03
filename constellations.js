import { writeFileSync } from 'node:fs';

import { kelvin2hex } from './constellations/_kelvin2hex.js';
import { getDesignation } from './constellations/_getDesignation.js';

import Aquarius from './constellations/aquarius.js';
import Aries from './constellations/aries.js';
import Cancer from './constellations/cancer.js';
import Capricorn from './constellations/capricorn.js';
import Gemini from './constellations/gemini.js';
import Leo from './constellations/leo.js';
import Libra from './constellations/libra.js';
import Pisces from './constellations/pisces.js';
import Sagittarius from './constellations/sagittarius.js';
import Scorpio from './constellations/scorpio.js';
import Taurus from './constellations/taurus.js';
import Virgo from './constellations/virgo.js';

const Constellations = [
  Aries,
  Taurus,
  Gemini,
  Cancer,
  Leo,
  Virgo,
  Libra,
  Scorpio,
  Sagittarius,
  Capricorn,
  Aquarius,
  Pisces,
];

const mScale = Math.pow(100, 1 / 5);

let mMin = Infinity;
let mMax = 0;

for (const constellation of Constellations) {
  constellation.n = constellation.name;
  delete constellation.name;

  constellation.s = constellation.suffix;
  delete constellation.suffix;

  for (const [name, star] of Object.entries(constellation.stars)) {
    if (star.magnitude < mMin) mMin = star.magnitude;
    if (star.magnitude > mMax) mMax = star.magnitude;

    star.p = star.placement;
    delete star.placement;

    star.n = star.name;
    delete star.name;

    star.t = kelvin2hex(star.temperature);
    delete star.temperature;

    const designation = getDesignation(name);
    if (designation) star.d = getDesignation(name);
  }
}

const mTotal = mMax + mMin;
mMin = Math.pow(mScale, mMin);
mMax = Math.pow(mScale, mMax);

const mDelta = mMax - mMin;

const rMin = 6;
const rMax = 23;
const rDelta = rMax - rMin;

/**
 * @param {number} number
 * @returns {number} `number` rounded to 3 decimal places
 */
function threeDecimals(number) {
  return Math.round(number * 1000) / 1000;
}

/**
 * Get the radius of a star based on its apparent magnitude (brightness)
 * @param {number} magnitude
 * @returns {number} Radius of the star *(SVG circle radius)*
 */
function getStarRadius(magnitude) {
  const mScaled = Math.pow(mScale, mTotal - magnitude);

  return threeDecimals((rDelta * (mScaled - mMin)) / mDelta + rMin);
}

function scaleCoordinate(coordinate, newMin, newMax, oldMin, oldMax) {
  const newCoordinate =
    ((newMax - newMin) * (coordinate - oldMin)) / (oldMax - oldMin) + newMin;

  return threeDecimals(newCoordinate);
}

for (const constellation of Constellations) {
  const viewBox = [0, 0, 0, 0];

  for (const star of Object.values(constellation.stars)) {
    star.r = getStarRadius(star.magnitude);

    delete star.magnitude;

    if (star.x - star.r < viewBox[0]) viewBox[0] = star.x - star.r;
    if (star.y - star.r < viewBox[1]) viewBox[1] = star.y - star.r;
    if (star.x + star.r > viewBox[2]) viewBox[2] = star.x + star.r;
    if (star.y + star.r > viewBox[3]) viewBox[3] = star.y + star.r;
  }

  viewBox[0] = threeDecimals(viewBox[0]);
  viewBox[1] = threeDecimals(viewBox[1]);
  viewBox[2] = threeDecimals(viewBox[2] + Math.abs(viewBox[0]));
  viewBox[3] = threeDecimals(viewBox[3] + Math.abs(viewBox[1]));

  constellation.v = viewBox.join(' ');
  constellation.a = threeDecimals((viewBox[3] / viewBox[2]) * 100);

  for (let i = 0; i < constellation.paths.length; i++) {
    const points = [];

    for (let p = 0; p < constellation.paths[i].length; p++) {
      const star = constellation.stars[constellation.paths[i][p]];

      points.push(`${threeDecimals(star.x)} ${threeDecimals(star.y)}`);
    }

    constellation.paths[i] = `M${points.join(' ')}`;
  }

  constellation.p = constellation.paths;
  delete constellation.paths;

  for (const star of Object.values(constellation.stars)) {
    star.x = scaleCoordinate(
      star.x - star.r,
      0,
      100,
      viewBox[0],
      viewBox[2] - Math.abs(viewBox[0]),
    );

    star.y = scaleCoordinate(
      star.y - star.r,
      0,
      100,
      viewBox[1],
      viewBox[3] - Math.abs(viewBox[1]),
    );

    star.r = threeDecimals(((star.r * 2) / viewBox[2]) * 100);
  }

  constellation.d = constellation.stars;
  delete constellation.stars;
}

writeFileSync(
  './src/pages/constellations.json',
  JSON.stringify(Constellations, null, 2),
);
