import * as React from 'react';

import { API, graphqlOperation } from 'aws-amplify'
import { updateBudget } from '../graphql/mutations'
import { CategoryTypes } from '../API';

import { Simulation } from "../model/Base/Simulation";
import { Budget } from "../model/Base/Budget";
import { Category } from '../model/Base/Category';

import { cleanNumberDataInput } from '../utilities/helpers';
import { BudgetDataAccess } from '../utilities/BudgetDataAccess';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Paper from '@mui/material/Paper';

interface BudgetDialogViewProps {
    user: string;
    simulation: Simulation;
    budget: Budget;
    type: CategoryTypes;
    closeDialog: () => void;

}

interface BudgetDialogViewState {
    budgetToSave: Budget
}


class BudgetDialogView extends React.Component<BudgetDialogViewProps, BudgetDialogViewState> {
    constructor(props: BudgetDialogViewProps) {
        super(props)

        this.state = {
            budgetToSave: this.props.budget
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    }

    componentDidMount() {

    }

    handleRecurringNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newName = event.target.value;
        if (this.state.budgetToSave) {
            const budget = this.state.budgetToSave;
            budget.name = newName;
            this.setState({ budgetToSave: budget })
        }
    }

    handleCategoryNameUpdate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) {
        const newVal = event.target.value;
        if (this.state.budgetToSave) {
            const budget = this.state.budgetToSave;
            budget.categories![index].name = newVal;
            this.setState({ budgetToSave: budget })
        }
    }

    handleCateogryValueUpdate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) {
        const newVal = event.target.value;
        if (this.state.budgetToSave) {
            const budget = this.state.budgetToSave;
            budget.categories![index].setValue(cleanNumberDataInput(newVal));
            this.setState({ budgetToSave: budget })
        }
    }


    handleRecurringStartDateChange(newDate: Date | null) {
        if (this.state.budgetToSave && newDate) {
            const budget = this.state.budgetToSave;
            budget.startDate = newDate;
            this.setState({ budgetToSave: budget })
        }
    }


    handleRecurringEndDateChange(newDate: Date | null) {
        if (this.state.budgetToSave && newDate) {
            const budget = this.state.budgetToSave;
            budget.endDate = newDate;
            this.setState({ budgetToSave: budget })
        }
    }

    handleDeleteCategory(categoryToDelete: Category) {
        if (this.state.budgetToSave.categories) {
            let newCategories = this.state.budgetToSave.categories.filter((category: Category) => category.id !== categoryToDelete.id);
            const budget = this.state.budgetToSave;
            budget.categories = newCategories;
            this.setState({ budgetToSave: budget })
        }
    }

    addCategory() {
        if (this.state.budgetToSave.categories) {
            let newCategories = [...this.state.budgetToSave.categories, new Category(new Date().getTime().toString(), '...', 0.0)]
            const budget = this.state.budgetToSave;
            budget.categories = newCategories;
            this.setState({ budgetToSave: budget })
        }
    }

    async saveBudget(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, budgetToSave: Budget) {
        try {
            await API.graphql(graphqlOperation(updateBudget, { input: BudgetDataAccess.convertToDDBObject(budgetToSave, this.props.simulation!.id) }))
        } catch (err) {
            console.log('error creating todo:', err)
        }
        this.props.closeDialog();
    }

    render() {
        const isMobile = window.innerWidth <= 390;
        return (
            <>
                <DialogTitle>Recurring {this.props.type === CategoryTypes.Expense ? "Expense" : "Income"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>

                    <Stack direction='column' spacing={1}>
                        <br />
                        {this.state.budgetToSave && <TextField label={'label'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringNameChange(event)} value={this.state.budgetToSave.name} />}


                        {this.state.budgetToSave.categories && this.state.budgetToSave.categories.map((category: Category, i: number) => {
                            return (
                                <>
                                    <Stack direction={isMobile ? 'column' : 'row'}  spacing={1}>
                                        <TextField sx={{ width: isMobile ? '100%' : '55%' }} label={'description'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleCategoryNameUpdate(event, i)} value={category.name} />
                                        <TextField sx={{ width: isMobile ? '100%' : '40%' }} label={'amount'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleCateogryValueUpdate(event, i)} InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoneyIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    Monthly
                                                </InputAdornment>
                                            ),
                                        }} value={category.strValue}></TextField>
                                        <Button onClick={(event) => this.handleDeleteCategory(category)} sx={{ width: isMobile ? '100%' : '5%' }} variant="outlined"><HighlightOffIcon /></Button>
                                    </Stack>

                                    <br />
                                </>
                            )
                        })}



                        <Button sx={{ width: '100%' }} onClick={(event) => this.addCategory()} variant="outlined"><AddCircleIcon /></Button>

                        <br />

                        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>

                            {this.state.budgetToSave && <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="start date"
                                    value={this.state.budgetToSave.startDate}
                                    onChange={(newDate) => this.handleRecurringStartDateChange(newDate)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>}


                            {this.state.budgetToSave && <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker

                                    label="end date"
                                    value={this.state.budgetToSave.endDate}
                                    onChange={(newDate) => this.handleRecurringEndDateChange(newDate)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>}

                        </Stack>

                    </Stack>



                </DialogContent>

                <DialogActions>
                    <Button onClick={this.props.closeDialog}>Cancel</Button>
                    <Button onClick={(e) => this.saveBudget(e, this.state.budgetToSave)}>Save</Button>
                </DialogActions>

            </>
        )
    }


}

export default BudgetDialogView;
