import * as React from 'react';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { getInputs } from '../utilities/dataSetup';

interface InputsViewProps {
  value: number;
  index: number;
}

interface IState {
  name: string;
  inputs: any;
}

class InputsView extends React.Component<InputsViewProps, IState> {

  constructor(props: InputsViewProps) {

    super(props);

    this.state = {
      name: 'InputsView',
      inputs: getInputs()
    }
    this.handleSave = this.handleSave.bind(this);

    this.render = this.render.bind(this);
  }

  handleSave() {

  }
  render() {
    console.log(this.state.inputs);
    return this.props.index === this.props.value ? (
      <Container style={{ marginBottom: '15px'}} >

        {Object.keys(this.state.inputs).map((inputKeys, i) => {
          return (

            <Card variant="outlined" style={{ marginTop: '15px', width: '100%'}}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <p>{inputKeys}</p>
                  <TextField id="outlined-basic" variant="outlined" value={this.state.inputs[inputKeys].toString()} />

                  <Button id={inputKeys} onClick={this.handleSave} variant="contained">Save</Button>
                </Stack>

              </CardContent>
            </Card>

          )
        })}
      </Container>
    ) : (<></>);
  }

}

export default InputsView;
