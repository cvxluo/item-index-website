import React from 'react';
import './App.css';

import { FirebaseContext } from './components/Firebase'

class App extends React.Component {

    componentDidMount() {

        const firestore = this.props.firebase.firestore;
        const item_ref = firestore.collection('items');

        var retrieved_items = {};

        item_ref.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
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

    }

    constructor(props) {
        super(props);
        this.state = {
            input_value: "",
            fb_value: "nothing to note",
            items: {},
        };

        this.input_updated = this.input_updated.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    input_updated(event) {
        this.setState({
            input_value: event.target.value,
        });
        console.log(this.state.input_value);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("TRYING TO SUBMIT");

        const firestore = this.props.firebase.firestore;
        const docRef = firestore.collection('test').doc(this.state.input_value);

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

        console.log(this.state.items);

        return (
            <div>
                <div className = "test">
                    <form onSubmit={this.handleSubmit}>
                      <label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Test"
                            onChange={this.input_updated}
                            value={this.state.input_value}
                            />
                      </label>
                      <button type="submit">Submit</button>
                    </form>
                </div>
                <div>
                    <p>{this.state.fb_value}</p>
                </div>
                <ol>
                    {display_items}

                </ol>
            </div>
        );
    }
}

export default App;
