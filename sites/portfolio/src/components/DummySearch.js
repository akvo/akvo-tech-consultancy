import React, { Component } from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DummySearch extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <InputGroup className="mb-3" size="sm">
            <FormControl
              placeholder={this.props.first}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <FormControl
              placeholder={this.props.second}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon2">
                    <FontAwesomeIcon icon={["fas", this.props.icon]} />
              </InputGroup.Text>
            </InputGroup.Append>
            </InputGroup>
        );
    }
}

export default DummySearch;
