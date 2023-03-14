// https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
// https://www.retirementsimulation.com/
// https://cfiresim.com/
import * as React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import TextBox from './components/TextBox';
import MoneyTextBox from './components/MoneyTextBox';
import InfoCard from './components/InfoCard';

// @ts-ignore
import { simulate } from "montecarlo-lib"
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { getGraphDataSettings, getPortfolioSurvivalDataSettings, graphSettings, portfolioSuccessPercentGraphSettings } from './utils/Settings';
import { gray } from './utils/Constants';
import { AiFillTrophy,AiOutlineDollar } from 'react-icons/ai';
// https://www.chartjs.org/docs/latest/axes/labelling.html
// https://towardsdev.com/chart-js-next-js-beautiful-data-driven-dashboards-how-to-create-them-fast-and-efficiently-a59e313a3153
ChartJS.register(CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler)

interface AppProps {
}

interface AppState {
  projectionLine: number[];
  successPercent: number;
  age: string;
  startingBalance: string;
  annualContribution: string;
  retireAge: string;
  annualExpenses: string;
  darkModeEnabled: boolean;
  successPercentByAge: number[];
  sevenFiveLine: number[];
  twoFiveLine: number[];
  nineFiveLine: number[];
  medianBalanceAtRetireAge: number;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      projectionLine: [],
      successPercent: 0.0,
      age: "30",
      startingBalance: "1,000,000",
      annualContribution: "30,000",
      retireAge: "40",
      annualExpenses: "100,000",
      darkModeEnabled: true,
      successPercentByAge: [],
      sevenFiveLine: [],
      twoFiveLine: [],
      nineFiveLine: [],
      medianBalanceAtRetireAge: 0
    }
    this.runSimulations = this.runSimulations.bind(this);
    this.updateDarkMode = this.updateDarkMode.bind(this);
  }

  componentDidMount() {
    this.runSimulations()
  }

  runSimulations = () => {
    const startingAge = Number(this.state.age)
    const period = 95 - startingAge
    const retireAge = Number(this.state.retireAge)
    const retireDateIdx = retireAge - startingAge
    const startingBalance = Number(this.state.startingBalance.replaceAll(',', ''))
    const annualContribution = Number(this.state.annualContribution.replaceAll(',', ''))
    const annualExpenses = Number(this.state.annualExpenses.replaceAll(',', ''))

    if (retireAge < startingAge) {
      alert('Retire age must be greater than or equal to starting age')
      return
    }
    
    const { medianLine, successPercentByAge, sevenFiveLine, nineFiveLine, twoFiveLine, medianBalanceAtRetireAge } = simulate(period, annualContribution, startingBalance, annualExpenses, retireDateIdx)

    this.setState({
      projectionLine: medianLine,
      successPercent: successPercentByAge[successPercentByAge.length - 1],
      sevenFiveLine,
      successPercentByAge,
      nineFiveLine,
      twoFiveLine,
      medianBalanceAtRetireAge
    })
  }

  updateDarkMode() {
    this.setState({ darkModeEnabled: !this.state.darkModeEnabled })
  }

  addCommas(num: string) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  removeNonNumeric(num: string) {
    return num.replace(/[^0-9]/g, "")
  }

  render() {
    const isMobile = window.innerWidth <= 390;
    const startingAge = Number(this.state.age)
    const retireAge = Number(this.state.retireAge)
    const data = getGraphDataSettings(this.state.projectionLine,
      this.state.sevenFiveLine,
      this.state.nineFiveLine,
      this.state.twoFiveLine,
      startingAge, retireAge)
    const portfolioSurvivalData = getPortfolioSurvivalDataSettings(this.state.successPercentByAge, startingAge, retireAge)
    return (
      <div style={{
        background: this.state.darkModeEnabled ? gray : 'white',
        minWidth: '100%',
        minHeight: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ paddingTop: '15px', paddingRight: '30px', textAlign: 'right' }}>
          <span style={{ color: this.state.darkModeEnabled ? 'white' : 'black' }}>Dark Mode 😎</span>{' '}
          <input type="checkbox" checked={this.state.darkModeEnabled} onChange={this.updateDarkMode} />
        </div>
        <Container >
          <Row>
            <Col style={{ marginBottom: '100px', width: isMobile ? '100%' : '10%', maxWidth: isMobile ? '100%' : '30%' }}>
              <TextBox
                darkMode={this.state.darkModeEnabled}
                title={"Age"}
                description={"How old are you right now?"}
                value={this.state.age}
                onChange={(event: any) => this.setState({ age: this.removeNonNumeric(event.target.value) })} />
              <TextBox
                darkMode={this.state.darkModeEnabled}
                title={"Retirement Age"}
                description={"What age do you want to retire at?"}
                value={this.state.retireAge}
                onChange={(event: any) => this.setState({ retireAge: this.removeNonNumeric(event.target.value) })} />
              <MoneyTextBox
                darkMode={this.state.darkModeEnabled}
                title={"Starting Balance"}
                description={"How much money do you currently have invested?"}
                value={this.state.startingBalance}
                onChange={(event: any) => this.setState({ startingBalance: this.addCommas(this.removeNonNumeric(event.target.value))})} />
              <MoneyTextBox
                darkMode={this.state.darkModeEnabled}
                title={"Annual Contribution"}
                description={"How much are you, annually, contributing to your investments?"}
                value={this.state.annualContribution}
                onChange={(event: any) => this.setState({annualContribution: this.addCommas(this.removeNonNumeric(event.target.value))})} />
              <MoneyTextBox
                darkMode={this.state.darkModeEnabled}
                title={"Annual Retirement Expenses"}
                description={"How much do you plan to spend annually in retirement?"}
                value={this.state.annualExpenses}
                onChange={(event: any) => this.setState({annualExpenses: this.addCommas(this.removeNonNumeric(event.target.value))})}/>
              <br />
              <Button style={{ fontWeight: '700', width: '100%', backgroundColor: "rgba(90, 209, 171, 1)", borderColor: "rgba(90, 209, 171, 1)" }} onClick={this.runSimulations}>Run Simulations</Button>
            </Col>
            <Col style={{ marginBottom: '100px', width: isMobile ? '100%' : '70%' }}>
              <Row>
                <InfoCard
                  icon={<AiFillTrophy />}
                  iconDarkMode={<AiFillTrophy />}
                  darkMode={this.state.darkModeEnabled}
                  title={'Chance of Success'}
                  description={'The probability that you will not run out of money in retirement.'}
                  value={`${this.state.successPercent.toFixed(2)}%`} />
                <InfoCard
                  icon={< AiOutlineDollar/>}
                  iconDarkMode={<AiOutlineDollar />}
                  darkMode={this.state.darkModeEnabled}
                  title={'Balance at Retirement'}
                  description={'How much you will have when you start retirement.'}
                  value={`$${Number(this.state.medianBalanceAtRetireAge.toFixed(2)).toLocaleString()}`} />
              </Row>

              <h1 style={{ color: this.state.darkModeEnabled ? 'white' : 'black' }}>Median Portfolio Balance</h1>
              <Line style={{ marginBottom: '50px' }} data={data} options={graphSettings} />

              <h1 style={{ color: this.state.darkModeEnabled ? 'white' : 'black' }}>Portfolio Survival</h1>
              <Line style={{ marginBottom: '50px' }} data={portfolioSurvivalData} options={portfolioSuccessPercentGraphSettings} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  };
}

export default App;