// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { Link } from "react-router-dom";

// import Box from "@mui/material/Box";

// import "../../App.css";
// import { Simulation } from "../../model/Base/Simulation";
// import { OneTime } from "../../model/Base/OneTime";
// import { InputDataAccess } from "../../utilities/InputDataAccess";

// import {
//   getRecurringContribWithdrawlTimeline,
//   getOneTimeContribWithdrawlTimeline,
//   calculateAge,
// } from "../../utilities/helpers";
// import { Recurring } from "../../model/Base/Recurring";
// interface DataViewProps {
//   user: string;
//   simulation: Simulation | undefined;
//   balanceData: number[];
//   recurrings: Recurring[];
//   onetimes: OneTime[];
// }

// interface IState {
//   onetimesMap: Map<number, OneTime[]>;
//   recurringsMap: Map<number, number>;
//   oneTimeMap: Map<number, number>;
//   startAge: number;
// }

// class DataView extends React.Component<DataViewProps, IState> {
//   constructor(props: DataViewProps) {
//     super(props);
//     this.state = {
//       onetimesMap: new Map(),
//       recurringsMap: new Map(),
//       oneTimeMap: new Map(),
//       startAge: 0,
//     };
//     this.componentDidMount = this.componentDidMount.bind(this);
//     this.render = this.render.bind(this);
//   }

//   async componentDidMount() {
//     // get Recurrings and OneTimes
//     // create year by year contrib/withdrawl of recurring and one time contrib/withdrawl
//     // add in table

//     const simId = this.props.simulation!.getKey();
//     const defaultInputs = await InputDataAccess.fetchInputsForSelectedSim(
//       simId
//     );
//     const startAge = calculateAge(defaultInputs.birthday)

//     // build onetimes map
//     const onetimesMap = new Map<number, OneTime[]>();
//     for (const event of this.props.onetimes) {
//       if (!onetimesMap.has(event.age)) {
//         onetimesMap.set(event.age, []);
//       }
//       onetimesMap.get(event.age)!.push(event);
//     }

//     const recurringsMap = getRecurringContribWithdrawlTimeline(
//       startAge,
//       this.props.recurrings
//     );
//     const oneTimeMap = getOneTimeContribWithdrawlTimeline(
//       startAge,
//       this.props.onetimes
//     );

//     this.setState({ onetimesMap, startAge, recurringsMap, oneTimeMap });
//   }

//   render() {
//     if (this.props.simulation) {
//       return (
//         <Box>
//           <h1>Data</h1>

//           <TableContainer component={Paper}>
//             <Table aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Age</TableCell>
//                   <TableCell align="center">Balance</TableCell>
//                   <TableCell align="center">Recurring +/-</TableCell>
//                   <TableCell align="center">One Time +/-</TableCell>
//                   <TableCell align="left">OneTimes</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {this.props.balanceData.map((row: number, i: number) => {
//                   const currentAge = i + this.state.startAge;
//                   const onetimesAtRow =
//                     this.state.onetimesMap.get(currentAge) || [];
//                   const recurringContribWithdrawl =
//                     this.state.recurringsMap.get(currentAge) || 0.0;
//                   const oneTimeContribWithdrawl =
//                     this.state.oneTimeMap.get(currentAge) || 0.0;
//                   return (
//                     <TableRow
//                       style={{ backgroundColor: "white" }}
//                       key={`${i + this.state.startAge}`}
//                       sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                     >
//                       <TableCell component="th" scope="row">
//                         {`${i + this.state.startAge}`}
//                       </TableCell>

//                       <TableCell align="center">
//                         ${Number(row).toFixed(2)}
//                       </TableCell>
//                       <TableCell align="center">
//                         ${recurringContribWithdrawl.toFixed(2)} (/month $
//                         {(recurringContribWithdrawl / 12.0).toFixed(2)})
//                       </TableCell>
//                       <TableCell align="center">
//                         ${oneTimeContribWithdrawl.toFixed(2)}
//                       </TableCell>

//                       {/* <TableCell align="center">{row.taxBal}</TableCell>
//                                                 <TableCell align="center">{row.sum}</TableCell> */}
//                       <TableCell align="left">
//                         {onetimesAtRow.map((e) => {
//                           const pm =
//                             e.type!.toString() === "Expense" ? "-" : "+";
//                           return (
//                             <Link to={`/event/${e.getKey()}`}>
//                               {e.name === "" || e.name === "..."
//                                 ? `${pm}$${e.category!.value} | `
//                                 : `${e.name} ${pm}$${e.category!.value} | `}
//                             </Link>
//                           );
//                         })}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
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

// export default DataView;

import React from "react";

export class DataView extends React.Component {
    render() {
        return (<></>)
    }
}