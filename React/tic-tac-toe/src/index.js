import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'


const routes = [
  {
    path: "/a",
    component: A1

  },
  {
    path: "/b",
    component: B1,
    routes: [
      {
        path: "/b/c",
        component: C1,
      },
      {
        path: "/b/d",
        component: D1,
      }
    ]
  }
]

function RouteConfigExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/a"> A </Link>
          </li>
          <li>
            <Link to="/b">B</Link>
          </li>
        </ul>

        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </div>
    </Router>
  )

}

function RouteWithSubRoutes(route) {

  // console.log('123',route)
  console.log('path',route.path)
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes} />
      )}
    />
  )

}

function A1(xxx) {
  console.log(xxx)
  return (
    <div>this is A1</div>
  )
}
function B1({ routes }) {
  console.log('B1',routes)
  return (
    <div>
      <div>this is B1</div>
      <div>
        <ul>
          <li>
            <Link to="/b/c">c</Link>
          </li>
          <li>
            <Link to="/b/d">d</Link>
          </li>
        </ul>
      </div>
      <Switch>
        {
          routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
      </Switch>
    </div>

  )

}
function C1() {
  return (
    <div>this is C1</div>
  )

}
function D1() {

  return (
    <div>this is D1</div>
  )
}

// ========================================

ReactDOM.render(
  <RouteConfigExample />,
  document.getElementById('root')
);
