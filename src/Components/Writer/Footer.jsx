import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row } from '@zeit-ui/react';
import { WRITER_MODES } from './constants';

const FooterComponent = ({ writerView, setWriterView, onSubmit }) => {
  switch (writerView) {
    case WRITER_MODES.text:
      return (
        <Row style={{ width: '100%' }} justify="end">
          <Button auto onClick={() => setWriterView(WRITER_MODES.metadata)}>
            Continue
          </Button>
        </Row>
      );
    case WRITER_MODES.metadata:
      return (
        <Row style={{ width: '100%' }} justify="space-between">
          <Button auto onClick={() => setWriterView(WRITER_MODES.text)}>
            Back
          </Button>
          <Button auto onClick={onSubmit}>
            Submit
          </Button>
        </Row>
      );
    default:
      return <></>;
  }
};

FooterComponent.propTypes = {
  writerView: PropTypes.oneOf(Object.values(WRITER_MODES)).isRequired,
  setWriterView: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FooterComponent;
