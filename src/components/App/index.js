import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Home from '../Home';
import Search from '../Search';
import AddItem from '../AddItem';
import ItemPage from '../Search/ItemPage.js';
import EditItem from '../EditItem';

import * as ROUTES from '../../constants/routes';

function App(props) {

    return (
        <Router>
            <div>
                <hr />
                <Switch>
                    <Route path={`${ROUTES.SEARCH}/:itemID`} component={ItemPage} />
                    <Route path={`${ROUTES.EDIT_ITEM}/:itemID`} component={EditItem} />
                    <Route path={ROUTES.SEARCH} component={Search} />
                    <Route path={ROUTES.ADD_ITEM} component={AddItem} />
                    <Route path={ROUTES.HOME} component={Home} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
