import React from 'react';
import { Page, Row, Link } from '@zeit-ui/react';
import Github from '@zeit-ui/react-icons/github';

const Footer = () => {
  return (
    <Page.Footer>
      <Row align="bottom" justify="center">
        <Link href="https://github.com/binhrobles/ghosts-client">
          <Github />
        </Link>
      </Row>
    </Page.Footer>
  );
};

export default Footer;
