import * as React from 'react';

import Container from '@mui/material/Container';

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
      <Container sx={{ marginTop: '55px' }} maxWidth="sm">
      <h1>Inputs View</h1>
      </Container>
    ) : (<></>);
  }

}

export default InputsView;
