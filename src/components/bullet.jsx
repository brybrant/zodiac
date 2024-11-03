import { useRef } from 'preact/hooks';

/**
 * @typedef {Object} BulletObject
 * @prop {import('preact/hooks').MutableRef} anchor - Tooltip anchor
 * @prop {string} content - Tooltip content
 */

/** @type {BulletObject[]} */
export const bullets = [];

/**
 * @param {Object} props
 * @param {string} props.index - Glide index
 * @param {string} props.constellation - Constellation name
 * @param {string} props.glyph - Constellation glyph SVG
 */
export function Bullet(props) {
  const bulletRef = useRef(null);

  bullets[props.index] = {
    anchor: bulletRef,
    content: props.constellation,
  };

  return (
    <button
      class='glide__bullet'
      data-glide-dir={`=${props.index}`}
      ref={bulletRef}
    >
      <svg
        class='glyph'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 80 80'
        dangerouslySetInnerHTML={{ __html: props.glyph }}
      />
    </button>
  );
}
