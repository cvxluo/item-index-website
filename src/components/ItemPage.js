import React from 'react';
import {
    Link,
    useParams,
} from 'react-router-dom';

import { withFirebase } from './backend/Firebase';

import * as ROUTES from '../constants/routes';

class ItemPage extends React.Component {

    componentDidMount() {

        const storage = this.props.firebase.storage;
        const url = 'item-images/' + this.props.itemID;
        const image_ref = storage.ref().child(url);

        image_ref.getDownloadURL().then(
            (url) => {
                this.setState({
                    image_url: url,
                });
            }
        ).catch(
            (err) => {
                console.log("Item has no image");
                this.setState({
                    image_url: '/image-placeholder.png',
                })

            }
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            image_url: '',
        }
    }

    render() {

        const item_name = this.props.itemID;
        const item_tags = this.props.item_info['tags'];
        const tag_display = Object.keys(item_tags).map(
            (tag_type, i) => {
                return (
                    <li key={i}>
                        <p>{tag_type} : {item_tags[tag_type]}</p>
                    </li>
                );
            }
        );

        console.log("PROPS ", this.props);
        console.log(this.props.item_info);


        console.log("IN ITEM PAGE");
        console.log(this.props.itemID);


        return (
            <div>
                <Link to={ROUTES.SEARCH}>Back</Link>

                <img
                    src={this.state.image_url}
                    alt={item_name}
                    />

                <p> { item_name } </p>
                <Link to={{
                    pathname:`${ROUTES.EDIT_ITEM}/${item_name}`,
                    state : {
                        item_info : this.props.item_info,
                        item_imageURL: this.state.image_url,
                    },
                }}>Edit</Link>
                <ol>
                    {tag_display}
                </ol>
            </div>
        );
    }

}

const ItemPageBackend = withFirebase(ItemPage);


function ItemPageRouter(props) {

    const { itemID } = useParams();
    const { item_info } = props.location.state;

    return (
        <ItemPageBackend
            itemID={itemID}
            item_info={item_info}
            />
    );

}




export default ItemPageRouter;
