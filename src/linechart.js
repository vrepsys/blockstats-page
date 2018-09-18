import React from 'react';
import blockstats_theme from './charts-theme'
import {VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryLegend} from 'victory';
import Tooltip from './tooltip'
import CustomCursorContainer from './custom-cursor-container'
import {removeHttpFromNames, getDataByDate, getCategories, includeOnly} from './linechart-data'

const colors = ['#993366', '#339966', '#666699', '#FF6600', '#0066CC', '#008080',
'#993300', '#333399', '#800000', '#660066', '#003366', '#FF8080'];

function findClosestPoint(value, categories) {
  if (value === null) return null;

  const sortedDates = categories[0].data
    .map((datum) => {
      return {
        date: datum.date, 
        diff: Math.abs(datum.date.getTime() - value.x.getTime())}
    })
    .sort((a, b) => a.diff - b.diff);

  const selectedDate = sortedDates[0].date;
  
  return selectedDate;
};

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);

    const categories = this.props.categories;
    const data = categories ? includeOnly(this.props.data, categories) : this.props.data;

    this.svgElement = React.createRef()

    removeHttpFromNames(data);
    this.dataByDate = getDataByDate(data);
    this.dataCategories = getCategories(data);

    this.state = {
      points: {},
      props: {},
      showTooltip: true,
      selectedDate: null
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.setState({showTooltip: false, selectedDate: null});
  }

  render(){
    const categories = this.dataCategories;
    const dataByDate = this.dataByDate;

    const colorScale = new Map(categories.map((c, i) => {
      return [c.name, colors[i]]
    }));

    const lines = categories.map((cat, i) => {
      return <VictoryLine
                  style={{
                    data: {stroke: colorScale.get(cat.name)}
                  }}
                  name={cat.name}
                  key={i}
                  data={cat.data}
                  x="date"
                  y="count"
                />
   });

    return (
      <div ref={el => this.container = el}>
        <VictoryChart
          domainPadding={{ y: 10 }}
          theme={blockstats_theme} 
          width={600} 
          height={320}
          padding={{ top: 20, bottom: 24, left: 50, right:130 }}
          scale={{ x: "time" }}
          domain={this.props.domain}
          containerComponent={
          <CustomCursorContainer 
          onCursorLeave={() => {
            this.setState({showTooltip: false, selectedDate: null});
          }}
          onCursorChange={(cursorValue, targetProps) => {
              const {scale, domain, parentSVG} = targetProps;
              if (cursorValue && parentSVG) {
                const selectedDate = findClosestPoint(cursorValue, categories);
                const svg_x = scale.x(selectedDate);
                const ctm = parentSVG.getScreenCTM();
                const page_x = svg_x * ctm.a + ctm.e;
                const svg_y = scale.y(domain.y[1]);
                const page_y = svg_y * ctm.d + ctm.f;
                this.setState({ 
                  showTooltip: true,
                  position: {x: page_x+20, y: page_y},
                  selectedDate: selectedDate
                });
              }
              else {
                this.setState({showTooltip: false, selectedDate: null});
              }
          }
        }/>}
        >
              <VictoryAxis
                theme={blockstats_theme}
                standalone={false}
              />
              <VictoryAxis dependentAxis
                theme={blockstats_theme}
                standalone={false}
                width={600}
              />
              <VictoryLegend x={470} y={50}
                orientation="vertical"
                gutter={20}
                style={{title: {fontSize: 20 }}}
                colorScale={colors}
                data={categories.map((c) => Object.assign(c, {symbol: {type: 'square'}}))}
              />
                {lines}
      {this.state.selectedDate &&
      <VictoryScatter
          style={{
            data: {fill: (d) => colorScale.get(d.name)}
          }}
          size={2}
          data={dataByDate.get(this.state.selectedDate)}
          x="date"
          y="count"
        />}
      </VictoryChart>

        {this.state.showTooltip && 
        <Tooltip 
          dataByDate={dataByDate} 
          colorScale={colorScale} 
          selectedDate={this.state.selectedDate} 
          position={this.state.position} />}
      </div>
    );
  }
}