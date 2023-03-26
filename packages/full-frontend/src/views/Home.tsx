import * as React from 'react';

import { Simulation } from '../model/Base/Simulation';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';

import '../App.css';
import Main from './Main';
import { moneyGreen } from '../utilities/constants';

import Amplify, { Auth, API } from 'aws-amplify';
import awsExports from "../aws-exports";
import { Link } from "react-router-dom";

import SimulationView from './SimulationView';
import { SimulationStatus } from '../API';
import { Input } from '../model/Base/Input';
import { AssetAllocation } from '../model/Base/AssetAllocation';
import { Allocations } from '../model/Base/Allocations';

import { styled, Theme, CSSObject } from '@mui/material/styles';

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import {
  FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Menu, Dialog, ListItemText, ListItemIcon,
  ListItemButton, List, Divider, Button, Typography, IconButton, Toolbar, Box
} from '@mui/material';

import BarChartIcon from '@mui/icons-material/BarChart';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { InputDataAccess } from '../utilities/InputDataAccess';


const drawerWidth = 175;
const isMobile = window.innerWidth <= 390;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(isMobile ? 0 : 7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(isMobile ? 0 : 8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

Amplify.configure(awsExports);

interface IProps {
  hideSignIn: () => void;
  hideShowSignIn: () => void;
  signedIn: boolean;
}

interface IState {
  selectedTab: number;
  user: string | undefined;
  simulation: Simulation | undefined;
  simulations: Simulation[];
  open: boolean;
  showScenario: boolean;
  profileOpen: boolean;
  input: Input | undefined;
}

class Home extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: 0,
      user: undefined,
      simulation: undefined,
      open: false,
      showScenario: false,
      simulations: [],
      profileOpen: false,
      input: undefined
    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.newTab = this.newTab.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.scenarioSwitch = this.scenarioSwitch.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleSimulationChange = this.handleSimulationChange.bind(this);
    this.handleProfileOpen = this.handleProfileOpen.bind(this);
    this.profileClose = this.profileClose.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
  }

  async componentDidMount() {
    this.props.hideSignIn();

    if (!this.props.signedIn) {
      return;
    }

    let simulation = undefined;
    let inputSettings = undefined;
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes.email;
    const simid = new Date().getTime().toString();
    const inputId = (new Date().getTime() + 1).toString();

    simulation = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);
    if (!simulation) {
      simulation = new Simulation(simid, 'Default Scenario', 1, '[]', "", new Date(), email, SimulationStatus.Done);
      await SimulationDataAccess.createSimulation(simulation);
      const assetAllocation: AssetAllocation = new AssetAllocation(
        new Allocations(
          '80.0',
          '16.0',
          '4.0'
        ),
        undefined,
        undefined)

      inputSettings = new Input(inputId, 0, true, assetAllocation, simid);
      await InputDataAccess.createInput(inputSettings)
    }

    this.setState({ user: email, simulation: simulation, simulations: [simulation], input: inputSettings });
    await SimulationDataAccess.fetchSimulationsForUser(this, this.state.user!);

  }

  handleDrawerOpen() {
    const currVal = this.state.open;
    this.setState({ open: !currVal });
  }

  handleChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ selectedTab: newValue });
  }
  newTab(newValue: number) {
    this.setState({ selectedTab: newValue });
  }

  scenarioSwitch() {
    this.setState({ showScenario: true });
  }

  closeDialog() {
    this.setState({ showScenario: false });
  }

  async handleSimulationChange(event: SelectChangeEvent) {
    const selectedSimulationName = event.target.value as string;
    if (selectedSimulationName !== '#add-new-simulation#') {
      let sims = this.state.simulations;

      for (const simulation of sims) {
        if (simulation.name === selectedSimulationName) {
          simulation.selected = 1
          this.setState({ simulation: simulation });
        } else {
          simulation.selected = 0;
        }
        await SimulationDataAccess.updateSimulation(simulation)
      }

      this.setState({ simulations: sims });
      window.location.reload();

    }

  }

  async handleSignOut() {
    try {
      this.props.hideShowSignIn();
      await Auth.signOut();
    } catch (error) {
      console.error('error signing out: ', error);
    }
  }

  async handleDeleteAccount() {
    if (window.confirm('Are you sure you want to Delete your account? This will delete all of your data and cannot be undone. You can still return at any time and create a new account in the future.')) {
      try {
        const email = this.state.user;
        API.del('apiCall', '/router', {
          queryStringParameters: {
            email,
            command: "DeleteAccount"
          },
        });
        await Auth.signOut();
      } catch (error) {
        console.error('error signing out: ', error);
      }
    }

  }

  handleProfileOpen() {
    const curr = this.state.profileOpen;
    this.setState({ profileOpen: !curr });
  }

  profileClose() {
    this.setState({ profileOpen: false });
  }

  render() {
    if (this.state.user && this.state.simulations) {
      return (

        <Box sx={{ display: 'flex' }}>

          <Dialog open={this.state.showScenario} onClose={this.closeDialog}>
            {this.state.simulation && <SimulationView user={this.state.user} simulation={this.state.simulation} />}
          </Dialog>

          <AppBar position="fixed" sx={{ bgcolor: moneyGreen }} >

            <Toolbar>

              <IconButton
                edge="start"
                color="default"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={this.handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
              {!isMobile && <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link style={{ color: 'white', textDecoration: 'none' }} to="/">Money Tomorrow</Link>
              </Typography>}

              {/* <Button variant="outlined" style={{ color: 'white' }} onClick={this.scenarioSwitch}>
                <><small>Scenario</small>:{' '}<u>{this.state.simulation?.name}</u></>
              </Button> */}

              <FormControl style={{ maxWidth: isMobile ? '200px' : '400px', position: 'absolute', right: '50px', color: 'white', }} size="small">
                <InputLabel id="demo-select-small">scenario</InputLabel>
                <Select
                  style={{ color: 'white' }}
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={this.state.simulation!.name}
                  label="simulation"
                  onChange={this.handleSimulationChange}
                >
                  {this.state.simulations && this.state.simulations.map((sim: Simulation, z: number) => {
                    return (
                      <MenuItem key={z} value={`${sim.name}`}>{sim.name}</MenuItem>
                    )
                  })}
                  <MenuItem key={'#add-new-simulation#`'} value={`#add-new-simulation#`}><Button variant='outlined' onClick={this.scenarioSwitch}>Create/Edit/Delete Scenarios<AddCircleIcon /></Button></MenuItem>
                </Select>
              </FormControl>




              {/* <Button variant="outlined" style={{ color: 'white' }} onClick={this.handleSignOut}>
                Sign Out
              </Button> */}

              <IconButton
                edge="start"
                color="default"
                aria-label="open drawer"
                style={{ color: 'white', position: 'absolute', right: '10px' }}
                onClick={this.handleProfileOpen}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={this.state.profileOpen}
                onClose={this.profileClose}
              >
                <MenuItem>{this.state.user}</MenuItem>
                <MenuItem sx={{ color: 'red' }} onClick={this.handleDeleteAccount}>Delete Account</MenuItem>
                <MenuItem><Link style={{ color: 'black', textDecoration: 'none' }} to={`/about`}>
                  Learn More</Link></MenuItem>

                <MenuItem onClick={this.handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </Toolbar>

          </AppBar>
          <Drawer
            variant={'permanent'}
            open={this.state.open}
          >
            <DrawerHeader>
              <IconButton onClick={this.handleDrawerOpen}>
                <ChevronLeftIcon />
              </IconButton>
            </DrawerHeader>

            <Divider />
            <List>
              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Dashboard'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>

              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/withdrawals`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Withdrawals'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>


              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/contributions`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >

                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Contributions'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>

              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/assets`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalAtmIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Assets'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>



              {/* <Link style={{ color: 'black', textDecoration: 'none' }} to={`/scenarios`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <SignpostIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Scenarios'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link> */}


              {/* <Link style={{ color: 'black', textDecoration: 'none' }} to={`/data`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <TableChartIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Data'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link> */}


              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/settings`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: this.state.open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: this.state.open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Settings'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>


            </List>

          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Main user={this.state.user} simulation={this.state.simulation} input={this.state.input!} />
          </Box>

        </Box>
      );
    } else {
      return (<></>)
    }
  }
}

export default Home;