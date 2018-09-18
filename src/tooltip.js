import React from 'react';
import moment from 'moment'
import styles from './tooltip.scss'


export default class Tooltip extends React.Component {
  render() {
    if (!this.props.selectedDate) return <div></div>
    const dataByDate = this.props.dataByDate;
    const data = dataByDate.get(this.props.selectedDate)
    const dateFormatted = moment(this.props.selectedDate).format('YYYY-MM-DD')
    const {x, y} = this.props.position;
    return (
      <div className='tooltip' style={{left: x, top: y}}>
        <table>
          <tbody>
            <tr>
              <td colSpan="3">{dateFormatted}</td>
            </tr>
            {data.map((p, i) =>
                <tr key={`${p.name}-${dateFormatted}`}>
                  <td className='legend-color-td'>
                    <div className='legend-color-box' style={{backgroundColor: this.props.colorScale.get(p.name)}}></div>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.count}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}