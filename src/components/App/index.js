import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Home from '../Home';
import Search from '../Search';
import AddItem from '../AddItem';

import * as ROUTES from '../../constants/routes';

function App(props) {
    return (
        <Router>
            <div>
                <hr />
                <Switch>
                    <Route path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.SEARCH} component={Search} />
                    <Route path={ROUTES.ADD_ITEM} component={AddItem} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
