import React from 'react';
import './top-apps-list.scss'



export default class TopAppsList extends React.Component {
  render(){
    return (
      <table className='top-apps-table'>
          {this.props.apps.map((app, index) => {
              return <tr key={index}>
                        <td>{index+1}.</td>
                        <td className='app-name'><a href={app[1]}>{app[1]}</a></td>
                        <td>{app[2]}</td>
                     </tr>;
            })}
      </table>
    );
  }
}