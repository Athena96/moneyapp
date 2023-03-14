import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';

import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';
import { InputDataAccess } from '../../utilities/InputDataAccess';
import { Input } from '../../model/Base/Input';

interface AgeViewProps {
  user: string;
  simulation: Simulation | undefined;
}

interface IState {
  input: Input | undefined
}

class AgeView extends React.Component<AgeViewProps, IState> {

  constructor(props: AgeViewProps) {

    super(props);

    this.state = {
      input: undefined
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    if (this.props.simulation) {
      const input = await InputDataAccess.fetchInputsForSelectedSim(this.props.simulation.getKey());
      this.setState({input})

    }
  }

  async handleSave(e: any) {
    if (this.state.input) {
      await InputDataAccess.updateInput(this.state.input);
    }
  }

  render() {
    if (this.props.simulation) {
      return (
        <Box >
          <h2>Age</h2>
          <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
            <CardContent>
              <Stack direction='column' spacing={2}>
                <input type="text" value={this.state.input?.age} onChange={(e) => {

                    const st = this.state.input!
                    st.age = Number(e.target.value)
                    this.setState({ input: st })

                }} />
                <Button id={''} onClick={this.handleSave} variant="contained">Save</Button>
              </Stack>

            </CardContent>
          </Card>
        </Box>
      )
    } else {
      return (
        <></>
      )
    }
  }
}
export default AgeView;
