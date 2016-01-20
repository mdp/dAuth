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
  AlertIOS,
} = React;
var Colours = require('../config/Colours');
var Styles = require('../config/Styles');
var QRCode = require('react-native-qrcode');
var Scan = require('./Scan');
var NewKey = require('./NewKey');
var QRCodeJS = require('../lib/qrcode-inject.js');

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
    return (`${QRCodeJS}
    new QRCode(document.getElementById("qrcode"), "${this.props.keyData.get('publicID')}");`)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.qrWrapper}>
          <WebView
            style={styles.qrWebView}
            injectedJavaScript={this.injectedJs()}
            javaScriptEnabledAndroid={true}
            html='<body><div id="qrcode"></div></body>'
          />
        </View>
        <Text>{this.props.keyData.get('publicID')}</Text>
        <TouchableHighlight
          onPress={() => AlertIOS.alert(
            'Are you sure you want to delete this key?',
            null,
            [
              {text: 'OK', onPress: async () => {
                  await this.props.keyData.destroy();
                  this.props.navigator.pop();
                }
              },
              {text: 'Cancel', onPress: () => console.log('cancel') },
            ],
            'default'
          )}>
          <Text
            style={Styles.btn} >Delete</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colours.background,
  },
  qrWebView:{
    height: 275,
    width: 275,
  },
  qrWrapper: {
    margin: 20,
    padding: 8,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    borderColor: Colours.lightA,
  },
});

module.exports = KeyDetails
