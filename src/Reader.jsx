import React from 'react';
import PropTypes from 'prop-types';
import { Text, Modal } from '@zeit-ui/react';

const Reader = ({ isOpen, onClose, memory }) => {
  return (
    <Modal width="60vw" open={isOpen} onClose={onClose}>
      <Modal.Title>6/29/2007</Modal.Title>
      <Modal.Content style={{ maxHeight: '50vh', overflow: 'scroll' }}>
        <Text>{memory.text}</Text>
      </Modal.Content>
    </Modal>
  );
};

Reader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  memory: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
};

export default Reader;
