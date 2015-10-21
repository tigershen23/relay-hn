let React = require("react");
let ReactDOM = require("react-dom");
let Relay = require("react-relay")

class Item extends React.Component {
  render() {
    let item = this.props.store.item;

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
      fragment on HackerNewsAPI {
        item(id: 8863) {
          title,
          score,
          url,
          by {
            id
          }
        }
      }
    `
  }
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
