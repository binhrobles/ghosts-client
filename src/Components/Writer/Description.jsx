import React from 'react';
import PropTypes from 'prop-types';
import { Description } from '@zeit-ui/react';
import { WRITER_MODES } from './constants';

const DescriptionComponent = ({ writerView }) => {
  switch (writerView) {
    case WRITER_MODES.text:
      return <Description title="Leave Something" />;
    case WRITER_MODES.metadata:
      return <Description title="Extras" />;
    default:
      return <></>;
  }
};

DescriptionComponent.propTypes = {
  writerView: PropTypes.oneOf(Object.values(WRITER_MODES)).isRequired,
};

export default DescriptionComponent;
