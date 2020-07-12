import React from 'react';
import {
    Link,
    withRouter,
    useParams,
} from 'react-router-dom';
import './EditItem.css';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import { withFirebase } from '../backend/Firebase';
import { withAlgolia } from '../backend/Algolia';

import TagInput from '../TagInput';

import * as ROUTES from '../../constants/routes';


class EditItem extends React.Component {

    componentDidMount() {
        console.log("COMPONENT MOUNTING");

        const itemID = this.props.itemID;

        const storage = this.props.firebase.storage;
        const url = 'item-images/' + itemID;
        const image_ref = storage.ref().child(url);

        image_ref.getDownloadURL().then(
            (url) => {
                this.setState({
                    url : url,
                });
            }
        ).catch(
            (err) => {
                console.log("Item has no image");
                this.setState({
                    url : '/image-placeholder.png',
                });
            }
        );


        // Calling Firebase for the item's info
        const firestore = this.props.firebase.firestore;
        const item_ref = firestore.collection('items').doc(this.props.itemID);
        item_ref.get().then((doc) => {
            const tag_data = doc.data()['tags'];
            const item_tags = Object.keys(tag_data).map(
                (tag_type) => {
                    return {
                        'type': tag_type,
                        'attribute': tag_data[tag_type],
                    }
                }
            );
            this.setState({
                tags : item_tags,
            })

            console.log("ITEM TAGS ", item_tags);
        });



        this.setState({
            item_name: this.props.itemID,
        })

        console.log(this.state);
        
    }


    constructor(props) {
        super(props);

        this.state = {
            item_name : '',
            url: '',

            objectID : 12345, // Deletion won't work right now, because the previous method relied on getting objectID from history
            deleteDisplay: 'Delete',

            // Tags are structured as dicts inside a list - each dict contains the type and attribute of a tag
            tags : [],
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
            console.log("Found image file, trying to put");
            const file = this.imageInput.current.files[0];

            const storage = this.props.firebase.storage;
            const image_url = 'item-images/' + item_name;
            const image_ref = storage.ref().child(image_url);

            var metadata = { contentType: 'image/png' };

            console.log(image_ref);

            image_ref.put(file, metadata).catch(
                (error) => {
                    console.log(error);
                }
            );
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


                <TagInput
                    tags={this.state.tags}
                    handleTagChange={(e, i) => this.handleTagChange(e, i)}
                    addTagSlot={this.addTagSlot}
                    handleTagDelete={this.handleTagDelete}
                    />

                <Button variant='contained' onClick={this.handleSubmit}>Submit</Button>

                <Button onClick={this.handleDelete}>{this.state.deleteDisplay}</Button>

            </div>
        );
    }
}

const EditItemPage = withRouter(withFirebase(withAlgolia(EditItem)));


function EditPageRouter(props) {

    const { itemID } = useParams();
    return (
        <EditItemPage
            itemID={itemID}
        />
    );

}

export default EditPageRouter;
