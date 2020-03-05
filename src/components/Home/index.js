import React from 'react';

import {
    Link,
    withRouter,
} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

class Home extends React.Component {

    render() {
        return (
            <div>
                <ul>
                    <li>
                        <Link to={ROUTES.SEARCH}>Search</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.ADD_ITEM}>Add item</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

const HomePage = withRouter(Home);

export default HomePage;
