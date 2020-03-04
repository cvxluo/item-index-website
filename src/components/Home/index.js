import React from 'react';

import { withRouter } from 'react-router-dom';

class Home extends React.Component {

    render() {
        return (
            <p>home</p>
        );
    }
}

const HomePage = withRouter(Home);

export default HomePage;
