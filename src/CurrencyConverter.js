import React from 'react';
import { checkStatus, json } from './utils';

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
            <div>
                {Object.keys(currencies).map(key => 
                    <h4 value={key}>{key}</h4>
                )}
            </div>
        )
    }
}


export default CurrencyConverter;