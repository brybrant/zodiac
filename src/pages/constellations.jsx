import { Horizontal } from '@brybrant/fade-scroll';
import Glide from '@glidejs/glide';
import { useEffect, useRef } from 'preact/hooks';

/**
 * @typedef {Object} StarData
 * @prop {string} [p] - Star tooltip placement
 * @prop {string} [n] - Star name
 * @prop {string} t - Star temperature (HEX color)
 * @prop {string} [d] - Star designation
 * @prop {number} x - Star X coordinate
 * @prop {number} y - Star Y coordinate
 * @prop {number} r - Star width (radius * 2)
 */

/**
 * @typedef {Object} Constellation
 * @prop {string} n - Constellation name
 * @prop {string} s - Constellation suffix
 * @prop {string[]} p - Constellation paths
 * @prop {Object.<string, StarData>} d - Constellation stars
 * @prop {string} v - Constellation viewBox
 * @prop {number} a - Constellation aspect ratio
 */

/** @type {Constellation[]} */
import constellations from './constellations.json';

import AquariusGlyph from '../glyphs/aquarius.svg';
import AriesGlyph from '../glyphs/aries.svg';
import CancerGlyph from '../glyphs/cancer.svg';
import CapricornGlyph from '../glyphs/capricorn.svg';
import GeminiGlyph from '../glyphs/gemini.svg';
import LeoGlyph from '../glyphs/leo.svg';
import LibraGlyph from '../glyphs/libra.svg';
import PiscesGlyph from '../glyphs/pisces.svg';
import SagittariusGlyph from '../glyphs/sagittarius.svg';
import ScorpioGlyph from '../glyphs/scorpio.svg';
import TaurusGlyph from '../glyphs/taurus.svg';
import VirgoGlyph from '../glyphs/virgo.svg';

const glyphs = {
  Aries: AriesGlyph,
  Taurus: TaurusGlyph,
  Gemini: GeminiGlyph,
  Cancer: CancerGlyph,
  Leo: LeoGlyph,
  Virgo: VirgoGlyph,
  Libra: LibraGlyph,
  Scorpio: ScorpioGlyph,
  Sagittarius: SagittariusGlyph,
  Capricorn: CapricornGlyph,
  Aquarius: AquariusGlyph,
  Pisces: PiscesGlyph,
};

import { Bullet, bullets } from '../components/bullet';

import Star from '../components/star';

import './constellations.scss';
import '../fade-scroll.scss';

const slide = new Event('slide');

function translate(index) {
  return `translateX(${-document.body.offsetWidth * index * 0.5}px)`;
}

/**
 * @param {Object} props
 * @param {import('preact/hooks').MutableRef} props.title
 */
