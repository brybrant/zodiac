import { Horizontal } from '@brybrant/fade-scroll';
import Glide from '@glidejs/glide';
import { useEffect } from 'preact/hooks';

import * as Aries from '../constellations/aries';
import * as Taurus from '../constellations/taurus';
import * as Gemini from '../constellations/gemini';
import * as Cancer from '../constellations/cancer';
import * as Leo from '../constellations/leo';
import * as Virgo from '../constellations/virgo';
import * as Libra from '../constellations/libra';
import * as Scorpio from '../constellations/scorpio';
import * as Sagittarius from '../constellations/sagittarius';
import * as Capricorn from '../constellations/capricorn';
import * as Aquarius from '../constellations/aquarius';
import * as Pisces from '../constellations/pisces';

import * as SVG from '../components/svg';

import './constellations.scss';
import '../fade-scroll.scss';

const slide = new Event('slide');

const Constellations = [
  {
    name: 'Aries',
    glyph: Aries.Glyph,
    stars: Aries.Stars,
    suffix: 'Arietis',
    paths: [
      ['41', 'alpha', 'beta', 'gamma2'],
    ],
  },
  {
    name: 'Taurus',
    glyph: Taurus.Glyph,
    stars: Taurus.Stars,
    suffix: 'Tauri',
    paths: [
      ['beta', 'tau', 'epsilon', 'delta1', 'gamma', 'theta2', 'alpha', 'zeta'],
      ['nu', 'mu', 'lambda', 'gamma'],
      ['omicron', 'xi', '5', 'lambda'],
    ],
  },
  {
    name: 'Gemini',
    glyph: Gemini.Glyph,
    stars: Gemini.Stars,
    suffix: 'Geminorum',
    paths: [
      ['kappa', 'upsilon', 'iota', 'tau', 'theta'],
      ['beta', 'upsilon', 'delta', 'lambda', 'xi'],
      ['alpha', 'tau', 'epsilon', 'nu'],
      ['gamma', 'zeta', 'delta'],
      ['1', 'eta', 'mu', 'epsilon'],
    ],
  },
  {
    name: 'Cancer',
    glyph: Cancer.Glyph,
    stars: Cancer.Stars,
    suffix: 'Cancri',
    paths: [
      ['iota', 'gamma', 'delta', 'alpha'],
      ['beta', '27', 'delta'],
    ],
  },
  {
    name: 'Leo',
    glyph: Leo.Glyph,
    stars: Leo.Stars,
    suffix: 'Leonis',
    paths: [
      ['beta', 'delta', 'theta', 'iota', 'sigma'],
      ['rho', 'theta', 'eta', 'gamma1', 'delta'],
      ['pi', 'alpha', 'eta', 'omicron'],
      ['gamma1', 'zeta', 'mu', 'epsilon', 'eta'],
      ['mu', 'kappa', 'lambda', 'epsilon'],
    ],
  },
  {
    name: 'Virgo',
    glyph: Virgo.Glyph,
    stars: Virgo.Stars,
    suffix: 'Virginis',
    paths: [
      ['109', 'tau', 'zeta', 'iota', 'mu'],
      ['epsilon', 'delta', 'gamma', 'theta', 'alpha'],
      ['zeta', 'gamma', 'eta', 'beta', 'nu', 'omicron', 'eta'],
    ],
  },
  {
    name: 'Libra',
    glyph: Libra.Glyph,
    stars: Libra.Stars,
    suffix: 'Librae',
    paths: [
      ['sigma', 'alpha2', 'beta', 'gamma', 'alpha2'],
      ['tau', 'upsilon', 'gamma'],
    ],
  },
  {
    name: 'Scorpio',
    glyph: Scorpio.Glyph,
    stars: Scorpio.Stars,
    suffix: 'Scorpii',
    paths: [
      ['upsilon', 'lambda', 'kappa', 'iota1', 'theta', 'eta', 'zeta2', 'mu1', 'epsilon', 'tau', 'alpha', 'sigma', 'delta', 'beta1', 'nu'],
      ['rho', 'pi', 'delta'],
    ],
  },
  {
    name: 'Sagittarius',
    glyph: Sagittarius.Glyph,
    stars: Sagittarius.Stars,
    suffix: 'Sagittarii',
    paths: [
      ['beta2', 'beta1', 'iota', 'alpha'],
      ['iota', 'theta1', 'omega', 'tau', 'zeta', 'phi', 'sigma', 'tau'],
      ['zeta', 'epsilon', 'gamma2', 'delta', 'epsilon'],
      ['mu', 'lambda', 'phi', 'delta', 'lambda'],
      ['sigma', 'omicron', 'xi2'],
      ['rho1', 'pi', 'omicron'],
      ['epsilon', 'eta'],
    ],
  },
  {
    name: 'Capricorn',
    glyph: Capricorn.Glyph,
    stars: Capricorn.Stars,
    suffix: 'Capricorni',
    paths: [
      ['delta', 'epsilon', 'zeta', 'omega', 'psi', 'omicron', 'beta', 'alpha2', 'theta', 'gamma', 'delta'],
    ],
  },
  {
    name: 'Aquarius',
    glyph: Aquarius.Glyph,
    stars: Aquarius.Stars,
    suffix: 'Aquarii',
    paths: [
      ['101', '99', '98', 'psi1', 'phi', 'lambda', 'tau2', 'delta', 'psi1', '88', '89', '86'],
      ['eta', 'zeta2', 'pi', 'alpha', 'gamma', 'zeta2'],
      ['iota', 'beta', 'alpha', 'theta', 'lambda'],
      ['epsilon', 'mu', 'beta'],
    ],
  },
  {
    name: 'Pisces',
    glyph: Pisces.Glyph,
    stars: Pisces.Stars,
    suffix: 'Piscium',
    paths: [
      ['phi', 'upsilon', 'tau', 'phi', 'eta', 'omicron', 'alpha', 'nu', 'epsilon', 'delta', 'omega', 'iota', 'theta', 'gamma', 'kappa', 'lambda', 'iota'],
    ],
  },
];

