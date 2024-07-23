/**
 * @param {Number} number
 * @returns {Number} A number between 0 and 255
 */
function clampOctet(number) {
  return Math.round(Math.min(Math.max(number, 0), 255));
};

/**
 * Convert temperature (in kelvin) to RGB color and return drop-shadow filter
 * https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
 * @param {Number} temperature - Temperature in Kelvin (1000 to 40000 best)
 * @returns {Number[]} [red, green, blue]
 */
function kelvin2rgb(temperature) {
  let red = 0;
  let green = 0;
  let blue = 0;

  if (typeof temperature !== 'number' || Number.isNaN(temperature)) {
    return [red, green, blue];
  };

  const temp = temperature / 100;

  if (temp <= 66) {
    red = 255;
  } else {
    red = clampOctet(329.698727446 * Math.pow(temp - 60, -0.1332047592));
  };

  if (temp <= 66) {
    green = clampOctet(99.4708025861 * Math.log(temp) - 161.1195681661);
  } else {
    green = clampOctet(288.1221695283 * Math.pow(temp - 60, -0.0755148492));
  };

  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = clampOctet(138.5177312231 * Math.log(temp - 10) - 305.0447927307);
  };

  return [red, green, blue];
};

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
 * @param {Object} props
 * @param {String} props.designation - Star designation
 * @param {Placement} [props.placement] - Tooltip placement
 * @param {String} props.name - Star name
 * @param {Number} props.magnitude - Star apparent magnitude
 * @param {Number} props.temperature - Star temperature (in kelvin)
 * @param {Number} props.x - Star X position
 * @param {Number} props.y - Star Y position
 */
function Star(props) {
  const letter = letterRegex.exec(props.designation);
  const number = numberRegex.exec(props.designation);

  const designation = [];

  if (letter) designation.push(greekLUT[letter[0]]);
  if (number) designation.push(number[0]);

  const tooltip = [];

  if (designation[0] !== props.designation) {
    tooltip.push(designation.join(''), ' (', props.designation, ')');
  } else {
    tooltip.push(props.designation);
  };

  tooltip.push(' ', props.suffix);

  const href = [];

  if (props.name) href.push(props.name.replace(' ', '-'));
  href.push(props.designation, props.suffix, 'star');

  return (
    <circle
      class='star'
      style={
        `filter: drop-shadow(0 0 8px rgb(${kelvin2rgb(props.temperature)}))`
      }
      cx={props.x}
      cy={props.y}
      r={props.r}
      data-tooltip={JSON.stringify({
        title: props.name,
        content: tooltip.join(''),
        placement: props.placement,
        href: href.join('-').toLowerCase(),
        toggle: true,
      })}
    />
  );
};

/**
 * @param {Object} constellation
 * @param {Object} constellation.stars - Constellation stars
 * @param {String[][]} constellation.paths - Paths between stars
 * @param {String} constellation.name - Constellation name
 * @param {String} constellation.suffix - Constellation suffix
 * @param {Number[]} constellation.viewBox - Constellation viewBox
 */
export function Constellation({constellation}) {
  return (
    <svg
      class='constellation'
      xmlns='http://www.w3.org/2000/svg'
      viewBox={constellation.viewBox.join(' ')}
    >
      {constellation.paths.map((path, index) => {
        const points = [];

        for (const star of path) {
          points.push(
            constellation.stars[star].x,
            constellation.stars[star].y
          );
        };

        return (
          <path
            d={`M${points.join(' ')}`}
            key={`${constellation.name}-path-${index}`}
          />
        );
      })}
      {Object.entries(constellation.stars).map(([star, data]) => (
        <Star
          key={`${constellation.name}-star-${star}`}
          placement={data.placement || null}
          designation={star}
          suffix={constellation.suffix}
          name={data.name || null}
          temperature={data.temperature}
          x={data.x}
          y={data.y}
          r={data.r}
        />
      ))}
    </svg>
  );
};

export function Glyph({glyph}) {
  return (
    <svg
      class='glyph'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 80 80'
    >
      {glyph}
    </svg>
  );
};