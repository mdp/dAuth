var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  WebView,
  TouchableHighlight,
} = React;
var colours = require('../config/colours');
var Scan = require('./Scan');
var NewKey = require('./NewKey');

class KeyDetails extends React.Component {

  constructor(props){
    super(props)
  }

  injectedJs() {
    return `new QRCode(document.getElementById("qrcode"), "${this.props.keyData.publicKey}");`
  }

  render() {
    console.log('KeyDetails render')
    console.log(this.props.keyData)
    console.log(this.props.navigator)
    return (
      <View style={styles.container}>
        <View style={styles.wrapWebView}>
          <WebView
            automaticallyAdjustContentInsets={false}
            javaScriptEnabledAndroid={true}
            startInLoadingState={true}
            url='./web/qrcode.html'
            injectedJavaScript={this.injectedJs()}

            style={styles.webView}
          />
        </View>
        <Text>{this.props.keyData.publicKey}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  wrapWebView: {
    borderColor: colours.subdued,
    borderWidth: 2,
    height: 300,
  },
  webView: {
    width: 300,
  },
});

module.exports = KeyDetails
