import React from 'react';
import { checkStatus, json } from './utils';
import './currencyConverter.css';
import RateChart from './RateChart';

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
                    this.setState({ fromCurrency: Object.keys(data)[0], toCurrency: Object.keys(data)[0] });
                    this.getRates(this.state.fromCurrency);
                }
            })
            .catch(error => {
                this.setState({ error: error.message });
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
        this.setState({ [name]: value })
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
                <RateChart currency={fromCurrency} rates={rates} />
            </div>
        )
    }
}


export default CurrencyConverter;