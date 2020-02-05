import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Navbar,
    Nav,
    Container,
    Image,
    Form
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

    changePage () {
        window.scrollTo(0, 0)
        this.props.changePage('home');
        this.setState({
            active: this.props.value.page
        });
        return true;
    }

    render() {
        return (
            <Navbar bg="dark" fixed="top" variant="dark" className="NavDark" expand="lg">
              <Container>
              <Navbar.Brand>
                  <Image
                      src={`${process.env.PUBLIC_URL}/images/logo-akvo.png`}
                      height="38px"
                  />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav
                    className="mr-auto"
                    activeKey={this.state.active}
                    onSelect={this.changePage}
                >
                    { this.props.value.page === "home"
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
                      rel="noopener noreferrer"
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
