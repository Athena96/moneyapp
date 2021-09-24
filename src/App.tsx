import * as React from 'react';

import './App.css';

import Main from './views/Main'

interface IProps {
}

interface IState {
  selectedTab: number;

}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {

    super(props);
    this.state = {
      selectedTab: 1
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  render() {

    return (
      <div >
        <Main />
      </div>

    );
  }
}

export default App;
