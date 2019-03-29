import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import qs from 'query-string';

/**
 *  LayoutRoute
 *  Usage:
 *
 *  import { Route } from 'react-router-dom'
 *
 *  import LayoutRoute 'components/LayoutRoute'
 *  import YourLayoutComponent 'components/YourLayoutComponent'
 *  import BlockComponent 'components/BlockComponent'
 *
 *  <LayoutRoute
 *    path="/page-name"
 *    component={YourLayoutComponent}
 *  >
 *    <Route
 *      path="/sub-page#1-name"
 *      component={BlockComponent}
 *    />
 *  </LayoutRoute>
 * */
const LayoutRoute = ({ children, component: Component, path, location, ...rest }) => (
  <Route
    path={path}
    render={() => (
      <Component>
        <Switch location={{ ...location, query: qs.parse(location.search) }}>
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              path: `${path || ''}${child.props.path || ''}`,
            })
          )}
        </Switch>
      </Component>
    )}
    {...rest}
  />
);

LayoutRoute.propTypes = {
  path: PropTypes.string,
  location: PropTypes.object,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.object]).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]).isRequired,
};

LayoutRoute.defaultProps = {
  component: React.Fragment,
  path: undefined,
  location: undefined,
};

export default LayoutRoute;
