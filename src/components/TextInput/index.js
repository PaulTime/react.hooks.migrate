import React from 'react';
import PropTypes from 'prop-types';

import BEM from 'services/bem';

import './index.scss';

const bem = BEM('text-input');

const TextInput = React.memo(({ input, meta, id, placeholder }) => (
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
));

TextInput.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  meta: PropTypes.object,
  input: PropTypes.object,
};

TextInput.defaultProps = {
  id: undefined,
  placeholder: undefined,
  meta: undefined,
  input: undefined,
};

export default TextInput;
