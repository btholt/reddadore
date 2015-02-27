import React from 'react';
import { v1 as V1Api } from 'snoode';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditName:"aww"
    };
  }
  render() {
    return (
      <div>
        <Links
          subredditName={this.state.subredditName}
        />
      </div>
    );
  }
}

class Links extends React.Component {
  constructor(props) {
    super(props);
    this.api = null;
    this.state = {
      links: []
    };
  }
  componentDidMount() {
    this.getListings(this.props.subredditName);
  }
  componentWillReceiveProps(newProps) {
    this.getListings(newProps.subredditName);
  }
  getListings(subredditName) {
    this.api = new V1Api({
      userAgent: null,
      origin: 'https://ssl.reddit.com',
    });
    this.api.links.get({
      query: {
        subredditName: subredditName,
        sort: "hot"
      }
    }).then(function(data) {
      this.setState({links:data});
    }.bind(this))
    .done();
  }
  render() {
    return (
      <section>
        {this.state.links.map(function(el) {
          return <div>{el.title}</div>
        })}
      </section>
    );
  }
}

export default App;