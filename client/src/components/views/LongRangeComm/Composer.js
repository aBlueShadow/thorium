import React, { Component } from "react";
import { withApollo } from "react-apollo";
import gql from "graphql-tag.macro";
import { Button, Row, Col, Container, Input } from "helpers/reactstrap";

class MessageComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      to: ""
    };
  }
  updateTo(e) {
    this.setState({
      to: e.target.value
    });
  }
  updateMessage(e) {
    this.setState({
      message: e.target.value
    });
  }
  sendMessage = () => {
    const mutation = gql`
      mutation SendLRMessage($id: ID, $message: String!, $sender: String) {
        sendLongRangeMessage(
          simulatorId: $id
          crew: false
          message: $message
          decoded: true
          sender: $sender
        )
      }
    `;
    const variables = {
      id: this.props.simulator.id,
      message: `To: ${this.state.to}
${this.state.message}`,
      sender: this.props.station.name
    };
    this.props.client.mutate({
      mutation,
      variables
    });
    this.setState({
      to: "",
      message: ""
    });
    this.props.cancel && this.props.cancel();
  };
  render() {
    const { cancel } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col sm={2}>
            <h2>To:</h2>
          </Col>
          <Col sm={10}>
            <Input value={this.state.to} onChange={this.updateTo.bind(this)} />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Input
              type="textarea"
              style={{
                width: "100%",
                height: "20vw",
                resize: "none"
              }}
              value={this.state.message}
              onChange={this.updateMessage.bind(this)}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 6 }}>
            {cancel ? (
              <Button color="danger" onClick={cancel} block>
                Cancel
              </Button>
            ) : (
              <Button
                color="danger"
                onClick={() => this.setState({ to: "", message: "" })}
                block
              >
                Clear
              </Button>
            )}
          </Col>
          <Col sm={6}>
            <Button
              onClick={this.sendMessage}
              disabled={
                this.state.message.length === 0 || this.state.to.length === 0
              }
              block
            >
              Queue for Sending
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withApollo(MessageComposer);
