import React from 'react';
import {
    Link,
    useParams,
} from 'react-router-dom';
import './ItemPage.css';

import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';


import { withFirebase } from '../backend/Firebase';

import * as ROUTES from '../../constants/routes';


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
                    <ListItem
                        divider={true}
                        classes={{
                            root: 'centerListItem'
                        }}
                        key={i}
                        >
                        <ListItemText primary={tag_type} secondary={item_tags[tag_type]} />
                    </ListItem>
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

                <div className='center'>
                    <img
                        src={this.state.image_url}
                        alt={item_name}
                        className='itemImage'
                        />

                    <Typography
                        color='textPrimary'
                        variant='h2'
                        >
                        { item_name }
                    </Typography>

                    <Link style={{ textDecoration: 'none' }}
                        to={{
                        pathname:`${ROUTES.EDIT_ITEM}/${item_name}`,
                        state : {
                            item_info : this.props.item_info,
                            item_imageURL: this.state.image_url,
                        },
                    }}>Edit</Link>

                    <List>
                        {tag_display}
                    </List>


                </div>
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
