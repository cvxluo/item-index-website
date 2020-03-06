import React from 'react';
import {
    Link,
    useParams,
} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';


function ItemPage(props) {

    const { itemID } = useParams();
    const { item_info } = props.location.state;

    const item_name = itemID;
    const item_tags = item_info['tags'];
    const tag_display = Object.keys(item_tags).map(
        (tag_type, i) => {
            return (
                <li key={i}>
                    <p>{tag_type} : {item_tags[tag_type]}</p>
                </li>
            );
        }
    );



    console.log(item_info);


    console.log("IN ITEM PAGE");
    console.log(itemID);
    return (
        <div>
            <Link to={ROUTES.SEARCH}>Back</Link>

            <p> { item_name } </p>
            <Link to={{
                pathname:`${ROUTES.EDIT_ITEM}/${item_name}`,
                state : {
                    item_info : item_info,
                },
            }}>Edit</Link>
            <ol>
                {tag_display}
            </ol>
        </div>


    );
}

export default ItemPage;
