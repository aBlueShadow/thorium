import React, { Component } from "react";
import { Input, Button, ButtonGroup } from "helpers/reactstrap";
import { Mutation } from "react-apollo";
import gql from "graphql-tag.macro";
import ViewscreenCardList from "./viewscreenCardList";
import Config from "./ConfigComponent";

class VideoViewscreenCore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: "Video",
      data: "{}",
      viewscreen:
        props.viewscreens.length === 1 ? props.viewscreens[0].id : "all"
    };
  }
  updateViewscreen = action => () => {
    const { viewscreen: id, data, component } = this.state;
    action({
      variables: { id, data, component, simulatorId: this.props.simulator.id }
    });
  };
  viewscreenAuto = action => () => {
    const { viewscreen: id } = this.state;
    action({ variables: { id, simulatorId: this.props.simulator.id } });
  };
  render() {
    const { viewscreens, simulator, flightId } = this.props;
    const { viewscreen, data, component } = this.state;
    return (
      <div className="core-viewscreen">
        <div className="upper">
          <Input
            type="select"
            bsSize="sm"
            className="btn-sm btn-primary"
            value={viewscreen}
            onChange={e => this.setState({ viewscreen: e.target.value })}
            style={{ width: "auto", height: "20px", float: "left" }}
          >
            <option value="nothing" disabled>
              Choose a Viewscreen
            </option>
            <option value="all">All Viewscreens</option>
            <option value="primary">Primary Viewscreens</option>
            <option value="secondary">Secondary Viewscreens</option>
            {viewscreens.map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Input>
          <ButtonGroup>
            <Mutation
              mutation={gql`
                mutation UpdateViewscreen(
                  $id: ID!
                  $simulatorId: ID
                  $component: String!
                  $data: String!
                ) {
                  updateViewscreenComponent(
                    id: $id
                    simulatorId: $simulatorId
                    component: $component
                    data: $data
                  )
                }
              `}
            >
              {action => (
                <Button
                  size="sm"
                  color="success"
                  disabled={!viewscreen}
                  onClick={this.updateViewscreen(action)}
                >
                  Update
                </Button>
              )}
            </Mutation>
            <Mutation
              mutation={gql`
                mutation SetViewscreenAuto($id: ID!, $simulatorId: ID) {
                  setViewscreenToAuto(id: $id, simulatorId: $simulatorId)
                }
              `}
            >
              {action => (
                <Button
                  size="sm"
                  color="info"
                  disabled={!viewscreen}
                  onClick={this.viewscreenAuto(action)}
                >
                  Auto
                </Button>
              )}
            </Mutation>
          </ButtonGroup>
          <label>
            <Mutation
              mutation={gql`
                mutation SetOverlay($id: ID!, $overlay: Boolean!) {
                  setClientOverlay(id: $id, overlay: $overlay)
                }
              `}
            >
              {action => {
                const viewscreenObj = viewscreens.find(
                  v => v.id === viewscreen
                );
                const overlay = viewscreenObj ? viewscreenObj.overlay : false;
                return (
                  <input
                    type="checkbox"
                    checked={overlay}
                    onChange={e =>
                      action({
                        variables: {
                          id:
                            viewscreen &&
                            viewscreens.find(v => v.id === viewscreen).id,
                          overlay: e.target.checked
                        }
                      })
                    }
                  />
                );
              }}
            </Mutation>{" "}
            Show card overlay
          </label>
        </div>
        <div className="lower">
          <ViewscreenCardList
            previewComponent={component}
            viewscreen={
              viewscreen && viewscreens.find(v => v.id === viewscreen)
            }
            update={c => this.setState({ component: c })}
          />
          <div className="config">
            <Config
              simple
              component={component}
              data={data}
              updateData={newData => this.setState({ data: newData })}
              simulator={simulator}
              flightId={flightId}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default VideoViewscreenCore;
