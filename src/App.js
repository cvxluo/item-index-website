import React from 'react';
import './App.css';

import { FirebaseContext } from './components/Firebase';
import algoliasearch from 'algoliasearch';

import SearchBar from './components/SearchBar';

const client = algoliasearch('YLEE8RLU7T', process.env.REACT_APP_ALGOLIA_SECRET);
const index = client.initIndex('monumenta-item-index');


class App extends React.Component {

    componentDidMount() {

        const firestore = this.props.firebase.firestore;
        const item_ref = firestore.collection('items');

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

        const stats_ref = firestore.collection('stats').doc('website');
        stats_ref.get().then(
            (stats_snapshot) => {
                const total_visits = stats_snapshot.data()['visits']
                console.log("Total visits: ", total_visits);

                stats_ref.set({ visits : total_visits + 1 });
            }
        );

    }

    constructor(props) {
        super(props);
        this.state = {
            search_value: "",
            items: {},
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            search_value: event.target.value,
        });
        console.log(event.target.value);
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

        const all_items = this.state.items;
        const display_items = Object.keys(all_items).map(
            (item_key, index) => {
                return (
                  <li key={item_key}>
                    <p>{item_key}</p>
                  </li>
                );
            }
        );


        return (
            <div>
                <div className = "test">
                    <SearchBar
                        onChange={(e) => this.handleChange(e)}
                        value={this.state.search_value}
                        />
                </div>
                <ol>
                    {display_items}
                </ol>
            </div>
        );
    }
}

export default App;
