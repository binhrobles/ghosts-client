import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './reader.css';
import { Modal, Loading } from '@zeit-ui/react';
import { GetEntryById, EntriesClientContext } from '../Http/entries';
import { APP_MODES } from '../common/constants';

const Reader = ({ namespace }) => {
  const { entryId } = useParams();
  const [entry, setEntry] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const entriesClient = React.useContext(EntriesClientContext);
  const history = useHistory();

  // Downloads new entry on prop change
  React.useEffect(() => {
    if (!entryId) return () => {};

    let isMounted = true;
    setLoading(true);
    setOpen(true);

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
  }, [entryId, namespace, entriesClient]);

  // remove entryId route when closing readview
  const onClose = () => {
    history.push(APP_MODES.listen.pathname);
  };

  const loadingRender = (
    <>
      <Modal.Title>Loading</Modal.Title>
      <Modal.Content>
        <Loading type="secondary" size="large" />
      </Modal.Content>
    </>
  );

  const entryRender =
    entry && entry.text ? (
      <>
        <Modal.Title>{entry.description}</Modal.Title>
        <Modal.Content
          style={{
            maxHeight: '50vh',
            overflow: 'scroll',
            borderRadius: '10px',
          }}
        >
          <ReactQuill
            theme="bubble"
            preserveWhitespace
            value={entry.text}
            readOnly
          />
        </Modal.Content>
      </>
    ) : (
      <>
        <Modal.Title>Yikes</Modal.Title>
        <Modal.Content>
          <p>We had some problems finding that...</p>
          <p>Entry ID: {entryId}</p>
        </Modal.Content>
      </>
    );

  return (
    <Modal open={isOpen} onClose={onClose}>
      {isLoading && loadingRender}
      {isLoading || entryRender}
    </Modal>
  );
};

Reader.propTypes = {
  namespace: PropTypes.string.isRequired,
};

export default Reader;
