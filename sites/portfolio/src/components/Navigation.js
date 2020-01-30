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
        this.changePage = this.changePage.bind(this);
        this.state = {
            active: 'home'
        }
    }

    changePage (key) {
        window.scrollTo(0, 0)
        this.props.changePage(key);
        this.setState({
            active: this.props.value.page
        });
        return true;
    }

    render() {
        return (
            <Navbar bg="dark" fixed="top" variant="dark" className="NavDark" expand="lg">
              <Container>
              <Navbar.Brand href="#home">
                  <Image
                      src={`${process.env.PUBLIC_URL}/images/logo-akvo.png`}
                      height="38px"
                  />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav
                    className="mr-auto"
                    activeKey={this.props.value.page}
                    onSelect={this.changePage}
                >
                    { this.props.value.page
                        ? ""
                        : (
                            <Nav.Link eventKey="back">
                                <FontAwesomeIcon icon={["fas", "arrow-circle-left"]} /> Back
                            </Nav.Link>
                        )
                    }
                </Nav>
                <Form inline>
                  <a
                      className="btn btn-secondary text-white"
                      href="https://github.com/akvo/akvo-tech-consultancy"
                      target="_blank"
                  >
                      <FontAwesomeIcon icon={["fab", "github"]} /> GitHub
                  </a>
                </Form>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
