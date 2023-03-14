import * as React from 'react';
import { CategoryTypes } from '../../API';

import { Simulation } from "../../model/Base/Simulation";
import { Budget } from "../../model/Base/Budget";
import { Category } from '../../model/Base/Category';

import { cleanNumberDataInput } from '../../utilities/helpers';
import { BudgetDataAccess } from '../../utilities/BudgetDataAccess';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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


    handleStartAgeUpdate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newVal = Number(event.target.value);

        if (this.state.budgetToSave && newVal) {
            const budget = this.state.budgetToSave;
            budget.startAge = newVal;
            this.setState({ budgetToSave: budget })
        }
    }


    handleEndAgeUpdate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newVal = Number(event.target.value);

        if (this.state.budgetToSave && newVal) {
            const budget = this.state.budgetToSave;
            budget.endAge = newVal;
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
        await BudgetDataAccess.updateBudget(budgetToSave)
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
                        {this.state.budgetToSave && <TextField label={'name'} id="outlined-basic" variant="outlined" onChange={(event) => this.handleRecurringNameChange(event)} value={this.state.budgetToSave.name} />}
                        {this.state.budgetToSave.categories && this.state.budgetToSave.categories.map((category: Category, i: number) => {
                            return (
                                <>
                                    <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
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
                                        }} value={category.value}></TextField>
                                        <Button onClick={(event) => this.handleDeleteCategory(category)} sx={{ width: isMobile ? '100%' : '5%' }} variant="outlined"><HighlightOffIcon /></Button>
                                    </Stack>

                                    <br />
                                </>
                            )
                        })}

                        <Button sx={{ width: '100%' }} onClick={(event) => this.addCategory()} variant="outlined"><AddCircleIcon /></Button>

                        <br />

                        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>


                            <TextField
                                sx={{ width: isMobile ? '100%' : '40%' }}
                                label={'start age'}
                                id="outlined-basic"
                                variant="outlined"
                                onChange={(event) => this.handleStartAgeUpdate(event)}
                                value={this.state.budgetToSave.startAge}>
                            </TextField>


                            <TextField
                                sx={{ width: isMobile ? '100%' : '40%' }}
                                label={'end age'}
                                id="outlined-basic"
                                variant="outlined"
                                value={this.state.budgetToSave.endAge}
                                onChange={(event) => this.handleEndAgeUpdate(event)}>
                            </TextField>
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
