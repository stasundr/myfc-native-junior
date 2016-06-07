import React, { Component } from 'react';
import Preview from './preview_component';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import cheerio from 'cheerio-without-node-native';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
//const reducer = combineReducers(reducers);
const initialState = {
  isProcessingRequest: false,
  previewFormUrl: 'http://',
  previewImageUrl: '',
  previewLabel: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ON_CHANGE_TEXT':
      return {
        ...state,
        previewFormUrl: action.text
      }

    case 'IS_PROCESSING_REQUEST':
      return {
        ...state,
        isProcessingRequest: action.value
      }

    case 'MODIFY_PREVIEW':
      let previewImageUrl = state.previewImageUrl;

      switch (action.previewSource) {
        case 'youtube':
          return {
            ...state,
            previewLabel: _.get(action.sourceResponse, 'body.items[0].snippet.title'),
            previewImageUrl: _.get(action.sourceResponse, 'body.items[0].snippet.thumbnails.high.url')
          }

        case 'sports':
          const $ = cheerio.load(_.get(action.sourceResponse, 'text'));
          return {
            ...state,
            previewLabel: $("head title").text(),
            previewImageUrl: $(".article-textBlock img").attr('src')
          }

        default:
          return state
      }

    default:
      return state
  }
};

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
