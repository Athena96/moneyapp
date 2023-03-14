const ONE_MILLION = 1_000_000
export const STOCK_P: number = 1.0
export const BOND_P: number = 1.0 - STOCK_P

export const SIMS: number = 10_000

export const VTI_VARIANCE: number = 248.6929 // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
export const VTI_MEAN: number = 11.77 // https://www.portfoliovisualizer.com/monte-carlo-simulation#analysisResults
export const BND_VARIANCE: number = 16.0801
export const BND_MEAN: number = 4.45
export const INFLATION: number = 3.96 / 100.0
export const FEES: number = 0.04 / 100.0

export const getLineGraphSettings = (dataLine: number[]) => {

    return {
        labels: Array.from({ length: dataLine.length }, (_, index) => `${index}`),
        datasets: [
            {
                label: 'portfolio balance',
                data: dataLine,
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(90, 209, 171, 1)',
                backgroundColor: 'rgba(90, 209, 171, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            }
        ]
    }
}
export const getGraphDataSettings = (dataLine: number[], sevenFiveLine: number[], nineFiveLine: number[], twoFiveLine: number[], startingAge: number, retireAge: number) => {
    return {
        labels: Array.from({ length: dataLine.length }, (_, index) => {
            const age = index + startingAge
            const label = age === retireAge ? `(Retire Age) ${age}y` : ` ${age}y`
            return label
        }),
        datasets: [
            {
                label: '25th Percentile',
                data: twoFiveLine,
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(250,128,114, 1)',
                backgroundColor: 'rgba(250,128,114, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            },
            {
                label: 'Median',
                data: dataLine,
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(90, 209, 171, 1)',
                backgroundColor: 'rgba(90, 209, 171, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            },
            {
                label: '75th Percentile',
                data: sevenFiveLine,
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(255,165,0, 1)',
                backgroundColor: 'rgba(255,165,0, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            }
        ]
    }
}

export const getPortfolioSurvivalDataSettings = (dataLine: number[], startingAge: number, retireAge: number) => {
    return {
        labels: Array.from({ length: dataLine.length }, (_, index) => {
            const age = index + startingAge
            const label = age === retireAge ? `(Retire Age) ${age}y` : ` ${age}y`
            return label
        }),
        datasets: [
            {
                label: 'Success Percent',
                data: dataLine,
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(90, 209, 171, 1)',
                backgroundColor: 'rgba(90, 209, 171, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            },


        ]
    }
}


export const getBarChartData = (sortedLineData: number[]) => {
    let aboveZero = 0
    let lessZero = 0
    for (const data of sortedLineData) {
        if (data > 0) {
            aboveZero++
        } else {
            lessZero++
        }
    }
    return {
        labels: ['Less than $0', 'More than $0'],
        datasets: [
            {
                label: 'ending balances',
                data: [lessZero, null],
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(250,128,114, 1)',
                backgroundColor: 'rgba(250,128,114, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            },
            {
                label: 'ending balances',
                data: [null, aboveZero],
                barThickness: 10,
                pointRadius: 0,
                borderColor: 'rgba(90, 209, 171, 1)',
                backgroundColor: 'rgba(90, 209, 171, 1)',
                pointStyle: 'circle',
                pointHoverRadius: 2
            }
        ]
    }
}

export const barchartSettings: any = {
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            ticks: {
                beginAtZero: true,
            }
        }
    }
};
export const graphSettings: any = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        legend: {
            display: true,
        },
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {

            min: 0,
            ticks: {
                beginAtZero: true,
                callback: (value: number) => {
                    if (value >= ONE_MILLION) {
                        const adjVal = value / ONE_MILLION
                        return `$${Number(adjVal.toFixed(0)).toLocaleString("en-US")}M`
                    } else {
                        return `$${Number(value.toFixed(2)).toLocaleString("en-US")}`
                    }
                }
            }
        }
    }
};

export const portfolioSuccessPercentGraphSettings: any = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        legend: {
            display: true,
        },
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {

            min: 0,
            ticks: {
                beginAtZero: true,
                callback: (value: number) => `${value}%`
            }
        }
    }
};