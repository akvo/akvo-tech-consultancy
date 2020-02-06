import React, { Component } from 'react';
import { redux } from 'react-redux';
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
            active: this.props.value.active
        });
        return true;
    }

    render() {
        return (
            <Navbar bg="light" fixed="top" variant="light" className="NavLight" expand="lg">
              <Container>
              <Navbar.Brand href="#home">
                  <Image
                      src={`${process.env.MIX_PUBLIC_URL}/images/logo-unep.png`}
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
                    <Nav.Link eventKey="home">Home</Nav.Link>
                    <Nav.Link eventKey="summary">Summary</Nav.Link>
                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                    <Nav.Link eventKey="actions">Actions</Nav.Link>
                    <Nav.Link eventKey="evaluation">Evaluation</Nav.Link>
                    <Nav.Link eventKey="funding">Funding</Nav.Link>
                </Nav>
                <Form inline className='nav-right'>
                  <a
                      className="btn btn-primary text-white"
                      href="https://github.com/akvo/akvo-tech-consultancy"
                      target="_blank"
                  >
                      <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} /> Resources
                  </a>
                </Form>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
