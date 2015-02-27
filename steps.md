## Step 1

Git clone git@github.com:btholt/reddadore

Run `npm install` from the reddadore directory.

Checkout index.html and app.jsx. No magic going on there.

Worth mentioning at this point we're using modern ES6 syntax thanks to Babel, previously called 6to5. We'll be using the following new techniques:

- ES6 modules. Those are the `import Xxxx from 'xxxx'` statements.
- `const yyy`. JS finally got a constant modifier.
- `class Zzzz extends Aaaa`. While this isn't much more than sugar for JS classes, it is pretty convenient.
- `method(){…}` syntax. ES6 is determined to never have you write the word function.
- `function(...bbbb){}` syntax. While we'll actually use this with JSX (which is not technically ES6) this is an example of the spread operator.

Start gulp running right now with `gulp watch`. If stuff seems to stop compiling, check gulp. Sometimes it'll crash if you give it bad input.

Let's make a new class.

```javascript
class App extends React.Component {
  render() {
    return (<h1>hai</h1>)
  }
}

export default App;
```

Run `node --harmony index.js` to start your node server and let's check it out in the browser at `localhost:3000`.

Let's start making a list of listings.

```javascript
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
    )
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
          return <div>el.title</div>
        })}
      </section>
    );
  }
}
```

- Here we've done a few things. One, we've nested a Links component inside of our App components.
- In the class constructor, we're setting the initial state. If you've previously done React, this is the new way to do `getInitialState`. React components all have state and props. State is maintained within a componoent and is mutable. Props are passed in (like you see on the Links tag in the App component) and are immutable. We'll get into later how props are mutated only by the parents where they are state.
- Inside the Links component we're seeing some of the lifecycle methods of React: `componentWillReceiveProps` and `componentDidMount`. These are run at defined times. In this case, `componentDidMount` runs when the first successful render happened and the markup has translated to being an extant DOM node. `componentWillReceiveProps` runs whenever the component is about to receive new props from its parents. In this case, it will receive a new subreddit to render, so it needs to call the API again.

## Step 2

```javascript

// start Links.render
render() {
  return (
    <section>
      {this.state.links.map(function(el) {
        return <Link {...el} key={el.id} />
      })}
    </section>
  );
}
// end Links.render

class Link extends React.Component {
  render() {
    return (
      <article className="link">
        <LinkTitle />
        <LinkActions />
        <LinkImage />
      </article>
    );
  }
}

class LinkTitle extends React.Component {
  render() {
    return (
      <h1>LinkTitle</h1>
    );
  }
}

class LinkActions extends React.Component {
  render() {
    return (
      <h1>LinkActions</h1>
    );
  }
}

class LinkImage extends React.Component {
  render() {
    return (
      <h1>LinkImage</h1>
    );
  }
}


```

- Some more stubbing out here. The most interesting part is the spread operator on the Link tag in the Links component. This is just saying take all the key/value pairs and spread them out as parameters.

```javascript

// start Link.render
<LinkTitle 
  title={this.props.title} 
  link={this.props.cleanUrl} 
/>
// end Link.render

class LinkTitle extends React.Component {
  render() {
    return (
      <a className="link__title-anchor" href={this.props.link}>
        <h2>{this.props.title}</h2>
      </a>
    );
  }
}

```

- Passing the necessary variables down to the title. Pretty simple. The interesting part may be the `{}`. This is just how you tell React to output the variable, not the literal string `"this.props.title"`.

```javascript

// start Link.render
<LinkActions
  subreddit={this.props.subreddit}
  domain={this.props.domain}
  comments={this.props.num_comments}
  score={this.props.score}
/>
// end Link.render

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

```

- Anything new here? I don't think so.

```javascript

// start top of file, under imports
const extensions = ['jpg', 'jpeg', 'gif', 'png'];
// end top of file, under imports

// start Link.render
<LinkImage
  cleanUrl={this.props.cleanUrl}
/>
// end Link.render

class LinkImage extends React.Component {
  render() {
    var parts = this.props.cleanUrl.split('.');
    if (extensions.indexOf(parts[parts.length-1]) >= 0) {
      return <img className="link__image" src={this.props.cleanUrl} />
    }
    return <h2 className="link__no-image">No image available.</h2>
  }
}

```

- Only new-ish thing here is you can do conditionals with what is shown or not. This is a little extreme; typically you wouldn't have two return statements.

## Step 3

```javascript

// start App
render() {
  return (
    <div>
      <AppHeader
        subredditName={this.state.subredditName}
      />
      <Links
        subredditName={this.state.subredditName}
      />
    </div>
  )
}
// end App

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subredditNameInput:"aww"
    }
  }
  render() {
    return (
      <header className="app__header">
        <h1 className="app__header__title">reddadore <small>{this.props.subredditName}</small></h1>
        <form className="app__header__form">
          <input value={this.state.subredditNameInput}  />
          <button type="submit">
            Submit
          </button>
        </form>
      </header>
    );
  }
}

```

- Okay, now try and type in the input. It shouldn't do anything. That's because React is doing a re-render every single time you type, and that state value isn't changing. This is where admittedly Angular shines and React is more verbose. You need to tell React what to do with the incoming user input.

```javascript

// start AppHeader method
subredditNameEvent(e) {
  this.setState({subredditNameInput: e.target.value});
}
// end AppHeader method

// start AppHeader.render
<input value={this.state.subredditNameInput} onChange={this.subredditNameEvent.bind(this)} />
// end AppHeader.render

```

- Yay! You can change the input now. Now you can be sure that it is reflecting its internal state. Let's make it possible to change the subreddit.

```javascript

// start App method
setSubredditName(name) {
  this.setState({subredditName:name});
}
// end App method

// start AppHeader method
submitForm(e) {
  e.preventDefault();
  this.props.setSubredditName(this.state.subredditNameInput);
  this.setState({subredditNameInput:""})
}
// end AppHeader method

// start AppHeader.render
<form className="app__header__form" onSubmit={this.submitForm.bind(this)}>
// end AppHeader.render

```

- Some moving parts here. We're passing down a callback from the parent method to the child component that the child can now call to change the state of the parent which will in turn be passed back down to the child. This allows the parent to marshall its own data and you know anything that modifies that data can only call that method because that's all you've exposed. This is a super powerful pattern because we've limited the scope of where bugs can be. This is why React is special to me. 
- Also, when we change that value because of how we set up the `componentWillReceiveProps`, this will cause the app to update itself via the API. Pretty sweet.