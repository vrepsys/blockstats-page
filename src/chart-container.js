import React from 'react';
import './chart-container.scss'


export default class ChartContainer extends React.Component {
  render(){
    return (
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="chart-container">
          <div className="info-box">
            <h1>{this.props.title}</h1>
            <span className='explanation'>{this.props.description}</span>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}