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

class TopItemsList extends React.Component {
  render() {
    let items = this.props.store.topStories.map((store, index) => {
      return <Item store={store} key={index} />
    })

    return (
      <div>{items}</div>
    );
  }
}
TopItemsList = Relay.createContainer(TopItemsList, {
  fragments: {
    store: () => Relay.QL`
      fragment on HackerNewsAPI {
        topStories {${Item.getFragment("store")}},
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
  Component={TopItemsList}
  route={new HackerNewsRoute()} />
ReactDOM.render(rootComponent, mountNode)
