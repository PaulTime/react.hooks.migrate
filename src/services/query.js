import React from 'react';
import PropTypes from 'prop-types';

/**
 * Query component
 * basic usage:
 *  <Query action={() => window.fetch('/test').then(res => res.json()}>
 *    {({ data }) => data}
 *  </Query>
 *
 * fetching on props update: props.watch: any[] - list of values that listening for changes
 */
const Query = (props) => {
  const { action, filter, loader, watch, onSuccess, onError, children } = props;

  const currentFetch = React.useRef();

  const [state, setState] = React.useState({ loading: filter(), injected: {} });

  const fetch = (fetchId) => {
    action({ ...props, ...state.injected })
      .then(async (fetched = {}) => {
        if (currentFetch && fetchId !== currentFetch.current) return;

        await onSuccess({ ...props, ...fetched });
        setState({
          loading: false,
          injected: fetched,
        });
      })
      .catch(async (error) => {
        if (currentFetch && fetchId !== currentFetch.current) return;

        console.error(error);

        await onError(error, props);
        setState({ ...state, loading: false });
      });
  };

  const startFetch = () => {
    const loading = filter();

    setState({ ...state, loading });

    if (loading) {
      currentFetch.current = Math.random();
      fetch(currentFetch.current);
    }
  };

  React.useEffect(startFetch, watch);

  if (loader && state.loading) {
    return '...loading';
  }

  if (typeof children === 'function') {
    return children({ loading: state.loading, ...state.injected });
  }

  return React.cloneElement(
    React.Children.only(children),
    { loading: state.loading, ...state.injected },
  );
};

Query.propTypes = {
  action: PropTypes.func,
  filter: PropTypes.func,
  loader: PropTypes.bool,
  watch: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

Query.defaultProps = {
  action: () => Promise.resolve(),
  filter: () => true,
  loader: true,
  watch: [],
  onSuccess: () => {},
  onError: () => {},
};

export default Query;
