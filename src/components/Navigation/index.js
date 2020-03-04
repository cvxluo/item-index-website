import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

function Navigation(props) {
    return (
        <div>
          <ul>
            <li>
              <Link to={ROUTES.LANDING}>LANDING</Link>
            </li>
            <li>
              <Link to={ROUTES.ADD_ITEM}>ADD_ITEM</Link>
            </li>
            <li>
              <Link to={ROUTES.SEARCH}>INDEX</Link>
            </li>
          </ul>
        </div>
    );
}
  
export default Navigation;
