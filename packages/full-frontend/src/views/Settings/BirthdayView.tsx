// import * as React from "react";

// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";

// import Stack from "@mui/material/Stack";

// import { Simulation } from "../../model/Base/Simulation";
// import Box from "@mui/material/Box";
// import { InputDataAccess } from "../../utilities/InputDataAccess";
// import { Input } from "../../model/Base/Input";

// interface BirthdayViewProps {
//   user: string;
//   simulation: Simulation | undefined;
// }

// interface IState {
//   input: Input | undefined;
// }

// class BirthdayView extends React.Component<BirthdayViewProps, IState> {
//   constructor(props: BirthdayViewProps) {
//     super(props);

//     this.state = {
//       input: undefined,
//     };

//     this.componentDidMount = this.componentDidMount.bind(this);
//     this.render = this.render.bind(this);
//     this.handleSave = this.handleSave.bind(this);
//   }

//   async componentDidMount() {
//     if (this.props.simulation) {
//       const input = await InputDataAccess.fetchInputsForSelectedSim(this.props.simulation.getKey());
//       this.setState({ input });
//     }
//   }

//   async handleSave(e: any) {
//     if (this.state.input) {
//       await InputDataAccess.updateInput(this.state.input);
//     }
//   }

//   render() {
//     if (this.props.simulation && this.state.input) {

//       console.log('tst');
//       // console.log( this.state.input.birthday);
//       console.log( this.state.input.birthday)

//       return (
//         <Box>
//           <h2>Birthday</h2>
//           <Card variant="outlined" style={{ marginTop: "15px", width: "100%" }}>
//             <CardContent>
//               <Stack direction="column" spacing={2}>
//                 <input
//                   type="date"
//                   value={this.state.input.birthday}
//                   onChange={(e) => {
//                     const st = this.state.input!;
//                     st.birthday = e.target.value
//                     this.setState({ input: st });
//                   }}
//                 />
//                 <Button id={""} onClick={this.handleSave} variant="contained">
//                   Save
//                 </Button>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Box>
//       );
//     } else {
//       return <></>;
//     }
//   }
// }
// export default BirthdayView;

import React from "react";

export class BirthdayView extends React.Component {
    render() {
        return (<></>)
    }
}