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

const DEBUG = true;

const Scan = React.createClass({

  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back
    }
  },

  componentDidMount() {
    if (DEBUG) {
      setTimeout(() => {
        this._onBarCodeRead('qUYWDzd7w1kc0CJLzDjsEg8sFqt3BczbPd_zcsiefiQ=:AIuasXuiojlDJP6mjDkr93xkUp6oDrVn:oY7lrUOcMdCydb5ZvlJcbIAnVhiTiMmp')
      }, 1000)
    }
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
    console.log(e);
    this.props.navigator.push({
      title: 'Decoded Challenge',
      component: Decode,
      popToTop: true,
      props: {
        challenge: e
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
