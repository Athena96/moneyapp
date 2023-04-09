import * as React from "react";
import { CategoryTypes } from "../../API";

import { Simulation } from "../../model/Base/Simulation";
import { Event } from "../../model/Base/Event";

import { cleanNumberDataInput } from "../../utilities/helpers";
import { EventDataAccess } from "../../utilities/EventDataAccess";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

interface EventDialogViewProps {
  user: string;
  simulation: Simulation;
  event: Event;
  type: CategoryTypes;
  closeDialog?: () => void;
}

interface EventDialogViewState {
  eventToSave: Event;
}

class EventDialogView extends React.Component<EventDialogViewProps, EventDialogViewState> {
  constructor(props: EventDialogViewProps) {
    super(props);

    this.state = {
      eventToSave: this.props.event,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {}

  handleOneTimeValueChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newVal = event.target.value;

    if (this.state.eventToSave) {
      const event = this.state.eventToSave;
      event.category!.setValue(cleanNumberDataInput(newVal));
      this.setState({ eventToSave: event });
    }
  }

  handleOneTimeNameChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newName = event.target.value;
    if (this.state.eventToSave) {
      const event = this.state.eventToSave;
      event.name = newName;
      this.setState({ eventToSave: event });
    }
  }

  handleOneTimeDateChange(newAge: number | null) {
    if (this.state.eventToSave && newAge) {
      const event = this.state.eventToSave;
      event.age = newAge;
      this.setState({ eventToSave: event });
    }
  }

  async saveEvent(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventToSave: Event) {
    await EventDataAccess.updateEvent(eventToSave);
    if (this.props.closeDialog) {
      this.props.closeDialog();
    }
  }

  render() {
    return (
      <>
        <DialogTitle>One-time {this.props.type === CategoryTypes.Expense ? "Withdrawal" : "Income"}</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack direction="column" spacing={0}>
            <br />
            {this.props.event && (
              <TextField
                label={"name"}
                id="outlined-basic"
                variant="outlined"
                onChange={(event) => this.handleOneTimeNameChange(event)}
                value={this.props.event.name}
              />
            )}
            <br />
            <br />

            {this.props.event && (
              <TextField
                label={"amount"}
                id="outlined-basic"
                variant="outlined"
                onChange={(event) => this.handleOneTimeValueChange(event)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
                value={this.props.event.category!.value}
              ></TextField>
            )}

            <br />
            <Stack direction="row" spacing={2}>
              {this.props.event && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TextField
                    label={"age"}
                    id="outlined-basic"
                    variant="outlined"
                    onChange={(e) => this.handleOneTimeDateChange(Number(e.target.value))}
                    value={this.state.eventToSave.age}
                  ></TextField>
                </LocalizationProvider>
              )}
            </Stack>
          </Stack>

          <DialogActions>
            {this.props.closeDialog && <Button onClick={this.props.closeDialog}>Cancel</Button>}
            <Button onClick={(e) => this.saveEvent(e, this.state.eventToSave)}>Save</Button>
          </DialogActions>
        </DialogContent>
      </>
    );
  }
}

export default EventDialogView;
