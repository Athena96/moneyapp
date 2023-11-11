
// import '../App.css';
// import * as React from 'react';

// import { Link } from "react-router-dom";

// import { Simulation } from '../model/Base/Simulation';

// import AssetsView from './Assets/AssetsView';
// import ExpensesView from './Expenses/ExpensesView';

// import IncomesView from './Incomes/IncomesView';
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import StepContent from '@mui/material/StepContent';
// import Button from '@mui/material/Button';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import BirthdayView from './Settings/BirthdayView';
// import AssetAllocationView from './Settings/AssetAllocationView';
// import { InputDataAccess } from '../utilities/InputDataAccess';

// interface SetupViewProps {
//     user: string;
//     simulation: Simulation | undefined;

// }

// interface IState {
//     activeStep: number;
//     steps: any;
// }

// class SetupView extends React.Component<SetupViewProps, IState> {

//     constructor(props: SetupViewProps) {
//         super(props);
//         this.state = {
//             activeStep: 0,
//             steps: [
//                 {
//                     label: 'Add your Birthday',
//                     description: <><BirthdayView user={this.props.user} simulation={this.props.simulation} /></>,
//                 },
//                 {
//                     label: 'Add Asset Allocation',
//                     description: <><AssetAllocationView user={this.props.user} simulation={this.props.simulation} /></>,
//                 },
//                 {
//                     label: 'Add Assets',
//                     description: <><AssetsView user={this.props.user} simulation={this.props.simulation} /></>,

//                 },
//                 {
//                     label: 'Add Withdrawals',
//                     description: <><ExpensesView user={this.props.user} simulation={this.props.simulation} /></>,

//                 },
//                 {
//                     label: 'Add Contributions',
//                     description: <><IncomesView user={this.props.user} simulation={this.props.simulation} /></>,

//                 },
//             ]
//         }
//         this.componentDidMount = this.componentDidMount.bind(this);
//         this.render = this.render.bind(this);
//         this.handleNext = this.handleNext.bind(this);
//         this.handleBack = this.handleBack.bind(this);
//         this.handleReset = this.handleReset.bind(this);
//         this.handleTriggerSimulation = this.handleTriggerSimulation.bind(this);
//     }

//     async setFirstSignIn() {
//         if (this.props.simulation) {
//             try {
//                 const input = await InputDataAccess.fetchInputsForSelectedSim(this.props.simulation.id);
//                 input.firstSignIn = false;
//                 await InputDataAccess.updateInput(input);

//             } catch (err) {
//                 console.error('error updateInputs:', err)
//             }
//         }
//     }
    
//     async handleTriggerSimulation() {

//     }

//     componentDidMount() {
//         // 1) fetch simulations for user
//         // 2) if there are none, create one.
//         // 3) promp user to add accounts
//         // 4) next ->
//         // 5) 

//         // https://mui.com/material-ui/react-stepper/
//     }

//     handleNext = () => {
//         const currState = this.state.activeStep;
//         this.setState({ activeStep: currState + 1 });
//     }

//     handleBack = () => {
//         const currState = this.state.activeStep;
//         this.setState({ activeStep: currState - 1 });
//     }

//     handleReset = () => {

//         this.setState({ activeStep: 0 });
//     }

//     render() {
//         return (
//             <Box>
//                 <Box sx={{ }}>
//                     <Stepper activeStep={this.state.activeStep} orientation="vertical">
//                         {this.state.steps.map((step: any, index: any) => (
//                             <Step key={step.label}>
//                                 <StepLabel
//                                     optional={
//                                         index === this.state.steps.length - 1 ? (
//                                             <Typography variant="caption">Last step</Typography>
//                                         ) : null
//                                     }
//                                 >
//                                     {step.label}
//                                 </StepLabel>
//                                 <StepContent>
//                                     <Typography>{step.description}</Typography>
//                                     <Box sx={{ mb: 2 }}>
//                                         <div>
//                                             <Button
//                                                 variant="contained"
//                                                 onClick={this.handleNext}
//                                                 sx={{ mt: 1, mr: 1 }}
//                                             >
//                                                 {index === this.state.steps.length - 1 ? 'Finish' : 'Continue'}
//                                             </Button>
//                                             <Button
//                                                 disabled={index === 0}
//                                                 onClick={this.handleBack}
//                                                 sx={{ mt: 1, mr: 1 }}
//                                             >
//                                                 Back
//                                             </Button>
//                                         </div>
//                                     </Box>
//                                 </StepContent>
//                             </Step>
//                         ))}
//                     </Stepper>
//                     {this.state.activeStep === this.state.steps.length && (
//                         <Paper square elevation={0} sx={{ p: 3 }}>
//                             <Typography>You're all done! Click the button bellow to run your Monte Carlo Simulations.<br />
//                                 <Link style={{ color: 'black', textDecoration: 'none' }} to={`/`}><Button variant='outlined' onClick={this.handleTriggerSimulation}>Run Simulations</Button></Link>
//                             </Typography>
//                         </Paper>
//                     )}
//                 </Box>
//             </Box>
//         )
//     }
// }

// export default SetupView;
import React from "react";

export class SetupView extends React.Component {
    render() {
        return (<></>)
    }
}