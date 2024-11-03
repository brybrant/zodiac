/**
 * @param {Number} number
 * @returns {Number} A number between 0 and 255
 */
function clampOctet(number) {
  return Math.round(Math.min(Math.max(number, 0), 255));
}

/**
 * @param {number} x
 * @returns {string} HEX representation of `x`
 */
function toHex(x) {
  const hex = Math.round(x).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Convert temperature (in kelvin) to RGB color and return HEX color code
 * https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
 * @param {number} temperature - Temperature in Kelvin (1000 to 40000 best)
 * @returns {string} HEX color code
 */
export function kelvin2hex(temperature) {
  let red = 0;
  let green = 0;
  let blue = 0;

  if (typeof temperature !== 'number' || Number.isNaN(temperature)) {
    return `#000`;
  }

  const temp = temperature / 100;

  if (temp <= 66) {
    red = 255;
  } else {
    red = clampOctet(329.698727446 * Math.pow(temp - 60, -0.1332047592));
  }

  red = toHex(red);

  if (temp <= 66) {
    green = clampOctet(99.4708025861 * Math.log(temp) - 161.1195681661);
  } else {
    green = clampOctet(288.1221695283 * Math.pow(temp - 60, -0.0755148492));
  }

  green = toHex(green);

  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = clampOctet(138.5177312231 * Math.log(temp - 10) - 305.0447927307);
  }

  blue = toHex(blue);

  return `#${red}${green}${blue}`;
}
