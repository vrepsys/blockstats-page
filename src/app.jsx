import React from 'react';
import BarChart from './barchart'
import LineChart from './linechart'
import moment from 'moment'
import {parseDates, getLatestValues} from './linechart-data'
import axios from 'axios';
import ChartContainer from './chart-container'
import './app.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios.get('/data/data.json')
      .then((response) => {
        const {appsData, domainsData} = response.data;
        parseDates(appsData);
        parseDates(domainsData);
        const latestAppInstallsData = getLatestValues(appsData);
        this.setState({appsData, domainsData, latestAppInstallsData});
      })
      .catch((error) => console.log(error))
  }

  render() {
    const xRange = [moment('2018-08-23').utc().toDate(), moment('2018-09-30').utc().toDate()]
    return (
      <div>
        {this.state.appsData &&
        <div className="row justify-content-center no-gutters">
            <div className="col-xl-12 col-lg-10 col-md-11 col-sm-12">
              <div className="intro">
                <h1 className="brand">THEBLOCKSTATS</h1> 
                <p>
                  This page charts <a href='https://blockstack.org'>Blockstack</a> related statistical data. 
                  Charts are updated every day around 10:00 UTC.
                </p>
                <p>
                  Find more information and ask questions on <a href="#">Blockstack forum.</a>
                </p>
                <p>
                  TheBlockstats code is <a href="https://github.com/vrepsys/blockstats">open</a> <a href="https://github.com/vrepsys/blockstats-page">source.</a>
                </p>
                <p>Contacts: <a href='https://twitter.com/vrepsys'>twitter</a>, <a href='mailto:valdemaras@gmail.com'>email</a></p>
              </div>
            </div>
            <ChartContainer 
              title="Top 10 apps by number of installations over time"
              description={
                <span>
                  <p>
                    An app is considered to be installed when it's present on a Blockstack user's profile. 
                    Here's an <a href='https://gaia.blockstack.org/hub/1G4nASzd9NATfh8v21RzZJGYzCJuxNqKVg/profile.json'>example of a user profile</a> that 
                    has several apps installed.
                  </p>
                  <p>
                    Only multiplayer apps i.e. apps where users can share their data with each other, appear on user profiles.
                    Some of the popular Blockstack apps are single-player and thus are not included in the stats on this page.
                  </p>
                </span>
              }>
              <LineChart 
                data={this.state.appsData} 
                domain={{x: xRange}}/>
            </ChartContainer>
            <ChartContainer 
              title="Top 10 apps by number of installations">
                  <BarChart 
                    data={this.state.latestAppInstallsData}/>
            </ChartContainer>
            <ChartContainer 
              title="Total number of apps installed over time"
              description="Doesn't include apps that have localhost in their name.">
                  <LineChart 
                    data={this.state.domainsData} 
                    categories={['total_installs']} 
                    domain={{x: xRange, y: [0, 8000]}}/>
            </ChartContainer>
            <ChartContainer 
              title="Number of unexpired domains over time"
              description={
                (<span>Number of names returned by the <a href='https://core.blockstack.org/#name-querying-get-all-names'>
                  /names</a> endpoint.
                 </span>)}>
                  <LineChart 
                    data={this.state.domainsData} 
                    categories={['domains']} 
                    domain={{x: xRange, y: [0, 21000]}}/>
            </ChartContainer>
            <ChartContainer 
              title='Blockstack addresses over time'
              description={
                  (<span>
                    <p>
                    Blockstack has 2 kinds of human readable id's: names and subdomains (also called sponsored names).
                    This page refers to names as domains.
                    </p>
                    <p>
                    In this chart, total_addressses refers to domain count + subdomain count.
                    Persons represents the count of addresses that have '@type: person' in their profile.
                    </p>
                    <p>
                      Subdomains is the number of entries returned by the <a href='https://core.blockstack.org/#name-querying-get-all-subdomains'>/subdomains</a> endpoint.
                    </p>
                  </span>)}>
                  <LineChart 
                    data={this.state.domainsData} 
                    categories={['total_addresses', 'subdomains', 'persons', 'domains']} 
                    domain={{x: xRange}}/>
            </ChartContainer>
            <ChartContainer 
              title='Users that have localhost app'
              description={
                <span>
                <p>
                  This can be used to measure the growth of developer interest in Blockstack.
                </p>
                <p>
                  Users that try develop a multi-player Blockstack app on their local machines 
                  appear to have a 'localhost' app on their user profiles.
                </p>
                </span>
                }>
                  <LineChart 
                    data={this.state.domainsData} 
                    categories={['localhost_installs']} 
                    domain={{x: xRange, y: [0, 400]}}/>
            </ChartContainer>
        </div>}
      </div>
    );
  }
}