var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  WebView,
  InteractionManager,
  TouchableHighlight,
} = React;
var colours = require('../config/colours');
var Scan = require('./Scan');
var NewKey = require('./NewKey');

class KeyDetails extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({animationComplete: true})
    });
  }

  injectedJs() {
    return `new QRCode(document.getElementById("qrcode"), "${this.props.keyData.publicKey}");`
  }

  render() {
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
        <Text>{this.props.keyData.hash}</Text>
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
