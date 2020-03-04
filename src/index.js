import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Firebase, { FirebaseContext } from './components/Firebase';
import Algolia, { AlgoliaContext } from './components/Algolia';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
      <AlgoliaContext.Provider value={new Algolia()}>
          <FirebaseContext.Consumer>
              { firebase =>
                  <AlgoliaContext.Consumer>
                      { algolia => <App firebase={firebase} algolia={algolia} /> }
                  </AlgoliaContext.Consumer>
              }
          </FirebaseContext.Consumer>
      </AlgoliaContext.Provider>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
