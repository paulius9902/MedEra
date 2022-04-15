import React from 'react';
import { Result, Button } from 'antd';

class NotFound extends React.Component {
  render() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Atsiprašome, bet puslapis, kuriame apsilankėte, nerastas."
            extra={<Button type="primary" href='/'>Į pagrindinį</Button>}
        />
    );
  }
}

export default NotFound;