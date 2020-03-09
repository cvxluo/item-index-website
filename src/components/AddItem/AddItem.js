import React from 'react';

import {
    Link,
    withRouter,
} from 'react-router-dom';

import { withFirebase } from '../backend/Firebase';
import { withAlgolia } from '../backend/Algolia';

import TagInput from '../TagInput';

import * as ROUTES from '../../constants/routes';


class AddItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            item_name : '',
            url: '',

            error_state: '',

            // Tags are structured as dicts inside a list - each dict contains the type and attribute of a tag
            tags : [],
        };
        this.imageInput = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleTagDelete = this.handleTagDelete.bind(this);
        this.addTagSlot = this.addTagSlot.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const input_name = target.name;

        this.setState({
            [input_name]: target.value,
        });

    }

    handleTagChange(event, tag_index) {
        const target = event.target;
        const input_name = target.name;
        const tags = this.state.tags;

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

        if (!item_name) {
            this.setState({ error_state: 'Item must have a name!' });
            return;
        }
        const tags = this.state.tags;

        const item_tags = {};
        tags.forEach(
            (tag) => { item_tags[tag['type']] = tag['attribute'] }
        );

        const item = {
            'name': item_name,
            'tags': item_tags,
        }

        if (this.imageInput.current.files[0] !== undefined) {
            console.log(this.imageInput.current.files[0]);
            const file = this.imageInput.current.files[0];

            const storage = this.props.firebase.storage;
            const image_url = 'item-images/' + item_name;
            const image_ref = storage.ref().child(image_url);

            var metadata = { contentType: 'image/png' };

            console.log(image_ref);

            image_ref.put(file, metadata);
        }


        const firestore = this.props.firebase.firestore;
        const item_ref = firestore.collection('items');
        item_ref.doc(item_name).set(item);


        const algolia = this.props.algolia.algolia_index;
        algolia.saveObjects([item], { autoGenerateObjectIDIfNotExist: true });

        this.props.history.push(ROUTES.SEARCH);

    }


    render() {

        console.log(this.state.tags);
        return (
            <div>
                <div>
                    <ul>
                        <li>
                            <Link to={ROUTES.SEARCH}>Back</Link>
                        </li>
                    </ul>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Item name:
                        <input
                            type='text'
                            value={this.state.item_name}
                            name='item_name'
                            onChange={this.handleChange}
                            />
                    </label>
                    <br />
                    <label>
                        Item image (please try to get this from the resource pack):
                        <input
                            type='file'
                            ref={this.imageInput}
                            />
                    </label>
                    <br />

                    <TagInput
                        tags={this.state.tags}
                        handleTagChange={(e, i) => this.handleTagChange(e, i)}
                        addTagSlot={this.addTagSlot}
                        handleTagDelete={this.handleTagDelete}
                        />

                    <br />
                    <input type='submit' value='Submit'/>
                </form>

                <p>{this.state.error_state}</p>
            </div>
        );
    }
}

const AddItemPage = withRouter(withFirebase(withAlgolia(AddItem)));

export default AddItemPage;
