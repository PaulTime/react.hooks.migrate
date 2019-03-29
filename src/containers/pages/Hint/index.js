import React from 'react';

import BEM from 'services/bem';

import './index.scss';

const bem = BEM('hint-page');

const HOST = process.env.NODE_ENV === 'production' ? process.env.API_HOST : '';

const HintPage = React.memo(({ location }) => {
  const [loading, setLoading] = React.useState(Boolean(location.query.search));
  const [result, setResult] = React.useState();

  React.useEffect(
    () => {
      setLoading(true);
      window
        .fetch(`${HOST}/api/v1/car-info/${location.query.search}`)
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          setResult(data.result);
        })
    },
  [location.query.search]);

  return (
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
  );
});

export default HintPage
