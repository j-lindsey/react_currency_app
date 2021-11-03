import React from 'react';
import './ratechart.css';

class RateChart extends React.Component {
  
    render() {
        const { currency, rates } = this.props;

        return (
            <div className="rateChart">
            <h2>Rates</h2>
            {Object.keys(rates).map(key =>
                <div className="rate" key={key}>
                    <h4>1 {currency}</h4>
                    <h4>{rates[key]}</h4>
                    <h4>{key}</h4>
                </div>
            )}
            </div>
        )

    }
}


export default RateChart;