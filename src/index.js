import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import 'whatwg-fetch';

import registerCacheStaticSW from 'workers/cache-static.sw';
import Routes from 'containers/routes';

import './reset.css';

const { NODE_ENV, PUBLIC_PATH } = process.env;

function render(Component) {
  ReactDOM.render((
    <BrowserRouter basename={PUBLIC_PATH}>
      <Component />
    </BrowserRouter>
  ), document.getElementById('root'));
}

render(Routes);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    registerCacheStaticSW()
  });
}

if (NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./containers/routes', () => {
    const newRoutes = require('./containers/routes').default; // eslint-disable-line
    render(newRoutes);
  });
}
