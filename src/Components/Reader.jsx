import React from 'react';
import PropTypes from 'prop-types';
import { Card, Text, Modal } from '@zeit-ui/react';
import Entry from '../common/Entry';

const Reader = ({ isOpen, onClose, entry }) => {
  return (
    <Modal width="70vw" open={isOpen} onClose={onClose}>
      <Modal.Title>6/29/2007</Modal.Title>
      <Modal.Content>
        <Card
          style={{
            maxHeight: '50vh',
            overflow: 'scroll',
            borderRadius: '10px',
          }}
        >
          <Text>{entry._id}</Text>
        </Card>
      </Modal.Content>
    </Modal>
  );
};

Reader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  entry: PropTypes.instanceOf(Entry).isRequired,
};

export default Reader;
