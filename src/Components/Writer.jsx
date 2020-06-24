import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Description,
  Grid,
  Card,
  Input,
  Radio,
  Text,
  Textarea,
  Spacer,
  Divider,
  Row,
} from '@zeit-ui/react';
import Memory, { TTL } from '../Memory';

export const WRITER_MODES = Object.freeze({
  text: 'text',
  metadata: 'metadata',
});

const Writer = ({ memory, updateMemory }) => {
  const [writerView, setWriterView] = React.useState(WRITER_MODES.text);

  const onAttributeChange = (key) => {
    return (event) => {
      updateMemory((prev) => {
        const copy = { ...prev };
        copy[key] = event.target.value;
        return copy;
      });
    };
  };
  const onTtlChange = (ttl) => {
    updateMemory((prev) => ({ ...prev, ttl }));
  };

  const onSubmit = () => {
    // TODO: assert text/location exist
    // TODO: assert date is parseable
    console.log(memory);
  };

  const description = {
    text: <Description title="Leave Something" />,
    metadata: <Description title="Extras" />,
  };

  const cardContent = {
    text: (
      <Textarea
        width="100%"
        minHeight="45vh"
        placeholder="What are you remembering?"
        value={memory.text}
        onChange={onAttributeChange('text')}
      />
    ),
    metadata: (
      <Grid.Container>
        <Grid xs={24}>
          <Input
            label="When it happened"
            size="mini"
            value={memory.date}
            onChange={onAttributeChange('date')}
            placeholder="May 27, 2007"
          />
        </Grid>
        <Spacer x={1} />
        <Grid xs={24}>
          <Input
            label="Left by"
            size="mini"
            value={memory.submitter}
            onChange={onAttributeChange('submitter')}
            placeholder="Anonymous"
          />
        </Grid>
        <Spacer x={1} />
        <Grid xs={24}>
          <Container>
            <Text span size="12px" type="secondary">
              Disappears
            </Text>
            <Spacer x={2} />
            <Radio.Group
              size="mini"
              value={memory.ttl}
              onChange={onTtlChange}
              useRow
            >
              <Radio value={TTL.WEEK}>in a week</Radio>
              <Radio value={TTL.MONTH}>in a month</Radio>
              <Radio value={TTL.NEVER}>never</Radio>
            </Radio.Group>
          </Container>
        </Grid>
      </Grid.Container>
    ),
  };

  const cardActions = {
    text: (
      <Row style={{ width: '100%' }} justify="end">
        <Button auto onClick={() => setWriterView(WRITER_MODES.metadata)}>
          Continue
        </Button>
      </Row>
    ),
    metadata: (
      <Row style={{ width: '100%' }} justify="space-between">
        <Button auto onClick={() => setWriterView(WRITER_MODES.text)}>
          Back
        </Button>
        <Button auto onClick={onSubmit}>
          Submit
        </Button>
      </Row>
    ),
  };

  return (
    <Card>
      <Card.Content>{description[writerView]}</Card.Content>
      <Divider y={0} />
      <Card.Content>{cardContent[writerView]}</Card.Content>
      <Card.Footer>{cardActions[writerView]}</Card.Footer>
    </Card>
  );
};

Writer.propTypes = {
  memory: PropTypes.objectOf(Memory).isRequired,
  updateMemory: PropTypes.func.isRequired,
};

export default Writer;
