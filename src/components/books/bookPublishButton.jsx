import React from 'react';
import PropTypes from 'prop-types';

const BookPublishButton = ({ book }) => <Button>Publish</Button>;

BookPublishButton.defaultProps = {
  book: null,
};

BookPublishButton.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
  }),
};

export default BookPublishButton;
