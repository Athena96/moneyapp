// import * as React from 'react';



// import { cleanNumberDataInput } from '../utilities/helpers';

// import { Button, TextField, Container, Stack, Divider } from '@mui/material';
// import { LocalizationProvider, DatePicker }from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';




// interface RecurringDetailProps {
//   scenarioId: string,
//   email: string
// }

// interface IState {
//   id: string;
//   name: string;
//   startAge: number;
//   endAge: number;
//   categories: Category[] | null;
//   type: ChargeType;
// }

// class RecurringDetailView extends React.Component<RecurringDetailProps, IState> {
//   constructor(props: RecurringDetailProps) {
//     super(props);
//     this.state = {
//       id: "",
//       name: "",
//       startAge: 0,
//       endAge: 0,
//       categories: [],
//       type: ChargeType.EXPENSE

//     }

//     this.handleChange = this.handleChange.bind(this);
//     this.handleAddCategory = this.handleAddCategory.bind(this);
//     this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
//     this.handleSave = this.handleSave.bind(this);
//     this.fetchRecurring = this.fetchRecurring.bind(this);
//     this.componentDidMount = this.componentDidMount.bind(this);
//   }
//   componentDidMount() {

//     this.fetchRecurring(window.location.pathname.split('/')[2])
//   }

//   async handleSave() {
//     const newRecurring = new Recurring(this.state.id, this.state.name, this.state.startAge, this.state.endAge, this.state.categories!, this.state.type, this.props.simulation.id);
//     await RecurringDataAccess.updateRecurring(newRecurring)
//   }

//   handleChange(e: React.ChangeOneTime<HTMLInputElement>) {
//     const target = e.target;
//     const value = target.value;
//     const name = target.name;
//     if (name.includes('category')) {
//       const cats = this.state.categories!
//       // ${cat.id}-category-name
//       const parts = name.split('-');
//       const id = parts[0];
//       const catname = parts[2]
//       for (const c of cats) {
//         if (id === c.id) {
//           if (name.includes("category-value")) {
//             (c as any)[catname] = cleanNumberDataInput(value);
//           } else {

//             (c as any)[catname] = value;
//           }
//         }
//       }

//       this.setState({ categories: cats });

//     } else {

//       this.setState({ [name]: value } as any);
//     }
//   }

//   handleAddCategory() {

//     let currCategories: Category[] = [];

//     if (this.state.categories) {
//       currCategories = this.state.categories!;
//     }

//     currCategories.push(new Category(new Date().getTime().toString(), '', 0));

//     this.setState({
//       categories: currCategories
//     });

//   }

//   async fetchRecurring(recurringId: string) {
//     const recurring = await RecurringDataAccess.getRecurring(recurringId)
//     this.setState({
//       id: recurring.id,
//       name: recurring.name,
//       startAge: recurring.startAge,
//       endAge: recurring.endAge,
//       categories: recurring.categories,
//       type: recurring.type
//     });
//   }

//   handleDeleteCategory(e: any) {
//     const target = e.target;
//     const catId = target.id;
//     let newListOfCategories = []
//     if (this.state.categories != null) {
//       for (const c of this.state.categories!) {

//         if (c.getKey() !== catId) {
//           newListOfCategories.push(c);
//         }
//       }
//       this.setState({ categories: newListOfCategories });
//     }
//   }

//   render() {
//     // todo add type input
//     return (
//       <div>
//         <Container sx={{ marginTop: '55px' }} maxWidth="sm">
//           <h2><b>Recurring</b></h2>
//           <Stack spacing={2}>
//           <TextField label="Name" id="outlined-basic" name={`name`} variant="outlined" onChange={this.handleChange} value={this.state.name} />
//           <TextField label="Name" id="outlined-basic" name={`name`} variant="outlined" onChange={this.handleChange} value={this.state.name} />
//           <TextField label="Start Age" id="outlined-basic" name={`name`} variant="outlined" onChange={this.handleChange} value={this.state.startAge} />
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Start Date"
//                 value={this.state.startAge}
//                 onChange={(newValue: any) => {
//                   this.setState({ startAge: newValue } as any);
//                 }}
//                 renderInput={(params: any) => <TextField {...params} />}
//               />
//             </LocalizationProvider>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="End Date"
//                 value={this.state.endAge}
//                 onChange={(newValue: any) => {
//                   this.setState({ endAge: newValue } as any);
//                 }}
//                 renderInput={(params: any) => <TextField {...params} />}
//               />
//             </LocalizationProvider>

//             <br />
//             <Divider />

//             <p><b>Categories</b></p>
//             <Stack spacing={2}>
//               {this.state.categories ? this.state.categories.map((cat, i) => {
//                 return (

//                   <>
//                     <TextField label="Category Name" id="outlined-basic" name={`${cat.id}-category-name`} variant="outlined" onChange={this.handleChange} value={cat.name} />
//                     <TextField label="Category Value" id="outlined-basic" name={`${cat.id}-category-value`} variant="outlined" onChange={this.handleChange} value={cat.value} />

//                     <Button id={cat.id} onClick={this.handleDeleteCategory} variant="contained">delete category</Button>

//                     <br />
//                     <Divider />
//                     {
//                       i === (this.state.categories!.length - 1) ? <><br /><Button onClick={this.handleAddCategory} variant="contained">add category +</Button></> : <></>
//                     }
//                   </>
//                 )

//               }) : <><br /><Button onClick={this.handleAddCategory} variant="contained">add category +</Button></>}
//             </Stack>
//             <Button id={this.state.id} onClick={this.handleSave} variant="contained">Save</Button>

//           </Stack>
//         </Container>

//       </div>
//     );
//   }
// }

// export default RecurringDetailView;
import React from "react";

export class RecurringDetailView extends React.Component {
    render() {
        return (<></>)
    }
}