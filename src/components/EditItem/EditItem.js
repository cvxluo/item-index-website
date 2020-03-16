import React from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import './EditItem.css';

import Typography from '@material-ui/core/Typography';


import { withFirebase } from '../backend/Firebase';
import { withAlgolia } from '../backend/Algolia';

import TagInput from '../TagInput';

import * as ROUTES from '../../constants/routes';


class EditItem extends React.Component {

    constructor(props) {
        super(props);

        const item_info = props.location.state.item_info;
        const item_imageURL = props.location.state.item_imageURL;

        console.log(item_info);

        const item_tags = Object.keys(item_info['tags']).map(
            (tag_type) => {
                return {
                    'type': tag_type,
                    'attribute': item_info['tags'][tag_type],
                }
            }
        )
        console.log("ITEM TAGS ", item_tags);

        this.state = {
            item_name : item_info['name'],
            url: item_imageURL,

            objectID : item_info['objectID'],
            deleteDisplay: 'Delete',

            // Tags are structured as dicts inside a list - each dict contains the type and attribute of a tag
            tags : item_tags,
        };

        this.imageInput = React.createRef();

        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleTagDelete = this.handleTagDelete.bind(this);
        this.addTagSlot = this.addTagSlot.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(event) {
        event.preventDefault();

        const item_name = this.state.item_name;
        const tags = this.state.tags;

        if (this.state.deleteDisplay === 'Delete') {
            this.setState({ deleteDisplay: 'Are you sure you want to delete this item?' })
        }

        else if (this.state.deleteDisplay === 'Are you sure you want to delete this item?') {
            const firestore = this.props.firebase.firestore;
            const item_ref = firestore.collection('items');
            item_ref.doc(item_name).delete();
            // Maybe catch errors

            const algolia = this.props.algolia.algolia_index;
            algolia.deleteObject(this.state.objectID);



            const file = this.imageInput.current.files[0];

            const storage = this.props.firebase.storage;
            const image_url = 'item-images/' + item_name;
            const image_ref = storage.ref().child(image_url);

            console.log(image_ref);

            image_ref.delete();

            this.props.history.push(ROUTES.SEARCH);
        }

    }


    handleTagChange(event, tag_index) {
        const target = event.target;
        const input_name = target.name;
        const tags = this.state.tags;

        console.log("EDIT ITEM STATE:", this.state);
        console.log(tags);
        console.log("TAG INDEX:", tag_index);

        if (input_name === 'tag_type') {
            tags[tag_index]['type'] = target.value;
        }
        else if (input_name === 'tag_attribute') {
            tags[tag_index]['attribute'] = target.value;
        }

        this.setState({ tags : tags });
    }

    handleTagDelete(event, tag_index) {
        const tags = this.state.tags;
        tags.splice(tag_index, 1);
        this.setState({ tags: tags });

    }

    addTagSlot(event) {
        event.preventDefault();
        this.setState({
            tags :
            [...this.state.tags,
                {
                    'type': '',
                    'attribute': '',
                }
            ]
        });

    }

    handleSubmit(event) {
        console.log("HANDLESUBMIT CALLED");
        event.preventDefault();

        const item_name = this.state.item_name;
        const tags = this.state.tags;

        const item_tags = {};
        tags.forEach(
            (tag) => { item_tags[tag['type']] = tag['attribute'] }
        );

        const item = {
            'name': item_name,
            'tags': item_tags,
        }

        const firestore = this.props.firebase.firestore;
        const item_ref = firestore.collection('items');
        item_ref.doc(item_name).update(item);


        const algolia_item = {
            ...item,
            'objectID': this.state.objectID,
        }

        const algolia = this.props.algolia.algolia_index;
        algolia.partialUpdateObjects([algolia_item]);


        console.log(this.imageInput.current);
        if (this.imageInput.current.files[0] !== undefined) {
            const file = this.imageInput.current.files[0];

            const storage = this.props.firebase.storage;
            const image_url = 'item-images/' + item_name;
            const image_ref = storage.ref().child(image_url);

            var metadata = { contentType: 'image/png' };

            console.log(image_ref);

            image_ref.put(file, metadata);
        }

        this.props.history.push(ROUTES.SEARCH);


    }


    render() {

        console.log("IMAGE URL FOUND FROM EDIT:", this.state.url)

        return (
            <div>
                <Link to={ROUTES.SEARCH}>Back</Link>
                    <Typography
                        color='textPrimary'
                        variant='overline'
                        display='block'
                        >
                        Warning - if you leave now, your changes won't be saved
                    </Typography>


                <div className='center'>
                    <img
                        src={this.state.url}
                        alt={this.props.item_name}
                        className='item-image'
                        />
                </div>


                <label>
                    <Typography
                        variant='body1'
                        >
                        Replace image (please try to get this from the resource pack):
                    </Typography>
                    <input
                        type='file'
                        ref={this.imageInput}
                        />
                </label>

                <form onSubmit={this.handleSubmit}>

                    <TagInput
                        tags={this.state.tags}
                        handleTagChange={(e, i) => this.handleTagChange(e, i)}
                        addTagSlot={this.addTagSlot}
                        handleTagDelete={this.handleTagDelete}
                        />

                    <input type='submit' value='Submit'/>
                    <br />

                    <button onClick={this.handleDelete}>{this.state.deleteDisplay}</button>
                </form>

            </div>
        );
    }
}

const EditItemPage = withRouter(withFirebase(withAlgolia(EditItem)));

export default EditItemPage;
