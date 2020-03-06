import React from 'react';

import {
    Link,
    withRouter,
} from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAlgolia } from '../Algolia';

import TagInput from '../TagInput';

import * as ROUTES from '../../constants/routes';


class EditItem extends React.Component {

    constructor(props) {
        super(props);

        const { item_info } = props.location.state;

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
            url: '',

            objectID : item_info['objectID'],

            // Tags are structured as dicts inside a list - each dict contains the type and attribute of a tag
            tags : item_tags,
        };

        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleTagDelete = this.handleTagDelete.bind(this);
        this.addTagSlot = this.addTagSlot.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    }


    render() {

        return (
            <div>
                <Link to={ROUTES.SEARCH}>Back</Link>
                <p>Warning: your changes won't be saved</p>

                <p>Changing: {this.state.item_name}</p>

                <form onSubmit={this.handleSubmit}>

                    <TagInput
                        tags={this.state.tags}
                        handleTagChange={(e, i) => this.handleTagChange(e, i)}
                        addTagSlot={this.addTagSlot}
                        handleTagDelete={this.handleTagDelete}
                        />

                    <input type='submit' value='Submit'/>
                </form>

            </div>
        );
    }
}

const EditItemPage = withRouter(withFirebase(withAlgolia(EditItem)));

export default EditItemPage;
