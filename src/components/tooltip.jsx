import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
} from '@floating-ui/dom';

const sideLUT = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

/**
 * @typedef {Object} Tooltip
 * @prop {Object} props - Tooltip properties
 * @prop {String} props.content - Tooltip content
 * @prop {String} [props.title] - Tooltip title
 * @prop {String} [props.href] - Tooltip link
 * @prop {Boolean} [props.toggle] - Toggle tooltip on clicking anchor?
 * @prop {HTMLElement} anchor - Tooltip anchor
 * @prop {HTMLElement} tooltip - Tooltip element
 * @prop {HTMLElement} arrow - Tooltip arrow
 * @prop {HTMLElement} content - Tooltip content
 * @prop {Number} animation - Tooltip animation request ID
 */

/** @type {Tooltip|null} The currently active tooltip or null */
let activeTooltip = null;

/** @type {Tooltip[]} Complete array of tooltips, ordered by tooltip ID */
const tooltips = [];

/** @type {Number} Tooltip index (ID) */
let index = 0;

/**
 * Round by Device Pixel Ratio
 * @param {Number} value - Pixel coordinate
 * @returns {Number} Pixel coordinate rounded by device pixel ratio
 */
function roundByDPR(value) {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(value * dpr) / dpr;
};

/**
 * Update the position of a tooltip
 * @param {Tooltip} tooltip
 */
function updatePosition(tooltip) {
  computePosition(tooltip.anchor, tooltip.tooltip, {
    placement: tooltip.props.placement || 'top',
    middleware: [
      offset(8),
      flip(),
      shift({
        padding: 48,
      }),
      arrow({
        element: tooltip.arrow,
        padding: 14,
      }),
    ],
  }).then(({x, y, placement, middlewareData}) => {
    Object.assign(tooltip.tooltip.style, {
      transform: `translate3d(${roundByDPR(x)}px,${roundByDPR(y)}px,0)`,
    });

    const {x: arrowX, y: arrowY} = middlewareData.arrow;

    const staticSide = sideLUT[placement.split('-')[0]];

    Object.assign(tooltip.arrow.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      [staticSide]: '0',
    });
  });
};

/**
 * Show a tooltip
 * @param {MouseEvent} event
 */
function showTooltip(event) {
  const thisTooltip = tooltips[event.target.dataset.tooltipId];

  if (!document.body.contains(thisTooltip.tooltip)) {
    document.body.append(thisTooltip.tooltip);
  };

  thisTooltip.anchor.setAttribute('aria-describedby', thisTooltip.tooltip.id);

  updatePosition(thisTooltip);

  thisTooltip.animation = requestAnimationFrame(() => {
    thisTooltip.tooltip.classList.add('visible');
  });
};

/**
 * Hide a tooltip
 * @param {MouseEvent} event
 */
function hideTooltip(event) {
  const thisTooltip = tooltips[event.target.dataset.tooltipId];

  if (thisTooltip.anchor.classList.contains('active')) return;

  cancelAnimationFrame(thisTooltip.animation);

  thisTooltip.tooltip.classList.remove('visible');

  removeTooltip(event);
};

/**
 * Remove a tooltip from the DOM
 * @param {MouseEvent} event
 */
function removeTooltip(event) {
  const thisTooltip = tooltips[event.target.dataset.tooltipId];

  if (
    getComputedStyle(thisTooltip.tooltip).getPropertyValue('opacity') === '0'
  ) {
    thisTooltip.anchor.removeAttribute('aria-describedby');
    thisTooltip.tooltip.remove();
    if (activeTooltip === thisTooltip) activeTooltip = null;
  };
};

document.addEventListener('slide', () => {
  if (activeTooltip === null) return;

  activeTooltip.anchor.classList.remove('active');

  hideTooltip({target: activeTooltip.anchor});
});

/**
 * Activate or deactivate a tooltip. The active tooltip is always visible until
 * slide is changed or a different tooltip is activated.
 * @param {MouseEvent} event
 */
function activateTooltip(event) {
  const thisTooltip = tooltips[event.target.dataset.tooltipId];

  if (activeTooltip === null) {
    activeTooltip = thisTooltip;
    return thisTooltip.anchor.classList.add('active');
  };

  if (activeTooltip === thisTooltip) {
    return thisTooltip.anchor.classList.toggle('active');
  };

  activeTooltip.anchor.classList.remove('active');
  activeTooltip.tooltip.classList.remove('visible');
  activeTooltip = thisTooltip;
  thisTooltip.anchor.classList.add('active');
};

const svgXMLNS = 'http://www.w3.org/2000/svg';

const externalLink = document.createElementNS(svgXMLNS, 'svg');
externalLink.setAttribute('viewBox', '0 0 375 500');
const externalLinkPath = document.createElementNS(svgXMLNS, 'path');
externalLinkPath.setAttribute('d', 'm310,275l30,30v65c0,16.57-13.43,30-30,30H110c-16.57,0-30-13.43-30-30v-200c0-16.57,13.43-30,30-30h65l30,30h-95v200h200v-95Zm-85-170l35,35h55l-150,150,25,25,150-150v60l30,30V105h-145Z');
externalLink.append(externalLinkPath);

/**
 * Create a new tooltip
 * @param {HTMLElement} anchor - HTML element with [data-tooltip] attribute
 */
export default function createTooltip(anchor) {
  const tooltip = document.createElement('div');
  const arrow = document.createElement('div');
  const content = document.createElement('div');
  const props = JSON.parse(anchor.dataset.tooltip);

  anchor.dataset.tooltipId = tooltip.dataset.tooltipId = index;

  if (props.title) {
    const title = document.createElement('span');
    title.className = 'tooltip__title';
    title.append(props.title);
    title.append(document.createElement('br'));
    content.append(title);
  };

  if (props.href) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `https://theskylive.com/sky/stars/${props.href}`;
    link.append(props.content);
    link.append(externalLink.cloneNode(true));
    content.append(link);
  } else {
    content.append(props.content);
  };

  tooltip.append(arrow, content);
  tooltip.className = tooltip.role = 'tooltip';
  tooltip.id = `tooltip-${index}`;

  arrow.className = 'tooltip__arrow';
  content.className = 'tooltip__content';

  anchor.addEventListener('mouseenter', showTooltip);
  anchor.addEventListener('mouseleave', hideTooltip);
  anchor.addEventListener('focus', showTooltip);
  anchor.addEventListener('blur', hideTooltip);

  if (props.toggle === true) {
    anchor.addEventListener('click', activateTooltip);
  };

  tooltip.addEventListener('mouseenter', showTooltip);
  tooltip.addEventListener('mouseleave', hideTooltip);
  tooltip.addEventListener('transitionend', removeTooltip);

  tooltips.push({
    props,
    anchor,
    tooltip,
    arrow,
    content,
    animation: 0,
  });

  index++;
};