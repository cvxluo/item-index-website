import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation';

import Search from '../Search';
import AddItem from '../AddItem';

import * as ROUTES from '../../constants/routes';

function App(props) {

    console.log("DO I HAVE FIREBASE");
    console.log(props);
    return (
        <Router>
          <div>
            <Navigation />
            <hr />
            <Route exact path={ROUTES.LANDING} component={Search} />
            <Route path={ROUTES.SEARCH} component={Search} />
            <Route path={ROUTES.ADD_ITEM} component={AddItem} />
          </div>
        </Router>
    );
}

export default App;
