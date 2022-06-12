import * as React from 'react';



import { API, graphqlOperation } from 'aws-amplify'
import { updateInputs } from '../../graphql/mutations'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Simulation } from '../../model/Base/Simulation';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { InputDataAccess } from '../../utilities/InputDataAccess';
import { Input } from '../../model/Base/Input';

interface BirthdayViewProps {
  user: string;
  simulation: Simulation | undefined;
}

interface IState {
  birthday: string,
  input: Input | undefined
}

class BirthdayView extends React.Component<BirthdayViewProps, IState> {

  constructor(props: BirthdayViewProps) {

    super(props);

    this.state = {
      birthday: "",
      input: undefined
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    if (this.props.simulation) {
      await InputDataAccess.fetchInputsForSelectedSim(this, this.props.simulation.getKey());
      console.log(JSON.stringify(this.state.input))
    }
  }

  async handleSave(e: any) {
    try {
      if (this.state.input) {
        await API.graphql(graphqlOperation(updateInputs, {
          input: {
            id: this.state.input.id,
            settings: JSON.stringify(this.state.input.settings),
            simulation: this.state.input?.simulation
          }
        }));
      }
    } catch (err) {
      console.log('error updateInputs:', err)
    }
  }

  render() {
    if (this.props.simulation) {
      return (
        <Box >
          <h2>Birthday</h2>
          <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
            <CardContent>
              <Stack direction='column' spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Birthday"
                    value={this.state.input?.settings.birthday || new Date()}
                    onChange={(newValue) => {
                      const ipt = this.state.input;
                      if (ipt && newValue) {
                        ipt.settings.birthday = newValue;
                        this.setState({ input: ipt } as any);
                      }

                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
export default BirthdayView;
