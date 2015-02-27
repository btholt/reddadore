import React from 'react';
import { v1 as V1Api } from 'snoode';

(function AppInit() {
  "use strict";
  var imgMatch = /\.(?:gif|jpe?g|png)/gi;

  class Links extends React.Component {
    constructor(props) {
      super(props);
      this.api = null;
      this.state = {
        links: []
      };
    }
    componentDidMount() {
      this.api = new V1Api({
        userAgent: 'osx',
        origin: 'https://ssl.reddit.com',
      });
      this.api.links.get({
        query: {
          subredditName: this.props.subredditName,
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
      // console.log(this.props);
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
            upvotes={this.props.ups}
            downvotes={this.props.down}
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
        <a href={this.props.link}>
          <h2>{this.props.title}</h2>
        </a>
      );
    }
  }

  class LinkActions extends React.Component {
    render() {
      return <h1>Link Action</h1>
    }
  }

  class LinkImage extends React.Component {
    render() {
      
      if (imgMatch.exec(this.props.cleanUrl)) {
        return <img className="link__image" src={this.props.cleanUrl} />
      }
      return <h2>No image available.</h2>
    }
  }

  React.render(<Links subredditName="pics" />, window.document.querySelector("#target"));
})();