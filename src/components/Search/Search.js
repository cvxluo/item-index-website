import React from 'react';
import './Search.css';

import {
    Link,
    withRouter,
} from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAlgolia } from '../Algolia';

import SearchBar from './SearchBar';
import ItemPage from './ItemPage';

import * as ROUTES from '../../constants/routes';


class Search extends React.Component {

    componentDidMount() {

        const firestore = this.props.firebase.firestore;
        const item_ref = firestore.collection('items');

        /*

        var retrieved_items = {};

        item_ref.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                const docID = doc.id;
                const docData = doc.data();

                retrieved_items[docID] = docData;
            });
        }).then(
            () => {
                this.setState({
                    items : retrieved_items,
                });
            }
        );
        */

        const stats_ref = firestore.collection('stats').doc('website');
        stats_ref.get().then(
            (stats_snapshot) => {
                const total_visits = stats_snapshot.data()['visits']
                console.log("Total visits: ", total_visits);

                stats_ref.set({ visits : total_visits + 1 });
            }
        );



        // Initially load all results
        const search_index = this.props.algolia.algolia_index;
        search_index.search(
            '',
            {
                hitsPerPage: 1000,
            }
        ).then((responses) => {
            this.setState({
                items_displayed: responses.hits,
            });
        });

    }

    constructor(props) {
        super(props);
        this.state = {
            search_value: "",
            items: {},
            items_displayed: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            search_value: event.target.value,
        });
        console.log(event.target.value);

        const search_index = this.props.algolia.algolia_index;
        search_index.search(
            event.target.value,
            {
                hitsPerPage: 50,
            }
        ).then((responses) => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            console.log(responses.hits);
            this.setState({
                items_displayed: responses.hits,
            });
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const firestore = this.props.firebase.firestore;
        const docRef = firestore.collection('test').doc(this.state.search_value);

        let data;
        docRef.get().then(doc => {
            if (doc.exists) {
                data = doc.data();
                console.log("Document data:", doc.data());

                this.setState({
                    fb_value: data['testfield'],
                });

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    data = "No such document!";
                }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            data = "Error retrieving document!";
        });

    }

    render() {

        const to_display = this.state.items_displayed;
        const display_item_names = to_display.map(
            (item, i) => {
                return (
                  <li key={i}>
                    <Link to={{
                        pathname:`${ROUTES.SEARCH}/${item['name']}`,
                        state : {
                            item_info : item,
                        },
                    }}>
                    {item['name']}
                    </Link>
                  </li>
                );
            }
        );


        return (
            <div>
                <div>
                    <ul>
                        <li>
                            <Link to={ROUTES.HOME}>Home</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.ADD_ITEM}>Add item</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <div className = "test">
                        <SearchBar
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.search_value}
                            />
                    </div>
                    <ol>
                        {display_item_names}
                    </ol>
                </div>
            </div>

        );
    }
}

const SearchPage = withRouter(withFirebase(withAlgolia(Search)));

export default SearchPage;
