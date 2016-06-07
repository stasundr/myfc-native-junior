import React, { Component } from 'react';
import Preview from './preview_component';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './root_reducer';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Preview />
      </Provider>
    );
  }
}
