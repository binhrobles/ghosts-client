import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './editor.css';
import Entry from '../../common/Entry';

const Editor = ({ entry, updateEntry }) => {
  const onTextChange = (text) => {
    updateEntry((prev) => ({ ...prev, text }));
  };

  return (
    <ReactQuill
      theme="bubble"
      preserveWhitespace
      placeholder="What were you remembering?"
      value={entry.text}
      onChange={onTextChange}
    />
  );
};

Editor.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  updateEntry: PropTypes.func.isRequired,
};

export default Editor;
