import React from 'react';
import './Search.css';

import {
    Link,
    withRouter,
} from 'react-router-dom';

import { withFirebase } from '../backend/Firebase';
import { withAlgolia } from '../backend/Algolia';

import SearchBar from './SearchBar';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';



import * as ROUTES from '../../constants/routes';


class Search extends React.Component {

    componentDidMount() {

        const firestore = this.props.firebase.firestore;
        /*
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


    render() {
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
                    <br />

                    <Container maxWidth='lg'>
                        <Grid container spacing={3}>
                            {this.state.items_displayed.map(
                                (item, i) => (
                                    <Grid item key={item['name']} xs={12} sm={6} md={4} lg={2}>
                                        <Card className='card'>
                                            <CardActionArea>
                                                <Link to={{
                                                    pathname:`${ROUTES.SEARCH}/${item['name']}`,
                                                    state : {
                                                        item_info : item,
                                                    },
                                                }}>
                                                    <CardMedia
                                                        className='cardMedia'
                                                        component='img'
                                                        image='/image-placeholder.png'
                                                        title={item['name']}
                                                    />
                                                    <CardContent className='cardContent'>
                                                        <Typography>{item['name']}
                                                        </Typography>
                                                    </CardContent>
                                                </Link>

                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            )}
                        </Grid>

                    </Container>

                </div>
            </div>

        );
    }
}

const SearchPage = withRouter(withFirebase(withAlgolia(Search)));

export default SearchPage;
