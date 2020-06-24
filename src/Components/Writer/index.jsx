import React from 'react';
import PropTypes from 'prop-types';
import { Card, Divider } from '@zeit-ui/react';
import ContentComponent from './Content';
import DescriptionComponent from './Description';
import FooterComponent from './Footer';
import Memory from '../../Memory';
import { WRITER_MODES } from './constants';

const Writer = ({ memory, updateMemory }) => {
  const [writerView, setWriterView] = React.useState(WRITER_MODES.text);

  const onSubmit = () => {
    // TODO: assert text/location exist
    // TODO: assert date is parseable
    console.log(memory);
  };

  return (
    <Card>
      <Card.Content>
        <DescriptionComponent writerView={writerView} />
      </Card.Content>
      <Divider y={0} />
      <Card.Content>
        <ContentComponent
          memory={memory}
          updateMemory={updateMemory}
          writerView={writerView}
        />
      </Card.Content>
      <Card.Footer>
        <FooterComponent
          writerView={writerView}
          setWriterView={setWriterView}
          onSubmit={onSubmit}
        />
      </Card.Footer>
    </Card>
  );
};

Writer.propTypes = {
  memory: PropTypes.objectOf(Memory).isRequired,
  updateMemory: PropTypes.func.isRequired,
};

export default Writer;
