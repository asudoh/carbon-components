import React from 'react';
import { render } from 'react-dom';
import Button from 'carbon-components-react/es/components/Button/Button';
import './index.scss';

const App = () => (
  <div>
    <Button>Hello world</Button>
  </div>
);

render(<App />, document.getElementById('root'));
