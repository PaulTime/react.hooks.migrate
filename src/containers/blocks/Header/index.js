import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import qs from 'query-string';

import BEM from 'services/bem';
import SearchForm from 'containers/forms/Search';

import './index.scss';

const bem = BEM('header');

@withRouter
export default class Header extends React.PureComponent {
  static displayName = 'Header';

  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
  };

  static defaultProps = {
    location: undefined,
    history: undefined,
  };

  onSubmit = (values) => {
    const { location, history } = this.props;

    history.replace(`${location.pathname}?${qs.stringify(values)}`);
  };

  render() {
    const { location } = this.props;

    return (
      <header className={bem()}>
        <h1 className={bem('title')}>header block</h1>

        <Form
          onSubmit={this.onSubmit}
          component={SearchForm}
          initialValues={qs.parse(location.search)}
        />
      </header>
    );
  }
}
