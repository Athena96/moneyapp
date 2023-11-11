// import * as React from "react";

// import { InputDataAccess } from "../../utilities/InputDataAccess";
// import { Simulation } from "../../model/Base/Simulation";
// import { Input } from "../../model/Base/Input";

// import { Link } from "react-router-dom";

// import Stack from "@mui/material/Stack";

// import Box from "@mui/material/Box";
// import Divider from "@mui/material/Divider";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import BirthdayView from "./BirthdayView";
// import ReturnView from "./ReturnView";
// import InflationView from "./InflationView";

// interface SettingsViewProps {
//   user: string;
//   simulation: Simulation | undefined;
// }

// interface IState {
//   input: Input | undefined;
// }

// class SettingsView extends React.Component<SettingsViewProps, IState> {
//   constructor(props: SettingsViewProps) {
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

//   async handleSave(e: any) {}

//   render() {
//     if (this.props.simulation && this.state.input) {
//       return (
//         <Box>
//           <Stack direction="row" spacing={1}>
//             <AccountCircleIcon />
//             <small>{this.props.user}</small>
//           </Stack>
//           <h1>Settings</h1>

//           <Divider />
//           <BirthdayView user={this.props.user} simulation={this.props.simulation} />
//           <ReturnView user={this.props.user} simulation={this.props.simulation} />
//           <InflationView user={this.props.user} simulation={this.props.simulation} />

//           <br />
//           <br />
//         </Box>
//       );
//     } else {
//       return (
//         <div style={{ textAlign: "center" }}>
//           <p>
//             Please create a <b>Simulation</b> first. <br />
//             Click <Link to="/scenarios">here</Link> to create one!
//           </p>
//         </div>
//       );
//     }
//   }
// }

// export default SettingsView;
import React from "react";

export class SettingsView extends React.Component {
    render() {
        return (<></>)
    }
}