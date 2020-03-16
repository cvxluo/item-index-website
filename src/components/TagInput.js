import React from 'react'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


function TagInput(props) {

    const tag_inputs = props.tags;

    console.log(tag_inputs);
    const tag_boxes = tag_inputs.map(
        (tag, i) => {
            console.log("TAG I:", i);
            return (
                <li key={i}>
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


                </li>
            );
        }
    );


    return (
        <div>
            <p> Tags (Type of tag : attribute): </p>
            <Button
                variant='contained'
                color='primary'
                onClick={props.addTagSlot}
                >
                Add another tag!
            </Button>
            <ol>
                {tag_boxes}
            </ol>
        </div>
    );
}

export default TagInput;
