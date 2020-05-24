import React from 'react';
import ReactDOM from 'react-dom';

import AddAnnouncement from './AddAnnouncement';
// import AnnouncementListItem from './AnnouncementListItem';
// import { Editor } from '@atlaskit/editor-core';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  // <React.StrictMode>
    <AddAnnouncement />,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
