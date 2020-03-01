import React, { Component } from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Dummy extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <InputGroup className="mb-3" size="sm">
            <FormControl
              placeholder="Find Project (e.g. Water Data Collection)"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon2">
                    <FontAwesomeIcon icon={["fas", "search"]} />
              </InputGroup.Text>
            </InputGroup.Append>
            </InputGroup>
        );
    }
}

export default Dummy;
