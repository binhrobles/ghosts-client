import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './editor.css';
import Memory from '../../Memory';

const Editor = ({ memory, updateMemory }) => {
  const onTextChange = (text) => {
    updateMemory((prev) => ({ ...prev, text }));
  };

  return (
    <ReactQuill
      theme="bubble"
      preserveWhitespace
      placeholder="What were you remembering?"
      value={memory.text}
      onChange={onTextChange}
    />
  );
};

Editor.propTypes = {
  memory: PropTypes.objectOf(Memory).isRequired,
  updateMemory: PropTypes.func.isRequired,
};

export default Editor;
