import React from 'react';
import logo from './logo.svg';
import './App.css';

import { FirebaseContext } from './components/Firebase'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input_value: "",
            fb_value: "nothing to note",
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


                <div className="App">
                  <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                      Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                      className="App-link"
                      href="https://reactjs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn React
                    </a>
                  </header>
                </div>
            </div>
        );
    }
}

export default App;
