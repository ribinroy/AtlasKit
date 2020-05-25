import React from 'react';
import ReactDOM from 'react-dom';

import AddAnnouncement from './AddAnnouncement';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  // <React.StrictMode>
    <AddAnnouncement />,
  // </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
