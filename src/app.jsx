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
  </header>
  <Constellations/>
</>;

render(<App/>, document.getElementById('app'));

const tooltipAnchors = document.querySelectorAll('[data-tooltip]');

for (let index = 0; index < tooltipAnchors.length; index++) {
  createTooltip(tooltipAnchors[index]);
};