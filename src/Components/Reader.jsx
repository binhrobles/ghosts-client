import React from 'react';
import PropTypes from 'prop-types';
import { Card, Text, Modal } from '@zeit-ui/react';
import { GetEntryById, EntriesClientContext } from '../Http/entries';

const Reader = ({ isOpen, onClose, namespace, entryId }) => {
  const [entry, setEntry] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const entriesClient = React.useContext(EntriesClientContext);

  // Downloads new entry on prop change
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const downloaded = await GetEntryById({
        client: entriesClient,
        namespace,
        id: entryId,
      });

      if (isMounted) {
        setLoading(false);
        setEntry(downloaded);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [entryId]);

  return (
    <Modal width="70vw" open={isOpen} onClose={onClose}>
      <Modal.Title>entry._source.description</Modal.Title>
      <Modal.Content>
        <Card
          style={{
            maxHeight: '50vh',
            overflow: 'scroll',
            borderRadius: '10px',
          }}
        >
          <Text>{entry._source.text}</Text>
        </Card>
      </Modal.Content>
    </Modal>
  );
};

Reader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  entryId: PropTypes.string.isRequired,
};

export default Reader;
