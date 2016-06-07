'use strict';

import _ from 'lodash';
import cheerio from 'cheerio-without-node-native';

const initialState = {
  isProcessingRequest: false,
  previewFormUrl: 'https://www.youtube.com/watch?v=dszqObMPwmo',
  previewImageUrl: '',
  previewLabel: ''
};

export default (state = initialState, action) => {
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
