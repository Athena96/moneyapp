import * as React from 'react';
import '../App.css';
import { styled, Theme, CSSObject } from '@mui/material/styles';

import BudgetsView from '../views/BudgetsView';
import DataView from '../views/DataView';
import EventsView from '../views/EventsView';
import GraphView from '../views/GraphView';
import AssetsView from '../views/AssetsView';
import SimulationView from '../views/SimulationView';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify'
import awsExports from "../aws-exports";
import { Simulation } from '../model/Base/Simulation';
import { SimulationDataAccess } from '../utilities/SimulationDataAccess';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { moneyGreen } from '../utilities/constants';
import CssBaseline from '@mui/material/CssBaseline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const drawerWidth = 240;

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

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme, open }) => ({
//   transition: theme.transitions.create(['margin', 'width'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(['margin', 'width'], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%", }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, }}>
          {children}
        </Box>
      )}
    </div>
  );
}
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes.email;
    const userSim = await SimulationDataAccess.fetchSelectedSimulationForUser(this, email);

    this.setState({ user: email, simulation: userSim });
  }
  handleDrawerOpen() {
    console.log('handleDrawerOpen')
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
          <MuiDrawer
            anchor="left"
            open={this.state.open}
          >
            <DrawerHeader>
              <IconButton onClick={this.handleDrawerOpen}>
                <ChevronLeftIcon />
              </IconButton>
            </DrawerHeader>

            <Divider />
            <Tabs
              orientation="vertical"
              variant="scrollable"

              value={this.state.selectedTab}
              onChange={this.handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: `1px`, borderColor: 'divider', overflow: `visible`, }}
            >
              <Tab label="Graph" {...a11yProps(0)} />
              <Tab label="Budgets" {...a11yProps(1)} />
              <Tab label="Events" {...a11yProps(2)} />
              <Tab label="Assets" {...a11yProps(3)} />
              <Tab label="Data" {...a11yProps(4)} />
              <Tab label="Simulations" {...a11yProps(4)} />
            </Tabs>

          </MuiDrawer>

          <Container >
            <DrawerHeader />

            <TabPanel value={this.state.selectedTab} index={0} >
              <GraphView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
            </TabPanel>

            <TabPanel value={this.state.selectedTab} index={1}>
              <BudgetsView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
            </TabPanel>

            <TabPanel value={this.state.selectedTab} index={2}>
              <EventsView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
            </TabPanel>

            <TabPanel value={this.state.selectedTab} index={3}>
              <AssetsView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
            </TabPanel>

            <TabPanel value={this.state.selectedTab} index={4}>
              <DataView user={this.state.user} simulation={this.state.simulation} change={this.newTab} />
            </TabPanel>

            <TabPanel value={this.state.selectedTab} index={5}>
              <SimulationView user={this.state.user} simulation={this.state.simulation} />
            </TabPanel>
          </Container>

        </Box>
      );
    } else {
      return (<></>)
    }
  }
}

export default Home;
