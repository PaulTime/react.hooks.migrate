import React from 'react';

const actionDefault = () => Promise.resolve();

export const configDefault = {
  filter: () => true,
  loader: true,
  onSuccess() {},
  onError() {},
};

/**
 * fetch decorator
 * basic usage:
 *  fetch(async function(props) { }, configDefault - optional param)(YourReactComponent)
 *
 * runs in two steps:
 *  1. decide whether it need to fetch at all - runs configDefault.filter(props),
 *    if return true than fetch decorator
 *    will show default loader instead of mounting your wrapped component
 *    (behavior can be extended or changed, depends on config params)
 *
 *  2. after loading state has activated - and launch your async action
 *    (first argument of decorator) loader shows until your async function
 *    waiting for being resolved (object returned from async function
 *    will be merged with props of your component)
 *
 * fetching on props update:
 *  - simply call this.props.fetch() inside your wrapped component to run steps mentioned above
 */
export default (action = actionDefault, config = {}) => Component =>
  class FetchDecorator extends React.Component {
    static displayName = `Fetch(${Component.displayName || Component.name})`;

    static config = { ...configDefault, ...config };

    state = {
      loading: FetchDecorator.config.filter(this.props),
      injectedProps: {},
    };

    fetchId = undefined;

    componentDidMount() {
      this.startFetch();
    }

    componentWillUnmount() {
      this.fetchId = undefined;
    }

    startFetch = () => {
      if (!this.state.loading) return;

      this.fetchId = Math.random();
      this.fetch(this.fetchId);
    };

    fetch = (fetchId) => {
      action({ ...this.props, ...this.state.injectedProps })
        .then(async (fetched = {}) => {
          if (fetchId !== this.fetchId) return;

          await FetchDecorator.config.onSuccess({ ...this.props, ...fetched });

          this.setState({
            loading: false,
            injectedProps: fetched,
          });
        })
        .catch(async (error) => {
          if (fetchId !== this.fetchId) return;

          console.error(error);

          await FetchDecorator.config.onError(error, this.props);
          this.setState({ loading: false });
        });
    };

    fetchOnUpdate = () => {
      this.setState(
        { loading: FetchDecorator.config.filter(this.props) },
        this.startFetch,
      );
    };

    render() {
      const { loading, injectedProps } = this.state;

      if (FetchDecorator.config.loader && loading) {
        return '...loading';
      }

      return (
        <Component
          {...this.props}
          {...injectedProps}
          loading={loading}
          fetch={this.fetchOnUpdate}
        />
      );
    }
  };
