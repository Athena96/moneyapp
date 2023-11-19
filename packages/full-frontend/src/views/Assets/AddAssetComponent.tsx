import * as React from 'react';

import {
  Card, TextField, Button,
  CardContent, Box, LinearProgress, Stack,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import {Asset} from '../../model/Base/Asset';

/* eslint-disable */
enum AssetType {
    Stock = 'Stock',
    Other = 'Other'
}
/* eslint-enable */

interface AddAssetComponentProps {
    asset: Asset
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleDeleteAsset: (event: any) => Promise<void>
    handleSave: (e: any) => Promise<void>
    setHasIndexData: (
      event: React.MouseEvent<HTMLDivElement> | undefined,
      has: boolean,
      assetToAdd: Asset) => void
}

interface IState {
    step: number,
    selectedType: AssetType
}

const NUM_STEPS: number = 2;

class AddAssetComponent extends React.Component<AddAssetComponentProps, IState> {
  constructor(props: AddAssetComponentProps) {
    super(props);

    this.state = {
      step: 1,
      selectedType: AssetType.Other,
    };


    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidMount() {

  }


  setDataAndNextStep(event: React.MouseEvent<HTMLDivElement> | undefined, has: boolean, assetToAdd: Asset) {
    this.props.setHasIndexData(event, has, this.props.asset);
    this.next();
    this.setState({selectedType: has ? AssetType.Stock : AssetType.Other});
  }


  getStepOneView() {
    return (
      <Box sx={{margin: '20px'}}>

        <Stack direction='column' spacing={2}>
          <Card onClick={(e) => this.setDataAndNextStep(e, true, this.props.asset)}>
            <BusinessIcon sx={{ml: '20px', mt: '20px'}} />
            <p style={{margin: '20px'}}>Stock/ETF</p>
          </Card>
          <Card onClick={(e) => this.setDataAndNextStep(e, false, this.props.asset)}>
            <InsertChartIcon sx={{ml: '20px', mt: '20px'}} />
            <p style={{margin: '20px'}}>Other (Home, Car, Art, ...)</p>
          </Card>
        </Stack>


      </Box>
    );
  }


  getAddStockView() {
    return (
      <>
        <Card variant="outlined" style={{marginTop: '15px', width: '100%'}}>
          <CardContent>
            <p><BusinessIcon/>{' '}<b>Stock/ETF</b></p>

            <Stack direction='column' spacing={2}>
              <TextField label="Ticker Code" id="outlined-basic"
                variant="outlined" name={`ticker-${this.props.asset.id}`}
                onChange={this.props.handleChange} value={this.props.asset.ticker} />
              <TextField label="Quantity" id="outlined-basic"
                variant="outlined" name={`quantity-${this.props.asset.id}`}
                onChange={this.props.handleChange} value={this.props.asset.quantity} />
              <Button id={this.props.asset.id}
                onClick={this.props.handleDeleteAsset} variant="outlined">Delete</Button>
              <Button id={this.props.asset.id}
                onClick={this.props.handleSave} variant="contained">Save</Button>
            </Stack>

          </CardContent>
        </Card>
      </>
    );
  }

  getAddOtherAssetView() {
    return (
      <>
        <Card variant="outlined" style={{marginTop: '15px', width: '100%'}}>
          <CardContent>

            <p><InsertChartIcon/>{' '}<b>Other (Home, Car, Art, ...)</b></p>

            <Stack direction='column' spacing={2}>
              <TextField label="Asset Name" id="outlined-basic" variant="outlined"
                name={`ticker-${this.props.asset.id}`}
                onChange={this.props.handleChange} value={this.props.asset.ticker} />
              <TextField label="Current Value (in dollars)" id="outlined-basic"
                variant="outlined" name={`quantity-${this.props.asset.id}`}
                onChange={this.props.handleChange} value={this.props.asset.quantity} />
              <Button id={this.props.asset.id}
                onClick={this.props.handleDeleteAsset} variant="outlined">Delete</Button>
              <Button id={this.props.asset.id}
                onClick={this.props.handleSave} variant="contained">Save</Button>
            </Stack>

          </CardContent>
        </Card>
      </>);
  }


  getStepTwoView() {
    switch (this.state.selectedType) {
      case AssetType.Stock:
        return this.getAddStockView();
      case AssetType.Other:
        return this.getAddOtherAssetView();
    }
  }
  getStepView(step: number) {
    switch (step) {
      case 1:
        return this.getStepOneView();
      default:
        return this.getStepTwoView();
    }
  }

  next() {
    const nextStep = this.state.step + 1;
    this.setState({step: nextStep});
  }

  render() {
    return (
      <Card variant="outlined" style={{marginTop: '15px', width: '100%'}}>
        <CardContent>

          <LinearProgress variant="determinate" value={Math.round((this.state.step / NUM_STEPS) * 100)} />

          {this.getStepView(this.state.step)}


        </CardContent>
      </Card>

    );
  }
};

export default AddAssetComponent;
