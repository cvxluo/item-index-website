import React from 'react';
import './Search.css';

import {
    Link,
    withRouter,
} from 'react-router-dom';

import { withFirebase } from '../backend/Firebase';
import { withAlgolia } from '../backend/Algolia';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';


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
                hitsPerPage: 5,
            }
        ).then((responses) => {
            this.setState({
                items_displayed: responses.hits,
            });
        });

        const storage_index = this.props.firebase.storage;
        const list_ref = storage_index.ref('item-images');

        list_ref.listAll().then(
            (res) => {
                res.items.forEach(
                    (itemRef) => {
                        const itemRefName = itemRef.name;
                        itemRef.getDownloadURL().then(
                            (url) => {
                                const new_items_with_images =
                                {
                                    ...this.state.items_with_images,
                                    [itemRefName]: url,
                                }
                                this.setState({
                                    items_with_images : new_items_with_images,
                                })
                            }
                        )
                    }
                )
            }
        )

    }

    constructor(props) {
        super(props);
        this.state = {
            search_value: "",
            items: {},
            items_displayed: [],
            items_with_images: {},
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
                hitsPerPage: 5,
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

                <div style={{ textAlign: 'center'}}>
                    <TextField
                       id='search-bar'
                       style={{
                           width: '75%',
                           marginBottom: 50
                       }}
                       label="Search"
                       value={this.state.search_value}
                       onChange={this.handleChange}
                       variant="filled"
                     />

                    <Container maxWidth='lg'>
                        <Grid container spacing={3}>
                            {this.state.items_displayed.map(
                                (item, i) => {

                                    let media;
                                    if (item['name'] in this.state.items_with_images) {
                                        media =
                                        <CardMedia
                                            className='cardMedia'
                                            component='img'
                                            image={this.state.items_with_images[item['name']]}
                                            title={item['name']}
                                        />;
                                    }
                                    else {
                                        media =
                                        <CardMedia
                                            className='cardMedia'
                                            component='img'
                                            image='/image-placeholder.png'
                                            title={item['name']}
                                        />;
                                    }
                                    {/*
                                    this.props.firebase.storage.ref().child('item-images/' + item['name']).getDownloadURL().then(
                                        (image_url) => {
                                            console.log("GOT IMAGE");
                                            media =
                                            <CardMedia
                                                className='cardMedia'
                                                component='img'
                                                image={image_url}
                                                title={item['name']}
                                            />;
                                        }).catch(
                                            (err) => {
                                                media =
                                                <CardMedia
                                                    className='cardMedia'
                                                    component='img'
                                                    image='/image-placeholder.png'
                                                    title={item['name']}
                                                />;
                                                console.log("ERROR: ", err.message);
                                        }
                                    );
                                    */}


                                    return (
                                        <Grid item key={item['name']} xs={12} sm={6} md={4} lg={2}>
                                            <Card className='card' variant='outlined'>
                                                <CardActionArea>
                                                    <Link style={{ textDecoration: 'none' }} to={{
                                                        pathname:`${ROUTES.SEARCH}/${item['name']}`,
                                                        state : {
                                                            item_info : item,
                                                        },
                                                    }}>
                                                        {media}
                                                        <CardContent className='cardContent'>
                                                            {/* <h2 align='center'>{item['name']}</h2> */}
                                                            <Typography variant='h5' align='center'>{item['name']}</Typography>
                                                        </CardContent>

                                                    </Link>
                                                    {/* Implement later, make sure prop forwarding works as expected
                                                    <CardActions>
                                                        <Button variant="contained" color="primary" component={Link} to={`${ROUTES.EDIT_ITEM}/${item['name']}`}> Edit </Button>
                                                    </CardActions>
                                                    */}

                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )
                                }
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
