import React, { useState, useEffect } from 'react';
import { Recurring } from '../../model/Base/Recurring';
import { RecurringService } from '../../services/recurring_service';
import { Button, CircularProgress } from '@mui/material';
import { RecurringsOneTimesView } from '../SharedViews/RecurringsOneTimesView';
import { ChargeType } from '../../model/Base/ChargeType';
import WithdrawalFormDialog from './WithdrawalFormDialog';

interface WithdrawalsViewProps {
    user: string;
    scenarioId: string;
}

interface WithdrawalsViewState {
    data: Recurring[] | undefined;
    isDialogOpen: boolean;
    slectedRecurring: Recurring | null;
}

class WithdrawalsView extends React.Component<WithdrawalsViewProps, WithdrawalsViewState> {

    constructor(props: WithdrawalsViewProps) {
        super(props);
        this.state = {
            data: undefined,
            isDialogOpen: false,
            slectedRecurring: null
        }
    }

    async componentDidMount() {
        const data: Recurring[] = [];
        const recurrings = await RecurringService.listRecurring(this.props.scenarioId);
        data.push(...recurrings);
        const filteredData = data.filter((d: Recurring) => d.chargeType === ChargeType.EXPENSE);
        this.setState({ data: filteredData });
    }

    handleDelete = async (recurring: Recurring) => {
        if (this.state.data) {
            await RecurringService.deleteRecurring(recurring);
            const newRecurrings = this.state.data.filter((a: Recurring) => a.id !== recurring.id);
            this.setState({ data: newRecurrings });
        }
    }

    handleEdit = (recurring: Recurring) => {
        this.setState({
            slectedRecurring: recurring,
            isDialogOpen: true
        })
    }

    handleAdd = () => {
        this.setState({
            slectedRecurring: null,
            isDialogOpen: true
        })
    }

    closeDialog = () => {
        this.setState({
            isDialogOpen: false
        })
    }

    saveRecurring = async (recurring: Recurring) => {
        if (this.state.slectedRecurring) {
            await RecurringService.updateRecurring(recurring, ChargeType.EXPENSE);
            this.setState({ data: this.state.data?.map(r => (r.id === recurring.id ? recurring : r)) })
        } else {
            await RecurringService.addRecurring(recurring, ChargeType.EXPENSE);
            this.setState({ data: [...this.state.data || [], recurring] })
        }
    }

    render() {
        if (this.state.data === undefined) {
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <div style={{ textAlign: "center" }}>
                        <CircularProgress />
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <Button variant="outlined" style={{ width: '100%', marginBottom: '20px' }} disabled={this.state.data === undefined} onClick={this.handleAdd}>Add Withdrawal</Button>
                    <RecurringsOneTimesView user={this.props.user} scenarioId={this.props.scenarioId} data={this.state.data} onEdit={this.handleEdit} onDelete={this.handleDelete} />
                    <WithdrawalFormDialog
                        user={this.props.user}
                        scenarioId={this.props.scenarioId}
                        isOpen={this.state.isDialogOpen}
                        onClose={this.closeDialog}
                        onSave={this.saveRecurring}
                        inititalRecurring={this.state.slectedRecurring || undefined} />
                </div>
            )
        }
    }
}

export default WithdrawalsView;