import React from 'react';
import PropTypes from 'prop-types';

// import { Doughnut } from 'react-chartjs-2';

const BookPublishingStatus = ({ book }) => {
  if (!book || book.status === 'Published' || !book.links.update) {
    return null;
  }

  return (<h4>Chart will render here</h4>);
  // return (<Doughnut data={null} />);
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
