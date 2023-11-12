import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import App from './App';
import './index.css';
/* @refresh reload */


const root = document.getElementById("root");

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root!
);
