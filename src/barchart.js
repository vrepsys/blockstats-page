import React from 'react';
import {range} from 'lodash';
import blockstats_theme from './charts-theme'
import {VictoryBar, VictoryChart, VictoryAxis} from 'victory';

export default class BarChart extends React.Component {
  render(){
    const data = this.props.data;
    data.sort((a, b) => a.count - b.count);


    return (
      <div >
        <VictoryChart
          theme={blockstats_theme}
          domainPadding={20}
          padding={{ top: 10, bottom: 25, left: 120, right:80 }}
          width={400} 
          height={320}
        >
          <VictoryAxis
            dependentAxis
            tickValues={range(0, data.length)}
            style={{tickLabels: {padding: 5}}}
            tickFormat={(d) => d.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}
          />
          <VictoryAxis
            tickFormat={(x) => (`${x / 1000}k`)}
          />
          <VictoryBar
            horizontal
            data={data}
            barRatio={0.9}
            x="name"
            y="count"
            labels={(d) => d.count}
          />
        </VictoryChart>
      </div>
    );
  }
}