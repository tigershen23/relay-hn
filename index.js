let React = require("react");
let ReactDOM = require("react-dom");
let Relay = require("react-relay")

class Item extends React.Component {
  render() {
    let item = this.props.store

    return (
      <div>
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} - {item.by.id}</h2>
        <hr />
      </div>
    );
  }
};
Item = Relay.createContainer(Item, {
  fragments: {
    store: () => Relay.QL`
      fragment on HackerNewsItem {
        title,
        score,
        url,
        by {
          id,
        }
      }
    `
  }
})

class ItemsList extends React.Component {
  _onChange(event) {
    let storyType = event.target.value
    this.setState({
      storyType
    });
    this.props.relay.setVariables({
      storyType
    })
  }

  render() {
    let items = this.props.store.stories.map((store, index) => {
      return <Item store={store} key={index} />
    })
    let variables = this.props.relay.variables

    let currentStoryType = (this.state && this.state.storyType) || variables.storyType

    return (
      <div>
        <select onChange={this._onChange.bind(this)} value={currentStoryType}>
          <option value="top">Top</option>
          <option value="new">New</option>
          <option value="ask">Ask HN</option>
          <option value="show">Show HN</option>
        </select>
        {items}
      </div>
    );
  }
}
ItemsList = Relay.createContainer(ItemsList, {
  initialVariables: {
    storyType: "top",
  },
  fragments: {
    store: () => Relay.QL`
      fragment on HackerNewsAPI {
        stories(storyType: $storyType) {${Item.getFragment("store")}},
      }
    `,
  },
})

class HackerNewsRoute extends Relay.Route {
  static routeName = "HackerNewsRoute"
  static queries = {
    store: ((Component) => {
      return Relay.QL`
        query root {
          hn { ${Component.getFragment("store")} },
        }
      `}),
  }
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer("http://www.GraphQLHub.com/graphql")
)

let mountNode = document.getElementById("container")
let rootComponent = <Relay.RootContainer
  Component={ItemsList}
  route={new HackerNewsRoute()} />
ReactDOM.render(rootComponent, mountNode)
