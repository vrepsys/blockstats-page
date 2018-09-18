import React from 'react';
import './chart-container.scss'


export default class ChartContainer extends React.Component {
  render(){
    return (
      <div className="col-xl-6 col-lg-10 col-md-11 col-sm-12">
        <div className="chart-container">
          <div className="info-box">
            <h1>{this.props.title}</h1>
            <span class='explanation'>{this.props.description}</span>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}