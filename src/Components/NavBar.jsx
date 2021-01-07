import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Page, Row, Tabs, Text } from '@zeit-ui/react';
import { APP_MODES } from '../common/constants';

const NavBar = (props) => {
  const { namespace } = props;
  const history = useHistory();

  const onChangeHandler = (path) => {
    console.log(`pushing ${path}`);
    history.push(path);
  };

  const label = namespace === 'public' ? 'Ghosts' : namespace;
  const listenPath = `${APP_MODES.listen.pathname}/${namespace}`;
  const speakPath = `${APP_MODES.speak.pathname}/${namespace}`;

  console.log(listenPath);
  console.log(speakPath);

  const tabs = (
    <Tabs onChange={onChangeHandler} hideDivider>
      <Tabs.Item label={APP_MODES.listen.name} value={listenPath} />
      <Tabs.Item label={APP_MODES.speak.name} value={speakPath} />
      <Tabs.Item
        label={APP_MODES.about.name}
        value={APP_MODES.about.pathname}
      />
    </Tabs>
  );

  return (
    <Page.Header>
      <Row justify="space-between">
        {tabs}
        <Text h4>{label}</Text>
      </Row>
    </Page.Header>
  );
};

NavBar.propTypes = {
  namespace: PropTypes.string.isRequired,
};

export default NavBar;
