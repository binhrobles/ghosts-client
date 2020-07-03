import React from 'react';
import PropTypes from 'prop-types';
import { Input, Spacer } from '@zeit-ui/react';
import Entry from '../../common/Entry';
import config from '../../config';

const Metadata = ({ entry, updateEntry }) => {
  const onAttributeChange = (key) => {
    return (event) => {
      if (event.target.value.length < config.maxFieldLength[key]) {
        updateEntry((prev) => {
          const copy = { ...prev };
          copy[key] = event.target.value;
          return copy;
        });
      }
    };
  };

  return (
    <>
      <Input
        label="Titled"
        size="small"
        value={entry.description}
        onChange={onAttributeChange('description')}
        placeholder="Title"
      />
      <Spacer y={0.5} />
      <Input
        label="When?"
        size="small"
        value={entry.date}
        onChange={onAttributeChange('date')}
        placeholder="May 27, 2007"
      />
      <Spacer y={0.5} />
      <Input
        label="Left by"
        size="small"
        value={entry.submitter}
        onChange={onAttributeChange('submitter')}
        placeholder="anon"
      />
    </>
  );
};

Metadata.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

export default Metadata;
