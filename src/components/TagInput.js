import React from 'react'

function TagInput(props) {

    const tag_inputs = props.tags;

    console.log(tag_inputs);
    const tag_boxes = tag_inputs.map(
        (tag, i) => {
            return (
                <li key={i}>
                    <input
                        type='text'
                        value={tag['type']}
                        name='tag_type'
                        onChange={(e) => props.handleTagChange(e, i)}
                        />
                    <input
                        type='text'
                        value={tag['attribute']}
                        name='tag_attribute'
                        onChange={(e) => props.handleTagChange(e, i)}
                        />
                    <button type='button' onClick={(e) => props.handleTagDelete(e, i)}>Delete</button>


                </li>
            );
        }
    );

    return (
        <div>
            <p> Tags (Type of tag : attribute): </p>
            <button type='button' onClick={props.addTagSlot}>Add more tags</button>
            <ol>
                {tag_boxes}
            </ol>
        </div>
    );
}

export default TagInput;
