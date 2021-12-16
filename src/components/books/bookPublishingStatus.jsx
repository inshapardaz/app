import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Doughnut } from 'react-chartjs-2';

const BookPublishingStatus = ({ book }) => {
  const intl = useIntl();
  if (!book || book.status === 'Published' || !book.links.update || !book.pageStatus) {
    return null;
  }

  const data = {
    labels: book.pageStatus.map((s) => intl.formatMessage({ id: `status.${s.status}` })),
    datasets: [
      {
        label: intl.formatMessage({ id: 'book.publishing.status' }),
        data: book.pageStatus.map((s) => s.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (<Doughnut data={data} />);
};

BookPublishingStatus.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string,
    progress: PropTypes.number,
    pageCount: PropTypes.number,
    pageStatus: PropTypes.arrayOf(PropTypes.shape({
    })),
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }).isRequired,
};
export default BookPublishingStatus;
