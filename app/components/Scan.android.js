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


var Scan = React.createClass({

  getInitialState() {
    return {
      scan: null
    }
  },

  componentDidMount() {
    QRCode.scan().then((result) =>{
      console.log('QRRESULT', result)
      this.props.navigator.push({
        title: 'Decoded Challenge',
        component: Decode,
        popToTop: true,
        props: {
          challenge: result
        }
      })
    }).catch((err) =>{
      this.props.navigator.pop()
    })
  },

  render() {
    return (
      <Text>
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
