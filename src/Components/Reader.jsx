import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './reader.css';
import { Button, Card, Divider, Row, Loading } from '@zeit-ui/react';
import { APP_MODES } from '../common/constants';

const Reader = ({ entry, isLoading }) => {
  const { entryId } = useParams();
  const history = useHistory();

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
        <div
          style={{
            paddingTop: '5%',
            maxHeight: '50vh',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <ReactQuill
            theme="bubble"
            preserveWhitespace
            value={entry.text}
            readOnly
          />
        </div>
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
    <Card>
      {isLoading && loadingRender}
      {isLoading || entryRender}
      <Card.Footer>
        <Row style={{ width: '100%' }} justify="center">
          <Button onClick={onClose}>Close</Button>
        </Row>
      </Card.Footer>
    </Card>
  );
};

Reader.propTypes = {
  entry: PropTypes.shape({
    text: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Reader;