const magnitudeScale = Math.pow(100, 1 / 5);

let minMagnitude = Infinity;
let maxMagnitude = 0;

for (const constellation of Constellations) {
  for (const star of Object.values(constellation.stars)) {
    if (star.magnitude < minMagnitude) minMagnitude = star.magnitude;
    if (star.magnitude > maxMagnitude) maxMagnitude = star.magnitude;
  };
};

const magnitudeTotal = maxMagnitude + minMagnitude;
minMagnitude = Math.pow(magnitudeScale, minMagnitude);
maxMagnitude = Math.pow(magnitudeScale, maxMagnitude);

const magnitudeDelta = maxMagnitude - minMagnitude;

const minRadius = 6;
const maxRadius = 23;
const radiusDelta = maxRadius - minRadius;

function getStarRadius(magnitude) {
  magnitude = Math.pow(magnitudeScale, magnitudeTotal - magnitude);

  return radiusDelta * (magnitude - minMagnitude) / magnitudeDelta + minRadius;
};

for (const constellation of Constellations) {
  const viewBox = [0, 0, 0, 0];

  for (const star of Object.values(constellation.stars)) {
    star.r = getStarRadius(star.magnitude);

    if (star.x - star.r < viewBox[0]) viewBox[0] = star.x - star.r;
    if (star.y - star.r < viewBox[1]) viewBox[1] = star.y - star.r;
    if (star.x + star.r > viewBox[2]) viewBox[2] = star.x + star.r;
    if (star.y + star.r > viewBox[3]) viewBox[3] = star.y + star.r;
  };

  viewBox[0] -= 16;
  viewBox[1] -= 16;
  viewBox[2] += Math.abs(viewBox[0]) + 16;
  viewBox[3] += Math.abs(viewBox[1]) + 16;

  constellation.viewBox = viewBox;
};

function translate(index) {
  return `translateX(${-document.body.offsetWidth * index * 0.5}px)`;
};

