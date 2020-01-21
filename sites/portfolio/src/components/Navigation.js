import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Navbar,
    Nav,
    Container,
    Image,
    Form,
    Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "/home"
        }
    }

    render() {
        return (
            <Navbar bg="dark" fixed="top" variant="dark" className="NavDark" expand="lg">
              <Container>
              <Navbar.Brand href="#home">
                  <Image
                      src="../images/logo-akvo.png"
                      height="38px"
                  />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" activeKey={this.state.active}>
                  <Nav.Link href="/home">Home</Nav.Link>
                  <Nav.Link eventKey="/portfolio">Portfolio</Nav.Link>
                  <Nav.Link eventKey="/contact">Contact</Nav.Link>
                </Nav>
                <Form inline>
                  <Button variant="secondary">
                      <FontAwesomeIcon icon={["fab", "github"]} /> GitHub
                  </Button>
                </Form>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
