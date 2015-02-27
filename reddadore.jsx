import React from 'react';
import { v1 as V1Api } from 'snoode';

const extensions = ['jpg', 'jpeg', 'gif', 'png'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditName:"aww"
    };
  }
  setSubredditName(name) {
    this.setState({subredditName:name});
  }
  render() {
    return (
      <div>
        <AppHeader
          subredditName={this.state.subredditName}
          setSubredditName={this.setSubredditName.bind(this)}
        />
        <Links
          subredditName={this.state.subredditName}
        />
      </div>
    )
  }
}

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditNameInput:"aww"
    }
  }
  submitForm(e) {
    e.preventDefault();
    this.props.setSubredditName(this.state.subredditNameInput);
    this.setState({subredditNameInput:""})
  }
  subredditNameEvent(e) {
    this.setState({subredditNameInput: e.target.value});
  }
  render() {
    return (
      <header className="app__header">
        <h1 className="app__header__title">reddadore <small>{this.props.subredditName}</small></h1>
        <form className="app__header__form" onSubmit={this.submitForm.bind(this)}>
          <input value={this.state.subredditNameInput} onChange={this.subredditNameEvent.bind(this)} />
          <button type="submit">
            Submit
          </button>
        </form>
      </header>
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
          return <Link {...el} key={el.id} />
        })}
      </section>
    );
  }
}

class Link extends React.Component {
  render() {
    return (
      <article className="link">
        <LinkTitle 
          title={this.props.title} 
          link={this.props.cleanUrl} 
        />
        <LinkActions
          subreddit={this.props.subreddit}
          domain={this.props.domain}
          comments={this.props.num_comments}
          score={this.props.score}
        />
        <LinkImage
          cleanUrl={this.props.cleanUrl}
        />
      </article>
    );
  }
}

class LinkTitle extends React.Component {
  render() {
    return (
      <a className="link__title-anchor" href={this.props.link}>
        <h2>{this.props.title}</h2>
      </a>
    );
  }
}

class LinkActions extends React.Component {
  render() {
    return (
      <ul className="link__actions">
        <li className="link__action"><a href="#">{this.props.subreddit}</a></li>
        <li className="link__action"><a href="#">{this.props.domain}</a></li>
        <li className="link__action"><a href="#">comments: {this.props.comments}</a></li>
        <li className="link__action"><a href="#">score: {this.props.score}</a></li>
      </ul>
    );
  }
}

class LinkImage extends React.Component {
  render() {
    var parts = this.props.cleanUrl.split('.');
    if (extensions.indexOf(parts[parts.length-1]) >= 0) {
      return <img className="link__image" src={this.props.cleanUrl} />
    }
    return <h2 className="link__no-image">No image available.</h2>
  }
}

export default App;