export default function Constellations(props) {
  const backgroundRef = useRef(null);

  useEffect(() => {
    /** @type {HTMLElement} */
    const title = props.title.current;
    /** @type {HTMLElement} */
    const background = backgroundRef.current;
    const backgroundCSS = background.style;

    const slider = new Glide('.glide', {
      animationDuration: 666,
      focusAt: 'center',
      gap: 0,
      type: 'carousel',
    });

    title.innerText = constellations[slider.index].n;

    const animationDuration = `${slider.settings.animationDuration}ms`;
    const animationTimingFunc = slider.settings.animationTimingFunc;

    let documentWidth = document.body.offsetWidth;
    let currentSlideIndex = slider.index;
    let swipeTranslate = 0;
    let running = false;

    backgroundCSS.transitionProperty = 'transform';
    backgroundCSS.transitionTimingFunction = animationTimingFunc;
    backgroundCSS.width = `${documentWidth * 7.5}px`;
    backgroundCSS.transform = translate(slider.index + 1);

    const bulletScroller = new Horizontal('.glide__bullets', {
      captureWheel: true,
      hideScrollbar: true,
    }).mount();

    slider.on('resize', () => {
      document.dispatchEvent(slide);

      documentWidth = document.body.offsetWidth;
      backgroundCSS.width = `${documentWidth * 7.5}px`;
      backgroundCSS.transform = translate(slider.index + 1);
    });

    slider.on('run', ({ direction }) => {
      document.dispatchEvent(slide);

      /** @type {HTMLElement} */
      const thisBullet = bullets[slider.index].anchor.current;

      const bulletPosition =
        thisBullet.offsetWidth * 0.5 + thisBullet.offsetLeft;

      const halfWrapperSize = bulletScroller.wrapperSize * 0.5;

      bulletScroller.scrollPosition = bulletPosition - halfWrapperSize;

      title.className = 'switch';
      title.innerText = constellations[slider.index].n;

      running = true;
      backgroundCSS.transitionDuration = animationDuration;

      if (currentSlideIndex === 0 && direction === '<') {
        backgroundCSS.transform = translate(0);
      } else if (currentSlideIndex === 11 && direction === '>') {
        backgroundCSS.transform = translate(13);
      } else {
        backgroundCSS.transform = translate(slider.index + 1);
      }

      currentSlideIndex = slider.index;

      requestAnimationFrame(() => {
        title.className = '';
        backgroundCSS.transitionDuration = '';
      });
    });

    slider.on('run.after', () => {
      backgroundCSS.transform = translate(slider.index + 1);
      title.innerText = constellations[slider.index].n;
      running = false;
    });

    slider.on('move', ({ movement }) => {
      swipeTranslate = documentWidth * -0.5 + movement * -0.5;
    });

    slider.on('swipe.start', () => (backgroundCSS.transitionDuration = ''));

    slider.on('swipe.move', () => {
      backgroundCSS.transform = `translateX(${swipeTranslate}px)`;
    });

    slider.on('swipe.end', () => {
      if (running) return;
      backgroundCSS.transitionDuration = animationDuration;
      backgroundCSS.transform = `translateX(${swipeTranslate}px)`;
      requestAnimationFrame(() => (backgroundCSS.transitionDuration = ''));
    });

    slider.mount();

    return () => {
      slider.destroy();
      bulletScroller.destroy();
      bulletScroller.wrapper.replaceWith(bulletScroller.content);
    };
  });

  return (
    <div class='glide'>
      <div class='stars-background' ref={backgroundRef} />
      <div class='glide__iterators' data-glide-el='controls'>
        <button
          class='glide__iterator glide__iterator--prev'
          data-glide-dir='<'
        >
          <div class='glide__arrow' />
          Previous
        </button>
        <button
          class='glide__iterator glide__iterator--next'
          data-glide-dir='>'
        >
          <div class='glide__arrow' />
          Next
        </button>
      </div>

      <div class='glide__track' data-glide-el='track'>
        <ul id='slides' class='glide__slides'>
          {constellations.map((constellation, index) => (
            <li class='glide__slide' key={`constellation-${index}`}>
              <div class='constellation-container'>
                <div class='constellation'>
                  <svg
                    class='constellation-paths'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox={constellation.v}
                  >
                    {constellation.p.map((points, index) => (
                      <path
                        key={`${constellation.n}-path-${index}`}
                        d={points}
                      />
                    ))}
                  </svg>
                  <div
                    class='constellation-stars'
                    style={{ paddingBottom: `${constellation.a}%` }}
                  >
                    {Object.entries(constellation.d).map(([star, data]) => (
                      <Star
                        key={`${constellation.n}-star-${star}`}
                        viewBox={constellation.v}
                        placement={data.p || null}
                        star={star}
                        designation={data.d || null}
                        suffix={constellation.s}
                        name={data.n || null}
                        temperature={data.t}
                        x={data.x}
                        y={data.y}
                        r={data.r}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div class='glide__navigation'>
        <div class='border-container border-container--bottom'>
          <div class='border border--left' />
          <div class='glide__bullets' data-glide-el='controls[nav]'>
            {constellations.map((constellation, index) => (
              <Bullet
                index={index}
                key={`bullet-${index}`}
                constellation={constellation.n}
                glyph={glyphs[constellation.n]}
              />
            ))}
          </div>
          <div class='border border--right' />
        </div>
      </div>
    </div>
  );
}
