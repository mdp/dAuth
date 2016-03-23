React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;
var Camera = require('react-native-camera');
var Decode = require('./Decode');
var logger = require('../lib/logger')

const Scan = React.createClass({

  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back
    }
  },

  componentDidMount() {
  },

  render() {
    return (
      <Camera
        ref="cam"
        style={styles.container}
        onBarCodeRead={this._onBarCodeRead}
        type={this.state.cameraType}
      >
        <Text>
          Scan a challenge
        </Text>
      </Camera>
    );
  },

  _onBarCodeRead(e) {
    if (this.debounceRead) {
      return false
    }
    this.debounceRead = true;
    logger.debug('Barcode:', e);
    this.props.navigator.push({
      title: 'Decoded Challenge',
      component: Decode,
      popToTop: true,
      props: {
        challenge: e.data
      }
    });
  },
});


let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

module.exports = Scan
