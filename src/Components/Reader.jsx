import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  Divider,
  Row,
  Loading,
  useMediaQuery,
} from '@zeit-ui/react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.bubble.css';
import './reader.css';

import { APP_MODES } from '../common/constants';

const Reader = ({ entry, isLoading }) => {
  const { entryId } = useParams();
  const history = useHistory();
  const isXS = useMediaQuery('xs');

  // remove entryId route when closing readview
  const onClose = () => {
    history.push(`/${APP_MODES.LISTEN}`);
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
        <ReactQuill
          theme="bubble"
          preserveWhitespace
          value={entry.text}
          readOnly
        />
      </>
    ) : (
      <>
        <Card.Content>Yikes</Card.Content>
        <Divider y={0} />
        <Card.Content>
          <p>We had some problems finding that...</p>
          <p>Entry: {entryId}</p>
        </Card.Content>
      </>
    );

  return (
    <Card
      style={{
        height: '70vh',
      }}
    >
      {isLoading && loadingRender}
      {isLoading || entryRender}
      <Card.Footer>
        <Row style={{ width: '100%' }} justify="center">
          <Button onClick={onClose}>{isXS ? 'Back to Map' : 'Close'}</Button>
        </Row>
      </Card.Footer>
    </Card>
  );
};

Reader.propTypes = {
  entry: PropTypes.shape({
    text: PropTypes.string,
    description: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
};

Reader.defaultProps = {
  entry: null,
};

export default Reader;
