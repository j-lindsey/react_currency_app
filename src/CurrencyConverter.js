import React from 'react';
import { checkStatus, json } from './utils';
import './currencyConverter.css';
import RateChart from './RateChart';
import Chart from 'chart.js/auto';


class CurrencyConverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: {},
            error: '',
            amount: 0,
            fromCurrency: '',
            toCurrency: '',
            rates: {},
            convert: false,
            exchangedRate: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.getRates = this.getRates.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getHistoricalRate = this.getHistoricalRate.bind(this);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        fetch('https://altexchangerateapi.herokuapp.com/currencies')
            .then(checkStatus)
            .then(json)
            .then(data => {
                if (!data) {
                    throw new Error()
                }
                else {
                    console.log(data);
                    this.setState({ currencies: data, error: '' });
                    this.setState({ fromCurrency: Object.keys(data)[0], toCurrency: Object.keys(data)[1] });
                    this.getRates(this.state.fromCurrency);
                    this.getHistoricalRate(this.state.fromCurrency, this.state.toCurrency)
                }
            })
            .catch(error => {
                this.setState({ error: error.message });
            })
    }

    getHistoricalRate = (base, quote) => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

        fetch(`https://altexchangerateapi.herokuapp.com/${startDate}..${endDate}?from=${base}&to=${quote}`)
            .then(checkStatus)
            .then(json)
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                console.log(data);
                const chartLabels = Object.keys(data.rates);
                const chartData = Object.values(data.rates).map(rate => rate[quote]);
                const chartLabel = `${base}/${quote}`;
                this.buildChart(chartLabels, chartData, chartLabel);
            })
            .catch(error => {
                console.error(error.message)
            })
    }

    buildChart = (labels, data, label) => {
        const chartRef = this.chartRef.current.getContext("2d");

        if (typeof this.chart !== "undefined") {
            this.chart.destroy();
        }

        this.chart = new Chart(this.chartRef.current.getContext("2d"), {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: label,
                        data,
                        fill: false,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
            }
        })
    }

    getRates(currency) {
        fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${currency}`)
            .then(checkStatus)
            .then(json)
            .then(data => {
                if (!data) {
                    throw new Error()
                }
                else {
                    console.log(data);
                    this.setState({ rates: data.rates })
                }
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    }

    handleChange(event) {
        const { name } = event.target;
        let value;
        if (name === "amount") {
            this.setState({ convert: false });
            value = parseFloat(event.target.value);

        } else {
            value = event.target.value;
        }
        this.setState({ [name]: value }, () => {
            if(this.state.convert === true){
                let {rates, toCurrency, amount} = this.state;
                let value = rates[toCurrency] * amount;
                this.setState({ exchangedRate: value.toFixed(4) })
            }
            this.getHistoricalRate(this.state.fromCurrency, this.state.toCurrency)
        })
        if (name === "fromCurrency") {
            this.getRates(value);
        }
    }

    handleClick() {
        let { toCurrency, rates, amount } = this.state;
        let rate = rates[toCurrency];
        this.setState({ convert: true });
        let value = rate * amount;
        this.setState({ exchangedRate: value.toFixed(4) })
    }

    render() {
        if (!this.state.currencies) {
            return null;
        }
        const { currencies, fromCurrency, toCurrency, amount, rates, convert, exchangedRate } = this.state;

        return (
            <div className="currency-main">
                <div className="currency-convert">
                    <div className="currency-input">
                        <div className="select">
                            <label>Amount</label>
                            <input type="number" placeholder="Amount" value={amount} name="amount" onChange={this.handleChange} />
                        </div>
                        <div className="select">
                            <label>From</label>
                            <select name="fromCurrency" value={fromCurrency} onChange={this.handleChange}>
                                {Object.keys(currencies).map(key =>
                                    <option key={key} value={key}>{key} - {currencies[key]}</option>
                                )}
                            </select>
                        </div>
                        <div className="select">
                            <label>To</label>
                            <select name="toCurrency" value={toCurrency} onChange={this.handleChange}>
                                {Object.keys(currencies).map(key =>
                                    <option key={key} value={key}>{key} - {currencies[key]}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <button className="convert" onClick={this.handleClick}>Convert</button>
                </div>
                <div>
                    {convert ? (
                        <div className="rate-exchange">
                            <h1 className="base-rate">{amount} {fromCurrency} = </h1>
                            <h1 className="exchanged-rate">{exchangedRate} {toCurrency}</h1>
                        </div>
                    ) :
                        (<div></div>
                        )}
                </div>
                <div className="historical-chart">
                    <canvas ref={this.chartRef} />
                </div>
                <RateChart currency={fromCurrency} rates={rates} />
            </div>
        )
    }
}


export default CurrencyConverter;