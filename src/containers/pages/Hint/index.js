import React from 'react';
import PropTypes from 'prop-types';

import BEM from 'services/bem';
import Query from 'services/query';

import './index.scss';

const bem = BEM('hint-page');

const HOST = process.env.NODE_ENV === 'production' ? process.env.API_HOST : '';

const HintPage = React.memo(({ location }) => (
  <Query
    action={() => window
      .fetch(`${HOST}/api/v1/car-info/${location.query.search}`)
      .then(response => response.json())
    }
    loader={false}
    filter={() => Boolean(location.query.search)}
    watch={[location.query.search]}
  >
    {({ loading, result }) => (
      <table className={bem()}>
        <caption className={bem('caption')}>Search result</caption>

        <thead className={bem('head')}>
          <tr>
            <th>owner</th>
            <th>year</th>
            <th>crashesCount</th>
            <th>ownersCount</th>
          </tr>
        </thead>

        <tbody className={bem('body', { loading })}>
          <tr>
            {result ? Object.entries(result).map(([field, value]) => (
              <td key={field}><span>{value}</span></td>
            )) : (
              <td colSpan={4}><span>try to search cars</span></td>
            )}
          </tr>
        </tbody>
      </table>
    )}
  </Query>
));

HintPage.propTypes = {
  location: PropTypes.object,
};

HintPage.defaultProps = {
  location: undefined,
};

export default HintPage;
