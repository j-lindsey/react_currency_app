import React from 'react';
import { checkStatus, json } from './utils';
import './currencyConverter.css';

class CurrencyConverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: {},
            error: '',
            amount: 0,
            fromCurrency: '',
            toCurrency: ''
        };
        this.handleChange = this.handleChange.bind(this);
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
                }
            })
            .catch(error => {
                this.setState({ error: error.message });
            })
    }

    handleChange(event) {
        const { name } = event.target;
        let value;
        if(name === "amount"){
            value = parseFloat(event.target.value);
        }else{
            value = event.target.value;
        }
        this.setState({ [name]: value })
        console.log(this.state);
    }

    render() {
        if (!this.state.currencies) {
            return null;
        }
        const { currencies, fromCurrency, toCurrency, amount } = this.state;

        return (
            <div className="currency-main">
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
                <button className="convert">Convert</button>
            </div>
        )
    }
}


export default CurrencyConverter;