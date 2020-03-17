import React from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


function TagInput(props) {

    const tag_inputs = props.tags;

    console.log(tag_inputs);
    const tag_boxes = tag_inputs.map(
        (tag, i) => {
            console.log("TAG I:", i);
            return (
                <ListItem
                    divider='true'
                    alignItems='center'
                    key={i}
                    >
                    <TextField
                        name='tag_type'
                        value={tag['type']}
                        onChange={(e) => props.handleTagChange(e, i)}
                        style={{ margin: 5 }}
                        />

                    <TextField
                        name='tag_attribute'
                        value={tag['attribute']}
                        onChange={(e) => props.handleTagChange(e, i)}
                        style={{ margin: 5 }}
                        />

                    <button type='button' onClick={(e) => props.handleTagDelete(e, i)}>Delete</button>

                </ListItem>
            );
        }
    );


    return (
        <div className='center'>
            <Typography variant='h6'> Tags (Type of tag : attribute): </Typography>
            <Button
                variant='contained'
                color='primary'
                onClick={props.addTagSlot}
                >
                Add another tag!
            </Button>
            <List>
                {tag_boxes}
            </List>
        </div>
    );
}

export default TagInput;
