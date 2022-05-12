import * as React from 'react';
import '../App.css';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify'
import { API, graphqlOperation } from 'aws-amplify'

import awsExports from "../aws-exports";
import { Simulation } from '../model/Base/Simulation';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import MuiDrawer from '@mui/material/Drawer';
import TableChartIcon from '@mui/icons-material/TableChart';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { moneyGreen } from '../utilities/constants';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Main from './Main';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import SignpostIcon from '@mui/icons-material/Signpost';
import PaidIcon from '@mui/icons-material/Paid';
import { createSimulation } from '../graphql/mutations';
const drawerWidth = 175;

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
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
}

interface IState {
  selectedTab: number;
  user: string | undefined;
  simulation: Simulation | undefined;
  open: boolean;
}

class Home extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: 0,
      user: undefined,
      simulation: undefined,
      open: false

    }

    this.render = this.render.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.newTab = this.newTab.bind(this);
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  async componentDidMount() {
    let simulation = undefined;
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes.email;
    simulation = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);
    if (!simulation) {
      console.log('creating new sim, user did not have one')
      simulation = new Simulation(new Date().getTime().toString(), 'Default Scenario', 1, '[]', "", new Date(), email);
      await API.graphql(graphqlOperation(createSimulation, { input: simulation }));
    }
    this.setState({ user: email, simulation: simulation });
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

  async handleSignOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  render() {
    const isMobile = window.innerWidth <= 390;
    if (this.state.user) {
      return (

        <Box sx={{ display: 'flex' }}>
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
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link style={{ color: 'white', textDecoration: 'none' }} to="/">Money Tomorrow {<small>{this.state.user}</small>}</Link>
              </Typography>

              <Button variant="outlined" style={{ color: 'white' }} onClick={this.handleSignOut}>
                Sign Out
              </Button>

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

              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/budgets`}>
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
                    <ViewListIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Budgets'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>


              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/events`}>
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
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Events'} sx={{ opacity: this.state.open ? 1 : 0 }} />
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
                    <PaidIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Assets'} sx={{ opacity: this.state.open ? 1 : 0 }} />
                </ListItemButton>
              </Link>


              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/scenarios`}>
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
              </Link>


              <Link style={{ color: 'black', textDecoration: 'none' }} to={`/data`}>
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
              </Link>


            </List>

          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Main user={this.state.user} simulation={this.state.simulation} />
          </Box>

        </Box>
      );
    } else {
      return (<></>)
    }
  }
}

export default Home;
