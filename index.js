import React from "react"
import ReactDOM from "react-dom"

class Item extends React.Component {
  render() {
    let item = this.props.store.item

    return (
      <div>
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} - {item.by.id}</h2>
        <hr />
      </div>
    );
  }
}

