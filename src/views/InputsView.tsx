import * as React from 'react';

interface InputsViewProps {
  value: number;
  index: number;
}

interface IState {
  name: string
}

class InputsView extends React.Component<InputsViewProps, IState> {

  constructor(props: InputsViewProps) {

    super(props);

    this.state = {
      name: 'InputsView',
    }

    this.render = this.render.bind(this);
  }

  render() {
    return this.props.index === this.props.value ? (
      <div >
        <h1>Inputs View</h1>
      </div>
    ) : (<></>);
  }

}

export default InputsView;
