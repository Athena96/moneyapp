import * as React from 'react';

import Amplify, { API, graphqlOperation } from 'aws-amplify'


import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { fetchInputs } from '../utilities/helpers';

import { listInputs } from '../graphql/queries';
import { ListInputsQuery } from '../API';
import { updateInputs } from '../graphql/mutations';

interface InputsViewProps {
  value: number;
  index: number;
}

interface IState {
  inputs: any;
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
          i.value = value;
        }
      }
    }
    this.setState({ inputs: inpts });

  }

  componentDidMount() {
    fetchInputs(this);
  }

  handleAddInput() {

    let currInputs: any[] = [];

    if (this.state.inputs) {
      currInputs = this.state.inputs!;
    }

    currInputs.push({
      id: new Date().getTime().toString(),
      key: 'key',
      value: 'value',
      type: 'number'
    });

    this.setState({
      inputs: currInputs
    });
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
      console.log('error creating account:', err)
    }
  }

  render() {

    if (this.props.index === this.props.value) {

      return (
        < >

<Button style={{ width: "100%" }} onClick={this.handleAddInput} variant="outlined">add input +</Button>
          {this.state.inputs ? this.state.inputs.map((input: any, i: number) => {

            return !input.type.includes('computed') ? (
              <>
                <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                  <CardContent>

                    <Stack direction='row' spacing={4}>
                      <TextField id="outlined-basic" variant="outlined" name={`key-${input.key}`} onChange={this.handleChange} value={input.key} />
                      {
                        (input.type === "date") ?
                          <>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Basic example"
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
                          <><TextField id="outlined-basic" variant="outlined" name={`value-${input.key}`} onChange={this.handleChange} value={input.value} /></>
                      }

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


        </>
      )
    } else {
      return (<></>);
    }

  }

}

export default InputsView;
