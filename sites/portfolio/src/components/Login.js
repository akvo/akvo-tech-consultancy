import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Alert,
} from 'react-bootstrap';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.state = {
      username: '',
      password: '',
      match: true,
    }
  }

  handleChange = (event) => {
    let fieldName = event.target.name;
    let fleldVal = event.target.value;
    this.setState({ [fieldName]: fleldVal });
  };
    
  login = () => {    
    const usr = process.env.REACT_APP_STATIC_USER;
    const pwd = process.env.REACT_APP_STATIC_PWD;
    const { username, password } = this.state;

    if (username === usr && password === pwd) {
      this.setState({ match: true });
      // set token
      const now = new Date()
      const item = {
        login: true,
        expiry: now.getTime() + (3600 * 1000)
      }
      localStorage.setItem('token', JSON.stringify(item));
      this.props.login(true);
      return true;
    }

    this.setState({ match: false });
  };

  render() {
    console.log(this.props);
    return (
      <Container>
        <Row className="justify-content-md-center" style={{ marginTop: "125px" }}>
          <Col xs={4}>
            <Form style={{
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "2px 2px 25px 5px #eeeeee"
            }}>
              <Row className="justify-content-md-center">
                <Col xs={4}>
                  <Image
                    src={`${process.env.PUBLIC_URL}/images/logo-akvo.png`}
                    height="38px"
                    style={{ backgroundColor: "black", marginBottom: "25px" }}
                  />
                </Col>
              </Row>
              {
                (!this.state.match)
                ? <Alert variant="danger">
                    Username & Password doesn't match.
                  </Alert>
                : null
              }
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  onChange={(e) => this.handleChange(e)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => this.handleChange(e)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={() => this.login()}
              >
                Login
              </Button>
            </Form>     
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
