import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { createInputs, deleteInputs, updateInputs } from '../graphql/mutations';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Simulation } from '../model/Base/Simulation';

import { Input } from '../model/Base/Input';
import { InputDataAccess } from '../utilities/InputDataAccess';
import { cleanNumberDataInput } from '../utilities/helpers';
import Box from '@mui/material/Box';

interface InputsViewProps {
  user: string;
  simulation: Simulation | undefined;
}

interface IState {
  inputs: Input[],
}

class InputsView extends React.Component<InputsViewProps, IState> {

  constructor(props: InputsViewProps) {

    super(props);

    this.state = {
      inputs: []

    }

    this.handleChange = this.handleChange.bind(this);
    this.handleAddInput = this.handleAddInput.bind(this);
    this.getInputToSave = this.getInputToSave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.render = this.render.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const inpts = this.state.inputs;
    const tp = name.split('-')[0];
    const key = name.split('-')[1];

    for (const i of inpts) {
      if (i.key === key) {
        if (tp === 'key') {
          i.key = value;
        } else if (tp === 'value') {
          i.value = cleanNumberDataInput(value);
        } else if (tp === 'type') {
          i.type = value;
        }
      }
    }
    this.setState({ inputs: inpts });

  }


  async componentDidMount() {
    if (this.props.simulation) {
      await InputDataAccess.fetchInputsForSelectedSim(this, this.props.simulation.getKey());
    }
  }

  async handleAddInput() {
    try {
      let currInputs: any[] = [];

      if (this.state.inputs) {
        currInputs = this.state.inputs!;
      }

      const newInput: any = {
        id: new Date().getTime().toString(),
        key: 'key',
        value: 'value',
        type: 'number',
      };
      newInput['simulation'] = this.props.simulation!.id;
      currInputs.push(newInput);

      this.setState({
        inputs: currInputs
      });
      await API.graphql(graphqlOperation(createInputs, { input: newInput }))

    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  getInputToSave(id: string) {
    for (const i of this.state.inputs) {
      if (i.id === id) {
        return i;
      }
    }
  }

  async handleSave(e: any) {
    const id = e.target.id;

    try {
      const ipt = this.getInputToSave(id);
      await API.graphql(graphqlOperation(updateInputs, { input: ipt }));
    } catch (err) {
      console.log('error updating input:', err)
    }
  }

  async handleDelete(e: any) {
    const id = e.target.id;
    if (window.confirm('Are you sure you want to DELETE this Input?')) {
      let newInputs = [];
      let inputToDelete = null;

      for (const input of this.state.inputs) {
        if (input.id === id) {
          inputToDelete = {
            'id': input.id
          }
          continue;
        }
        newInputs.push(input);

      }
      this.setState({ inputs: newInputs });
      try {
        await API.graphql({ query: deleteInputs, variables: { input: inputToDelete } });
      } catch (err) {
        console.log('error:', err)
      }
    }
  }

  render() {


    return (
      <Box>
        <h1 >Settings</h1>

        <Button style={{ width: "100%" }} onClick={this.handleAddInput} variant="outlined">add input +</Button>
        {this.state.inputs ? this.state.inputs.map((input: any, i: number) => {

          return !input.type.includes('computed') ? (
            <>
              <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                <CardContent>

                  <Stack direction='column' spacing={2}>
                    <TextField label="Key" id="outlined-basic" variant="outlined" name={`key-${input.key}`} onChange={this.handleChange} value={input.key} />
                    {
                      (input.type === "date") ?
                        <>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Date"
                              value={input.value}
                              onChange={(newValue) => {
                                const ipts = this.state.inputs;
                                for (const i of ipts) {
                                  if (i.id === input.id) {
                                    i.value = newValue;
                                  }
                                }
                                this.setState({ inputs: ipts } as any);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </>
                        :
                        <><TextField label="Value" id="outlined-basic" variant="outlined" name={`value-${input.key}`} onChange={this.handleChange} value={input.value} /></>
                    }
                    <TextField label="Data Type" id="outlined-basic" variant="outlined" name={`type-${input.key}`} onChange={this.handleChange} value={input.type} />


                    <Button id={input.id} onClick={this.handleDelete} variant="outlined">Delete</Button>
                    <Button id={input.id} onClick={this.handleSave} variant="contained">Save</Button>


                  </Stack>

                </CardContent>
              </Card>


            </>
          ) : <>

            <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
              <CardContent>

                <Stack direction='row' spacing={4}>
                  <TextField disabled id="outlined-basic" variant="outlined" name={`key-${input.key}`} onChange={this.handleChange} value={input.key} />
                  <TextField disabled id="outlined-basic" variant="outlined" name={`value-${input.key}`} onChange={this.handleChange} value={input.value} />

                </Stack>

              </CardContent>
            </Card>

          </>

        }) : <></>}
      </Box>
    )
  }
}

export default InputsView;
