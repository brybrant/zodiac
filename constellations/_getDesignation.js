/**
 * Greek letter lookup table
 * @readonly
 * @enum {String}
 */
const greekLUT = {
  alpha: '\u03B1',
  beta: '\u03B2',
  gamma: '\u03B3',
  delta: '\u03B4',
  epsilon: '\u03B5',
  zeta: '\u03B6',
  eta: '\u03B7',
  theta: '\u03B8',
  iota: '\u03B9',
  kappa: '\u03BA',
  lambda: '\u03BB',
  mu: '\u03BC',
  nu: '\u03BD',
  xi: '\u03BE',
  omicron: '\u03BF',
  pi: '\u03C0',
  rho: '\u03C1',
  sigma: '\u03C3',
  tau: '\u03C4',
  upsilon: '\u03C5',
  phi: '\u03C6',
  chi: '\u03C7',
  psi: '\u03C8',
  omega: '\u03C9',
};

const letterRegex = /[a-z]+/;
const numberRegex = /\d+/;

/**
 * Convert Greek letter name to literal Greek letter
 * @param {string} name - Greek letter name
 * @returns {string} Greek designation of the star
 */
export function getDesignation(name) {
  const letter = letterRegex.exec(name);
  const number = numberRegex.exec(name);

  const designation = [];

  if (letter) designation.push(greekLUT[letter[0]]);
  if (number) designation.push(number[0]);

  if (designation[0] === name) return null;

  return designation.join('');
}
