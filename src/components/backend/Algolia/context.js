import React from 'react';

const AlgoliaContext = React.createContext(null);

export const withAlgolia = Component => props => (
    <AlgoliaContext.Consumer>
        {algolia => <Component {...props} algolia={algolia} />}
    </AlgoliaContext.Consumer>
);

export default AlgoliaContext;
