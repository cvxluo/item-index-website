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

            // Tags are structured as dicts inside a list - each dict contains the type and attribute of a tag
            tags : [],
        };

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
        item_ref.doc(item_name).set(item);


        const algolia = this.props.algolia.algolia_index;
        algolia.saveObjects([item], { autoGenerateObjectIDIfNotExist: true });


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
                        Item image url:
                        <input
                            type='text'
                            value={this.state.url}
                            name='url'
                            onChange={this.handleChange}
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
            </div>
        );
    }
}

const AddItemPage = withRouter(withFirebase(withAlgolia(AddItem)));

export default AddItemPage;
