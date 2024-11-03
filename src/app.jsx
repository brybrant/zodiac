import { render } from 'preact';
import { useRef } from 'preact/hooks';

import GitHubSVG from '../node_modules/@brybrant/svg-icons/GitHub.svg';

import Tooltip from './components/tooltip';

import './app.scss';
import './border.scss';
import './glide.scss';
import './tooltip.scss';

import Constellations from './pages/constellations';

import { bullets } from './components/bullet';

const App = () => {
  const titleRef = useRef(null);

  return (
    <>
      <header>
        <div className='border-container border-container--top'>
          <div className='border border--left' />
          <h1 ref={titleRef}>Zodiac</h1>
          <div className='border border--right' />
        </div>
        <div className='github-link'>
          <a
            rel='noreferrer'
            target='_blank'
            href='https://github.com/brybrant/zodiac/'
            title='View Source'
            dangerouslySetInnerHTML={{ __html: GitHubSVG }}
          />
        </div>
      </header>
      <Constellations title={titleRef} />
    </>
  );
};

function BulletTooltips() {
  return bullets.map((bullet, index) => (
    <Tooltip
      anchor={bullet.anchor}
      content={bullet.content}
      key={`bullet-tooltip-${index}`}
    />
  ));
}

render(<App />, document.getElementById('app'));

render(<BulletTooltips />, document.getElementById('tooltips'));
