'use strict';

import React, { Component } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import { connect } from 'react-redux';
import request from 'superagent';

class Preview extends Component {
  render() {
    const {
      isProcessingRequest,
      imageUrl,
      formUrl,
      label,
      onChangeText,
      fetchUrl
     } = this.props;

    return (
      <View>
        <Text>{'\n\n'}</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={onChangeText}
          value={formUrl}
        />
        <TouchableHighlight onPress={() => fetchUrl(formUrl)}>
          <View>
            <Text style={{textAlign: 'center', color: 'green'}}>
              Fethch url {(isProcessingRequest) ? '(loading)' : ''}
            </Text>
          </View>
        </TouchableHighlight>
        <Text>{label}</Text>
        <Image
          source={{uri: imageUrl}}
          style={{width: 375, height: 200}}
        />
      </View>
    )
  }
}

function processRequest(url) {
  return (dispatch) => {
    const youtube = url.match(/youtube\.com/);
    const  sports = url.match(/sports\.ru/);

    if (youtube) {
      const youtubeIdMatch = url.match(/v=([^&]+)/);
      const youtubeId = (youtubeIdMatch) ? youtubeIdMatch[1] : '';
      const youtubeUrl = 'https://www.googleapis.com/youtube/v3/videos'
        + '?id=' + youtubeId
        + '&key=AIzaSyAhzNW9PKA12-pvU_2Aq8nIrjQeex7RixI'
        + '&fields=items(id,snippet(title,thumbnails))'
        + '&part=snippet';

      dispatch({type: 'IS_PROCESSING_REQUEST', value: true});

      return request
        .get(youtubeUrl)
        .end((error, response) => {
          dispatch({type: 'IS_PROCESSING_REQUEST', value: false});
          dispatch({type: 'MODIFY_PREVIEW', previewSource: 'youtube', sourceResponse: response});
        })
    }

    if (sports) {
      dispatch({type: 'IS_PROCESSING_REQUEST', value: true});

      return request
        .get(url)
        .end((error, response) => {
          dispatch({type: 'IS_PROCESSING_REQUEST', value: false});
          dispatch({type: 'MODIFY_PREVIEW', previewSource: 'sports', sourceResponse: response});
        })
    }
  }
}

function mapStateToProps(state) {
  return {
    isProcessingRequest: state.isProcessingRequest,
    imageUrl: state.previewImageUrl,
    formUrl: state.previewFormUrl,
    label: state.previewLabel
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onChangeText: (text) => dispatch({type: 'ON_CHANGE_TEXT', text}),
    fetchUrl: (url) => dispatch(processRequest(url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
