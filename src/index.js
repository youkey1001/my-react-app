import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RootContainer } from './containers';
import { configureStore } from './modules';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './templates/theme';
import './style.css';

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={configureStore()}>
      <RootContainer />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