export default () => {
  useEffect(() => {
    const title = document.getElementById('title');
    const background = document.getElementById('stars-background');
    const backgroundCSS = background.style;

    const slider = new Glide('.glide', {
      animationDuration: 666,
      focusAt: 'center',
      gap: 0,
      type: 'carousel',
    });

    title.innerText = Constellations[slider.index].name;

    const animationDuration = `${slider.settings.animationDuration}ms`;
    const animationTimingFunc = slider.settings.animationTimingFunc;

    let documentWidth = document.body.offsetWidth;
    let currentSlideIndex = slider.index;
    let swipeTranslate = 0;
    let running = false;

    backgroundCSS.transitionProperty = 'transform';
    backgroundCSS.transitionTimingFunction = animationTimingFunc;
    backgroundCSS.backgroundSize = `${
      documentWidth > 1024 ? documentWidth * 0.5 : documentWidth
    }px`;
    backgroundCSS.width = `${documentWidth * 7.5}px`;
    backgroundCSS.transform = translate(slider.index + 1);

    const bullets = document.querySelectorAll('.glide__bullet');

    const bulletScroller = new Horizontal('.glide__bullets', {
      captureWheel: true,
      hideScrollbar: true,
    }).mount();

    slider.on('resize', () => {
      document.dispatchEvent(slide);

      documentWidth = document.body.offsetWidth;
      backgroundCSS.backgroundSize = `${
        documentWidth > 1024 ? documentWidth * 0.5 : documentWidth
      }px`;
      backgroundCSS.width = `${documentWidth * 7.5}px`;
      backgroundCSS.transform = translate(slider.index + 1);
    });

    slider.on('run', ({direction}) => {
      document.dispatchEvent(slide);

      const thisBullet = bullets[slider.index];

      const bulletPosition =
        thisBullet.offsetWidth * 0.5 + thisBullet.offsetLeft;

      const halfWrapperSize = bulletScroller.wrapperSize * 0.5;

      bulletScroller.scrollPosition = bulletPosition - halfWrapperSize;

      title.className = 'switch';
      title.innerText = Constellations[slider.index].name;

      running = true;
      backgroundCSS.transitionDuration = animationDuration;

      if (currentSlideIndex === 0 && direction === '<') {
        backgroundCSS.transform = translate(0);
      } else if (currentSlideIndex === 11 & direction === '>') {
        backgroundCSS.transform = translate(13);
      } else {
        backgroundCSS.transform = translate(slider.index + 1);
      };

      currentSlideIndex = slider.index;

      requestAnimationFrame(() => {
        title.className = '';
        backgroundCSS.transitionDuration = '';
      });
    });

    slider.on('run.after', () => {
      backgroundCSS.transform = translate(slider.index + 1);
      title.innerText = Constellations[slider.index].name;
      running = false;
    });

    slider.on('move', ({movement}) => {
      swipeTranslate = documentWidth * -0.5 + movement * -0.5;
    });

    slider.on('swipe.start', () => backgroundCSS.transitionDuration = '');

    slider.on('swipe.move', () => {
      document.dispatchEvent(slide);
      backgroundCSS.transform = `translateX(${swipeTranslate}px)`;
    });

    slider.on('swipe.end', () => {
      if (running) return;
      backgroundCSS.transitionDuration = animationDuration;
      backgroundCSS.transform = `translateX(${swipeTranslate}px)`;
      requestAnimationFrame(() => backgroundCSS.transitionDuration = '');
    });

    slider.mount();

    return () => {
      slider.destroy();
      bulletScroller.destroy();
    };
  });

  return (
    <div className='glide'>
      <div id='stars-background'/>
      <div className='glide__iterators' data-glide-el='controls'>
        <button
          className='glide__iterator glide__iterator--prev'
          data-glide-dir='<'
        ><div className='glide__arrow'/>Previous</button>
        <button
          className='glide__iterator glide__iterator--next'
          data-glide-dir='>'
        ><div className='glide__arrow'/>Next</button>
      </div>

      <div className='glide__track' data-glide-el='track'>
        <ul id='slides' className='glide__slides'>
          {Constellations.map((constellation, index) => (
            <li className='glide__slide' key={`constellation-${index}`}>
              <SVG.Constellation constellation={constellation}/>
            </li>
          ))}
        </ul>
      </div>

      <div className='glide__navigation'>
        <div className='border-container border-container--bottom'>
          <div className='border border--left'/>
          <div className='glide__bullets' data-glide-el='controls[nav]'>
            {Constellations.map((constellation, index) => (
              <button
                className='glide__bullet'
                data-glide-dir={`=${index}`}
                data-tooltip={JSON.stringify({content: constellation.name})}
                key={`glyph-${index}`}
              >
                <SVG.Glyph glyph={constellation.glyph}/>
              </button>
            ))}
          </div>
          <div className='border border--right'/>
        </div>
      </div>
    </div>
  );
};
