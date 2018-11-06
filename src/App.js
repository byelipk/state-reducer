import React from "react";

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

class Chat extends React.Component {
  static defaultProps = {
    handleClick: () => console.log("Let's Chat"),
    stateReducer: (state, changes) => changes
  };
  initialMood = "Curious";
  initialState = {
    mood: this.initialMood
  };
  state = this.initialState;

  // Actions
  handleClick = () => {
    this.internalSetState(state => state, this.props.handleClick);
  };

  // Allow consumers of this component to update our state
  internalSetState(changes, callback) {
    this.setState(state => {
      // handle function setState call
      const changesObject =
        typeof changes === "function" ? changes(state) : changes;

      // apply state reducer
      const reducedChanges =
        this.props.stateReducer(state, changesObject) || {};

      // return null if there are no changes to be made
      // (to avoid an unecessary rerender)
      return Object.keys(reducedChanges).length ? reducedChanges : null;
    }, callback);
  }

  // Props Helpers
  getButtonProps = ({ onClick, ...props }) => ({
    onClick: callAll(onClick, this.handleClick),
    type: "button",
    className: "btn btn-funny",
    ...props
  });
  mapStateAndHelpers = () => {
    return {
      cta: `Click this ${this.state.mood} Button`,
      getButtonProps: this.getButtonProps
    };
  };
  render() {
    return (
      <div className="WTF">
        {this.props.children(this.mapStateAndHelpers())}
      </div>
    );
  }
}

class FunnyChat extends React.Component {
  initialState = {
    value: 0
  };
  state = this.initialState;
  handleClick = () => {
    this.setState({
      value: this.state.value + 1
    });
  };

  // Use FunnyChat state to update Chat state
  toggleStateReducer = (state, changes) => {
    if (this.state.value > 5 && this.state.value < 10) {
      return { ...changes, mood: "Happy" };
    } else if (this.state.value > 10) {
      return { ...changes, mood: "Silly" };
    } else {
      return changes;
    }
  };
  render() {
    return (
      <Chat stateReducer={this.toggleStateReducer} >
        {({ cta, getButtonProps }) => (
          <div className="funny-chat">
            <button
              {...getButtonProps({
                onClick: this.handleClick
              })}
            >
              {`${cta} - ${this.state.value}`}
            </button>
          </div>
        )}
      </Chat>
    );
  }
}

class App extends React.Component {
  render() {
    return <FunnyChat />;
  }
}

export default App;
