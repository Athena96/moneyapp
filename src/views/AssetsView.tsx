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

import { fetchAssets } from '../utilities/helpers';

import { createAssets, deleteAssets, updateAssets } from '../graphql/mutations';
import { Asset } from '../model/Asset';

interface AssetsViewProps {
  value: number;
  index: number;
}

interface IState {
    assets: Asset[]
}

class AssetsView extends React.Component<AssetsViewProps, IState> {

  constructor(props: AssetsViewProps) {

    super(props);

    this.state = {
      assets: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleAddInput = this.handleAddInput.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.render = this.render.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const assts = this.state.assets;
    const tp = name.split('-')[0];
    const key = name.split('-')[1];

    for (const asset of assts) {

      if (asset.getKey() === key) {
          console.log("match....");
          if (tp === 'ticker') {
              asset.ticker = value;
          }
          if (tp === 'quantity') {
            asset.quantity = Number(value);
        }
        if (tp === 'hasIndexData') {
            asset.hasIndexData = Number(value);
        }
        if (tp === 'account') {
            asset.account = value;
        }
        if (tp === 'isCurrency') {
            asset.isCurrency = Number(value);
        }
      }
    }
    this.setState({ assets: assts });

  }

  componentDidMount() {
    fetchAssets(this);
  }

  async handleAddInput() {
    try {
        let newAsset = new Asset( new Date().getTime().toString(), "OOO", 0, 1, '...', 0);
        let newAssets = [...this.state.assets, newAsset]
        this.setState({ assets: newAssets });
        await API.graphql(graphqlOperation(createAssets, { input: newAsset }))
      } catch (err) {
        console.log('error creating todo:', err)
      }
    
  }

  getAssetToSave(id: string) {
    for (const i of this.state.assets) {
      if (i.getKey() === id) {
        return i;
      }
    }
  }

  async handleSave(e: any) {
    const id = e.target.id;

    try {
      const ipt = this.getAssetToSave(id);
      await API.graphql(graphqlOperation(updateAssets, { input: ipt }));
    } catch (err) {
      console.log('error creating account:', err)
    }
  }

  async handleDelete(event: any) {
    const idToDelete = (event.target as Element).id;
    let newAssets = [];
    let assetToDelete = null;

    for (const asset of this.state.assets) {
      if (asset.getKey() === idToDelete) {
        assetToDelete = {
          'id': asset.getKey()
        }
        continue;
      }
      newAssets.push(asset);

    }
    this.setState({ assets: newAssets });
    try {
      await API.graphql({ query: deleteAssets, variables: { input: assetToDelete } });
    } catch (err) {
      console.log('error:', err)
    }
  }
  render() {

    if (this.props.index === this.props.value) {

      return (
        < >

<Button style={{ width: "100%" }} onClick={this.handleAddInput} variant="outlined">add assets +</Button>
          {this.state.assets ? this.state.assets.map((asset: Asset, i: number) => {

            return (
                <Card variant="outlined" style={{ marginTop: '15px', width: '100%' }}>
                <CardContent>

                  <Stack direction='row' spacing={4}>
                    <p>ticker</p><TextField id="outlined-basic" variant="outlined" name={`ticker-${asset.getKey()}`} onChange={this.handleChange} value={asset.ticker} />
                    <p>quantity</p><TextField id="outlined-basic" variant="outlined" name={`quantity-${asset.getKey()}`} onChange={this.handleChange} value={asset.quantity} />
                    <p>hasIndexData</p><TextField id="outlined-basic" variant="outlined" name={`hasIndexData-${asset.getKey()}`} onChange={this.handleChange} value={asset.hasIndexData} />
                    <p>account</p><TextField id="outlined-basic" variant="outlined" name={`account-${asset.getKey()}`} onChange={this.handleChange} value={asset.account} />
                    <p>isCurrency</p><TextField id="outlined-basic" variant="outlined" name={`isCurrency-${asset.getKey()}`} onChange={this.handleChange} value={asset.isCurrency} />

                    <Button id={asset.getKey()} onClick={this.handleSave} variant="contained">Save</Button>
                    <Button id={asset.getKey()} onClick={this.handleDelete} variant="outlined">Delete</Button>


                  </Stack>

                </CardContent>
              </Card>

            );


          }) : <></>}


        </>
      )
    } else {
      return (<></>);
    }

  }

}

export default AssetsView;
