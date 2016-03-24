var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;
var Decode = require('./Decode');
var QRCode = React.NativeModules.QRCode;
var DeviceEventEmitter = React.DeviceEventEmitter;


var Scan = React.createClass({

  getInitialState() {
    return {
      scan: null
    }
  },

  componentWillMount() {
    DeviceEventEmitter.addListener('qrScan', (result) =>{
      this.props.navigator.push({
        title: 'Decoded Challenge',
        component: Decode,
        popToTop: true,
        props: {
          challenge: result
        }
      })
    })
    DeviceEventEmitter.addListener('qrScanCancel', (result) =>{
      this.props.navigator.pop()
    })
  },

  componentDidMount() {
    QRCode.scan()
  },

  render() {
    return (
      <Text>
        Scan
      </Text>
    );
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
