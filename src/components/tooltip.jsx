import { useEffect, useRef } from 'preact/hooks';

import { computePosition, flip, shift, arrow } from '@floating-ui/dom';

import External from '../../node_modules/@brybrant/svg-icons/External.svg';

const sideLUT = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

/**
 * @typedef {Object} TooltipObject
 * @prop {HTMLElement} anchor - Anchor element
 * @prop {HTMLElement} tooltip - Tooltip element
 */

/** @type {TooltipObject|null} The currently active tooltip or null */
let activeTooltip = null;

/** @type {Map<string, TooltipObject>} */
const tooltips = new Map();

/** Tooltip index (ID) */
let index = 0;

/**
 * Round by Device Pixel Ratio
 * @param {number} value - Pixel coordinate
 * @returns {number} Pixel coordinate rounded by device pixel ratio
 */
function roundByDPR(value) {
  const dpr = window.devicePixelRatio || 1;
  return Math.round(value * dpr) / dpr;
}

/**
 * Update the position of a tooltip
 * @param {TooltipObject} tooltipObject
 */
function updatePosition(tooltipObject) {
  const tooltipArrow = tooltipObject.tooltip.firstElementChild;

  computePosition(tooltipObject.anchor, tooltipObject.tooltip, {
    placement: tooltipObject.tooltip.dataset.tooltipPlacement || 'top',
    middleware: [
      flip(),
      shift(),
      arrow({
        element: tooltipArrow,
        padding: 20,
      }),
    ],
  }).then(({ x, y, placement, middlewareData }) => {
    Object.assign(tooltipObject.tooltip.style, {
      transform: `translate3d(${roundByDPR(x)}px,${roundByDPR(y)}px,0)`,
    });

    const { x: arrowX, y: arrowY } = middlewareData.arrow;

    const staticSide = sideLUT[placement.split('-')[0]];

    Object.assign(tooltipArrow.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      [staticSide]: '6px',
    });
  });
}

/**
 * Show a tooltip
 * @this {HTMLElement} Tooltip anchor *or* tooltip
 */
function showTooltip() {
  /** @type {TooltipObject} */
  const tooltipObject = tooltips.get(this.dataset.tooltipId);

  const tooltip = tooltipObject.tooltip;

  tooltip.classList.remove('hidden');

  updatePosition(tooltipObject);

  tooltip.classList.add('visible');

  if (tooltip.classList.contains('active')) return;

  tooltip.classList.add('hover');
}

/**
 * Hide a tooltip
 * @this {HTMLElement} Tooltip anchor *or* tooltip
 */
function hideTooltip() {
  const tooltip = tooltips.get(this.dataset.tooltipId).tooltip;

  if (tooltip.classList.contains('active')) {
    return tooltip.classList.remove('hover');
  }

  tooltip.classList.remove('visible');

  removeTooltip.call(tooltip);
}

/**
 * Remove a tooltip
 * @this {HTMLElement} Tooltip
 */
function removeTooltip() {
  const tooltip = this;

  if (tooltip.classList.contains('active')) return;

  if (getComputedStyle(tooltip).getPropertyValue('opacity') === '0') {
    tooltip.classList.remove('hover');
    tooltip.classList.add('hidden');
  }
}

document.addEventListener('slide', () => {
  if (activeTooltip === null) return;

  activeTooltip.anchor.classList.remove('active');
  activeTooltip.tooltip.classList.remove('active', 'visible');

  activeTooltip = null;
});

/**
 * Activate or deactivate a tooltip. The active tooltip is always visible until
 * slide is changed or a different tooltip is activated.
 * @this {HTMLElement} Tooltip anchor
 */
function toggleTooltip() {
  /** @type {TooltipObject} */
  const tooltipObject = tooltips.get(this.dataset.tooltipId);

  if (activeTooltip !== null) {
    activeTooltip.anchor.classList.remove('active');
    activeTooltip.tooltip.classList.remove('active');

    if (activeTooltip === tooltipObject) {
      return (activeTooltip = null);
    }

    activeTooltip.tooltip.classList.remove('visible');
  }

  activeTooltip = tooltipObject;
  this.classList.add('active');
  tooltipObject.tooltip.classList.add('active');
}

/**
 * @param {Object} props
 * @param {import('preact/hooks').MutableRef} props.anchor - Anchor ref
 * @param {Boolean} [props.toggle] - Toggle tooltip by clicking anchor?
 * @param {string} [props.placement] - Tooltip placement
 * @param {string} [props.title] - Tooltip title
 * @param {string} [props.href] - Tooltip link
 * @param {string} props.content - Tooltip content
 */
export default function Tooltip(props) {
  const tooltipRef = useRef(null);

  const tooltipID = String(index);

  index++;

  useEffect(() => {
    /** @type {HTMLElement} Tooltip anchor */
    const anchor = props.anchor.current;
    /** @type {HTMLElement} Tooltip */
    const tooltip = tooltipRef.current;

    tooltips.set(tooltipID, {
      anchor,
      tooltip,
    });

    anchor.setAttribute('aria-describedby', `tooltip-${tooltipID}`);

    anchor.dataset.tooltipId = tooltipID;
    anchor.onmouseenter = showTooltip;
    anchor.onmouseleave = hideTooltip;
    if (props.toggle) anchor.onclick = toggleTooltip;

    tooltip.onmouseenter = showTooltip;
    tooltip.onmouseleave = hideTooltip;
    tooltip.ontransitionend = removeTooltip;

    return () => {
      anchor.classList.remove('active');
      tooltip.classList.remove('active', 'hover', 'visible');
      tooltips.delete(tooltipID);
    };
  });

  return (
    <div
      class='tooltip hidden'
      role='tooltip'
      id={`tooltip-${tooltipID}`}
      data-tooltip-placement={props.placement}
      data-tooltip-id={tooltipID}
      ref={tooltipRef}
    >
      <div className='tooltip__arrow' />
      <div className='tooltip__content'>
        {props.title && <span className='tooltip__title'>{props.title}</span>}
        {props.href && (
          <a rel='noreferrer' target='_blank' href={props.href}>
            {props.content}
            <span dangerouslySetInnerHTML={{ __html: External }} />
          </a>
        )}
        {!props.href && props.content}
      </div>
    </div>
  );
}
