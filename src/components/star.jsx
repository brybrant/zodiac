import { useRef } from 'preact/hooks';

import Tooltip from './tooltip';

/**
 * @param {Object} props
 * @param {string} props.star - Star designation (as greek letter names)
 * @param {string} [props.designation] - Star designation
 * @param {string} [props.placement] - Tooltip placement
 * @param {string} props.name - Star name
 * @param {number} props.temperature - Star temperature (as HEX color)
 * @param {number} props.x - Star X position
 * @param {number} props.y - Star Y position
 * @param {number} props.r - Star radius
 */
export default function Star(props) {
  const starRef = useRef(null);

  const tooltipContent = [];

  if (props.designation) {
    tooltipContent.push(props.designation, ' (', props.star, ')');
  } else {
    tooltipContent.push(props.star);
  }

  tooltipContent.push(' ', props.suffix);

  const link = [];

  if (props.name) link.push(props.name.replace(' ', '-'));
  link.push(props.star, props.suffix, 'star');

  const href = link.join('-').toLowerCase();

  return (
    <>
      <Tooltip
        title={props.name || null}
        content={tooltipContent.join('')}
        placement={props.placement || null}
        href={`https://theskylive.com/sky/stars/${href}`}
        anchor={starRef}
        toggle={true}
      />
      <div
        class='star'
        style={{
          top: `${props.y}%`,
          left: `${props.x}%`,
          width: `${props.r}%`,
          boxShadow: `0 0 16px ${props.temperature}`,
        }}
        ref={starRef}
      />
    </>
  );
}
