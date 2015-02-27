import React from 'react';
import App from './reddadore.jsx';

(function AppInit(window) {
  "use strict";
  React.render(<App />, window.document.querySelector("#target"));
})(window);