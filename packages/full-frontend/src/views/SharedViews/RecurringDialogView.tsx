// import * as React from 'react';
// import { CategoryTypes } from '../../API';

// import { Simulation } from "../../model/Base/Simulation";
// import { Recurring } from "../../model/Base/Recurring";
// import { Category } from '../../model/Base/Category';

// import { cleanNumberDataInput } from '../../utilities/helpers';
// import { RecurringDataAccess } from '../../utilities/RecurringDataAccess';

// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// interface RecurringDialogViewProps {
//     user: string;
//     simulation: Simulation;
//     recurring: Recurring;
//     type: CategoryTypes;
//     closeDialog: () => void;

// }

// interface RecurringDialogViewState {
//     recurringToSave: Recurring
// }


// class RecurringDialogView extends React.Component<RecurringDialogViewProps, RecurringDialogViewState> {
//     constructor(props: RecurringDialogViewProps) {
//         super(props)
//         this.state = {
//             recurringToSave: this.props.recurring
//         }
//         this.componentDidMount = this.componentDidMount.bind(this);
//         this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
//     }

//     componentDidMount() {

//     }

//     handleRecurringNameChange(event: React.ChangeOneTime<HTMLInputElement | HTMLTextAreaElement>) {
//         const newName = event.target.value;
//         if (this.state.recurringToSave) {
//             const recurring = this.state.recurringToSave;
//             recurring.name = newName;
//             this.setState({ recurringToSave: recurring })
//         }
//     }

//     handleCategoryNameUpdate(event: React.ChangeOneTime<HTMLInputElement | HTMLTextAreaElement>, index: number) {
//         const newVal = event.target.value;
//         if (this.state.recurringToSave) {
//             const recurring = this.state.recurringToSave;
//             recurring.categories![index].name = newVal;
//             this.setState({ recurringToSave: recurring })
//         }
//     }

//     handleCateogryValueUpdate(event: React.ChangeOneTime<HTMLInputElement | HTMLTextAreaElement>, index: number) {
//         const newVal = event.target.value;
//         if (this.state.recurringToSave) {
//             const recurring = this.state.recurringToSave;
//             recurring.categories![index].setValue(cleanNumberDataInput(newVal));
//             this.setState({ recurringToSave: recurring })
//         }
//     }


//     handleStartAgeUpdate(event: React.ChangeOneTime<HTMLInputElement | HTMLTextAreaElement>) {
//         const newVal = Number(event.target.value);

//         if (this.state.recurringToSave && newVal) {
//             const recurring = this.state.recurringToSave;
//             recurring.startAge = newVal;
//             this.setState({ recurringToSave: recurring })
//         }
//     }


//     handleEndAgeUpdate(event: React.ChangeOneTime<HTMLInputElement | HTMLTextAreaElement>) {
//         const newVal = Number(event.target.value);

//         if (this.state.recurringToSave && newVal) {
//             const recurring = this.state.recurringToSave;
//             recurring.endAge = newVal;
//             this.setState({ recurringToSave: recurring })
//         }
//     }

//     handleDeleteCategory(categoryToDelete: Category) {
//         if (this.state.recurringToSave.categories) {
//             let newCategories = this.state.recurringToSave.categories.filter((category: Category) => category.id !== categoryToDelete.id);
//             const recurring = this.state.recurringToSave;
//             recurring.categories = newCategories;
//             this.setState({ recurringToSave: recurring })
//         }
//     }

//     addCategory() {
//         if (this.state.recurringToSave.categories) {
//             let newCategories = [...this.state.recurringToSave.categories, new Category(new Date().getTime().toString(), '...', 0.0)]
//             const recurring = this.state.recurringToSave;
//             recurring.categories = newCategories;
//             this.setState({ recurringToSave: recurring })
//         }
//     }

//     async saveRecurring(event: React.MouseOneTime<HTMLButtonElement, MouseOneTime>, recurringToSave: Recurring) {
//         await RecurringDataAccess.updateRecurring(recurringToSave)
//         this.props.closeDialog();
//     }

//     render() {
//         const isMobile = window.innerWidth <= 390;
//         return (
//             <>
//                 <DialogTitle>Recurring {this.props.type === CategoryTypes.Expense ? "Withdrawal" : "Income"}</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                     </DialogContentText>

//                     <Stack direction='column' spacing={1}>
//                         <br />
//                         {this.state.recurringToSave && <TextField label={'name'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringNameChange(event)} value={this.state.recurringToSave.name} />}
//                         {this.state.recurringToSave.categories && this.state.recurringToSave.categories.map((category: Category, i: number) => {
//                             return (
//                                 <>
//                                     <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
//                                         <TextField sx={{ width: isMobile ? '100%' : '55%' }} label={'description'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleCategoryNameUpdate(event, i)} value={category.name} />
//                                         <TextField sx={{ width: isMobile ? '100%' : '40%' }} label={'amount'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleCateogryValueUpdate(event, i)} InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <AttachMoneyIcon />
//                                                 </InputAdornment>
//                                             ),
//                                             endAdornment: (
//                                                 <InputAdornment position="end">
//                                                     Monthly
//                                                 </InputAdornment>
//                                             ),
//                                         }} value={category.value}></TextField>
//                                         <Button onClick={(event) => this.handleDeleteCategory(category)} sx={{ width: isMobile ? '100%' : '5%' }} variant="outlined"><HighlightOffIcon /></Button>
//                                     </Stack>

//                                     <br />
//                                 </>
//                             )
//                         })}

//                         <Button sx={{ width: '100%' }} onClick={(event) => this.addCategory()} variant="outlined"><AddCircleIcon /></Button>

//                         <br />

//                         <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>


//                             <TextField
//                                 sx={{ width: isMobile ? '100%' : '40%' }}
//                                 label={'start age'}
//                                 id="outlined-basic"
//                                 variant="outlined"
//                                 onChange={(event) => this.handleStartAgeUpdate(event)}
//                                 value={this.state.recurringToSave.startAge}>
//                             </TextField>


//                             <TextField
//                                 sx={{ width: isMobile ? '100%' : '40%' }}
//                                 label={'end age'}
//                                 id="outlined-basic"
//                                 variant="outlined"
//                                 value={this.state.recurringToSave.endAge}
//                                 onChange={(event) => this.handleEndAgeUpdate(event)}>
//                             </TextField>
//                         </Stack>
//                     </Stack>
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={this.props.closeDialog}>Cancel</Button>
//                     <Button onClick={(e) => this.saveRecurring(e, this.state.recurringToSave)}>Save</Button>
//                 </DialogActions>
//             </>
//         )
//     }
// }

// export default RecurringDialogView;
import React from "react";

export class RecurringDialogView extends React.Component {
    render() {
        return (<></>)
    }
}