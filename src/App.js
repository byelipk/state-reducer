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
  handleReset = () => {
    this.internalSetState(this.initialState);
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
  getResetProps = ({ onClick, ...props }) => ({
    onClick: callAll(onClick, this.handleReset),
    type: "button",
    className: "btn btn-reset",
    ...props
  });
  mapStateAndHelpers = () => {
    return {
      mood: this.state.mood,
      getButtonProps: this.getButtonProps,
      getResetProps: this.getResetProps
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
  initialClickState = {
    isCurious: false,
    isHappy: false,
    isSilly: false
  };
  initialState = {
    value: 0,
    ...this.initialClickState
  };
  state = this.initialState;
  handleClick = () => {
    this.setState({
      value: this.state.value + 1
    });
  };
  handleHappyClick = () => {
    this.setState(({ isHappy }) => ({
      ...this.initialClickState,
      isHappy: !isHappy
    }));
  };
  handleCuriousClick = () => {
    this.setState(({ isCurious }) => ({
      ...this.initialClickState,
      isCurious: !isCurious
    }));
  };
  handleSillyClick = () => {
    this.setState(({ isSilly }) => ({
      ...this.initialClickState,
      isSilly: !isSilly
    }));
  };
  handleReset = () => {
    this.setState(this.initialState);
  };

  // A type of "hook" we can use to update Chat's internal state
  toggleStateReducer = (state, changes) => {
    if (this.state.isCurious) {
      return { ...changes, mood: "Curious" };
    } 
    else if (this.state.isHappy) {
      return { ...changes, mood: "Happy" };
    } 
    else if (this.state.isSilly) {
      return { ...changes, mood: "Silly" };
    } 
    else if (this.state.value > 5 && this.state.value < 10) {
      return { ...changes, mood: "Happy" };
    } 
    else if (this.state.value > 10) {
      return { ...changes, mood: "Silly" };
    } 
    else {
      return changes;
    }
  };
  render() {
    return (
      <Chat stateReducer={this.toggleStateReducer}>
        {({ mood, getButtonProps, getResetProps }) => (
          <div className="funny-chat">
            <button
              {...getButtonProps({
                onClick: this.handleClick
              })}
            >
              {`Click this ${mood} Button - ${this.state.value}`}
            </button>
            <hr />
            <button
              {...getButtonProps({
                onClick: this.handleHappyClick
              })}
            >
              Be Happy
            </button>
            <button
              {...getButtonProps({
                onClick: this.handleCuriousClick
              })}
            >
              Be Curious
            </button>
            <button
              {...getButtonProps({
                onClick: this.handleSillyClick
              })}
            >
              Be Silly
            </button>
            <button
              {...getResetProps({
                onClick: this.handleReset
              })}
            >
              Start Over
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
