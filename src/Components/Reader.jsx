import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './reader.css';
import { Card, Divider, Loading } from '@zeit-ui/react';
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
      <Card.Content>Loading</Card.Content>
      <Divider y={0} />
      <Card.Content>
        <Loading type="secondary" size="large" />
      </Card.Content>
    </>
  );

  const entryRender =
    entry && entry.text ? (
      <>
        <Card.Content>{entry.description}</Card.Content>
        <Divider y={0} />
        <Card.Content
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
        </Card.Content>
      </>
    ) : (
      <>
        <Card.Content>Yikes</Card.Content>
        <Divider y={0} />
        <Card.Content>
          <p>We had some problems finding that...</p>
          <p>Entry ID: {entryId}</p>
        </Card.Content>
      </>
    );

  return (
    <Card width="100%">
      {isLoading && loadingRender}
      {isLoading || entryRender}
    </Card>
  );
};

Reader.propTypes = {
  namespace: PropTypes.string.isRequired,
};

export default Reader;
