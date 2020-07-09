import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { useToasts } from '@zeit-ui/react';
import './editor.css';
import Entry from '../../common/Entry';
import config from '../../config';

const Editor = ({ entry, updateEntry }) => {
  const [, setToast] = useToasts();

  const onTextChange = (text) => {
    if (text.length < config.maxFieldLength.text) {
      updateEntry((prev) => ({ ...prev, text }));
    } else {
      setToast({
        text: "You've written too much for this space.",
      });
    }
  };

  return (
    <ReactQuill
      theme="bubble"
      preserveWhitespace
      placeholder="Leave something"
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
