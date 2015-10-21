import babelRelayPlugin from "babel-relay-plugin"
import introspectionQuery from "graphql/utilities".introspectionQuery
import request from "sync-request"

let graphQLHubUrl = "http://www.GraphQLHub.com/graphql"
let response = request("get", graphQLHubUrl, {
  qs: {
    query: introspectionQuery,
  }
})

let schema = JSON.parse(response.body.toString("utf-8"))

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: true,
})
