import React from 'react';
import BarChart from './barchart'
import LineChart from './linechart'
import ReactQueryParams from 'react-query-params';
import {parseDates, getLatestValues, getDateRange} from './linechart-data'
import axios from 'axios';
import ChartContainer from './chart-container'
import TopAppsList from './top-apps-list'
import Papa from 'papaparse';
import './app.scss'

export default class App extends ReactQueryParams {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const dataFile = this.queryParams.data || '/data/data.json'
    axios.get(dataFile)
      .then((response) => {
        const {appsData, domainsData} = response.data;
        parseDates(appsData);
        parseDates(domainsData);
        const latestAppInstallsData = getLatestValues(appsData);
        this.setState({appsData, domainsData, latestAppInstallsData});
      })
      .catch((error) => console.log(error))

    axios.get('/data/apps.top100.csv')
      .then((response) => {
        const top100apps = Papa.parse(response.data).data.slice(1).filter((el) => el.length > 1)
        this.setState({apps: top100apps});
      })
      .catch((error) => console.log(error))
  }

  render() {
    if (!this.state.appsData || !this.state.apps) {
      return (<div>Loading data..</div>)
    }
    else {
      const xRange = getDateRange(this.state.appsData);
      return (
        <div>
          <div className="row justify-content-center no-gutters">
            <div className="col-xl-12 col-lg-10 col-md-11 col-sm-12">
              <div className="intro">
                <h1 className="brand">THEBLOCKSTATS</h1> 
                <p>
                  This page charts <a href='https://blockstack.org'>Blockstack</a> related statistical data. TheBlockstats code is <a href="https://github.com/vrepsys/blockstats">open</a> <a href="https://github.com/vrepsys/blockstats-page">source.</a>
                </p>
                <p>Contacts: <a href='https://twitter.com/vrepsys'>twitter</a>, <a href='mailto:valdemaras@gmail.com'>email</a></p>
                <p class='important-message'>
                  Important: The data on this page is no longer being updated.
                </p>
                <p>
                  Due to a growing size of the dataset, the <a href="https://github.com/vrepsys/blockstats">blockstats scanner</a> is no longer able to keep up.
                  Contributions that would optimize the scanner and make theblockstats work again are very welcome. 
                  Please contact <a href='https://twitter.com/vrepsys'>me</a> if you'd like to give it a try.
                </p>
              </div>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-xl-6 col-sm-12">
              <div className="row justify-content-center no-gutters">
                <ChartContainer 
                  title="Top 10 apps by number of installations over time"
                  description={
                    <span>
                      <p>
                        <b>Only multiplayer apps</b> are included in this and all other charts on this page.
                        To let their users discover each other and share data with each other multiplayer apps 
                        share links to their gaia buckets on user profiles. 
                      </p>
                      <p>
                        Here's an <a href='https://gaia.blockstack.org/hub/1G4nASzd9NATfh8v21RzZJGYzCJuxNqKVg/profile.json'>example of a user profile</a> that has several multiplayer apps installed.
                      </p>
                      <p>
                        Theblockstats scans these user profiles daily to collect the statistics presented on this page.
                      </p>
                      <p>
                        For a list that includes both single and multi-player apps visit <a href="https://app.co/blockstack">app.co/blockstack</a>
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
                        domain={{x: xRange}}/>
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
                        domain={{x: xRange}}/>
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
                  title='Users that have a localhost app'
                  description={
                    <span>
                    <p>
                      This can be used to measure the growth of developer interest in Blockstack.
                    </p>
                    <p>
                      Users that try develop a multiplayer Blockstack app on their local machines 
                      appear to have a 'localhost' app on their user profiles.
                    </p>
                    </span>
                    }>
                      <LineChart 
                        data={this.state.domainsData} 
                        categories={['localhost_installs']} 
                        domain={{x: xRange}}/>
                </ChartContainer>
            </div>
          </div>
          <div className="col-xl-6 col-sm-12">
            <div className="row justify-content-center no-gutters">
              <ChartContainer 
                title='Top 100 apps by number of installations'
                description={
                  <span>
                    <p>
                      You can also <a href='data/apps.all.csv'>download a CSV</a> containing all 
                      (multiplayer) Blockstack apps and their latest installation numbers.
                    </p>
                    <p>
                        The list below and all other charts on this page contain <b>multiplayer apps only</b>. For a list that includes both single and multi-player apps visit <a href="https://app.co/blockstack">app.co/blockstack</a>
                    </p>
                  </span>
                  }>
                <TopAppsList apps={this.state.apps} />
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
      );
    }
  }
}