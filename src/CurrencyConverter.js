import React from 'react';
import { checkStatus, json } from './utils';
import './currencyConverter.css';

class CurrencyConverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: {},
            error: ''
        };
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
                }
            })
            .catch(error => {
                this.setState({ error: error.message });
            })
    }

    render() {
        if (!this.state.currencies) {
            return null;
        }
        const { currencies } = this.state;
        return (
            <div className="currency-main">
                <div className="currency-input">
                    <input type="number" placeholder="Amount" />
                    <div className="select">
                        <label>From</label>
                        <select>
                            {Object.keys(currencies).map(key =>
                                <option key={key} value={key}>{key} - {currencies[key]}</option>
                            )}
                        </select>
                    </div>
                    <div className="select">
                        <label>To</label>
                        <select>
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