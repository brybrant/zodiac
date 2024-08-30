import { render } from 'preact';

import createTooltip from './components/tooltip';

import './app.scss';
import './border.scss';
import './glide.scss';
import './tooltip.scss';

import Constellations from './pages/constellations';

const App = () => <>
  <header>
    <div className='border-container border-container--top'>
      <div className='border border--left'/>
      <h1 id='title'>Zodiac</h1>
      <div className='border border--right'/>
    </div>
    <div className='github-link'>
      <a
        target='_blank'
        href='https://github.com/brybrant/zodiac/'
        title='View Source'
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 470 470'>
          <path d='m235.19,0C105.14,0,0,105.91,0,236.94c0,104.74,67.37,193.4,160.82,224.78,11.68,2.36,15.96-5.1,15.96-11.37,0-5.49-.39-24.32-.39-43.94-65.43,14.12-79.05-28.25-79.05-28.25-10.51-27.46-26.09-34.52-26.09-34.52-21.41-14.51,1.56-14.51,1.56-14.51,23.75,1.57,36.22,24.32,36.22,24.32,21.02,36.09,54.9,25.89,68.53,19.61,1.94-15.3,8.18-25.89,14.8-31.77-52.18-5.49-107.08-25.89-107.08-116.9,0-25.89,9.34-47.07,24.14-63.55-2.33-5.88-10.51-30.21,2.34-62.77,0,0,19.86-6.28,64.64,24.32,19.17-5.19,38.94-7.82,58.8-7.85,19.86,0,40.1,2.75,58.8,7.85,44.78-30.6,64.64-24.32,64.64-24.32,12.85,32.56,4.67,56.88,2.33,62.77,15.19,16.47,24.14,37.66,24.14,63.55,0,91.01-54.9,111.02-107.47,116.9,8.57,7.45,15.96,21.57,15.96,43.93,0,31.77-.39,57.27-.39,65.12,0,6.28,4.28,13.73,15.96,11.38,93.45-31.39,160.82-120.04,160.82-224.78C470.38,105.91,364.86,0,235.19,0Z'/>
        </svg>
      </a>
    </div>
  </header>
  <Constellations/>
</>;

render(<App/>, document.getElementById('app'));

const tooltipAnchors = document.querySelectorAll('[data-tooltip]');

for (let index = 0; index < tooltipAnchors.length; index++) {
  createTooltip(tooltipAnchors[index]);
};