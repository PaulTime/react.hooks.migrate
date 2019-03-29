import React from 'react';
import PropTypes from 'prop-types';

import BEM from 'services/bem';

import './index.scss';

const bem = BEM('text-input');

export default class TextInput extends React.PureComponent {
  static displayName = 'TextInput';

  static propTypes = {
    id: PropTypes.string,
    placeholder: PropTypes.string,
    meta: PropTypes.object,
    input: PropTypes.object,
  };

  static defaultProps = {
    id: undefined,
    placeholder: undefined,
    meta: undefined,
    input: undefined,
  };

  render() {
    const {
      input, meta, id, placeholder,
    } = this.props;

    return (
      <label htmlFor={id} className={bem()}>
        <input
          type="text"
          {...input}
          id={id}
          placeholder={placeholder}
        />

        {meta.touched && meta.error && (
          <span className={bem('error')}>{meta.error}</span>
        )}
      </label>
    );
  }
}
