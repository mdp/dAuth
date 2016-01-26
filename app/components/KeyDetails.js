let React = require('react-native');
let {
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
let Colours = require('../config/Colours');
let Styles = require('../config/Styles');
let QRCode = require('react-native-qrcode');
let Scan = require('./Scan');
let NewKey = require('./NewKey');
let EditKey = require('./EditKey');
let QRCodeJS = require('../lib/qrcode-inject.js');
let utils = require('../lib/utils');

class KeyDetails extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      animationComplete: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({animationComplete: true})
    });
  }

  injectedJs() {
    return (`${QRCodeJS}
    new QRCode(document.getElementById("qrcode"), "${this.props.keyPair.get('publicID')}");`)
  }

  renderQRCode() {
    if(this.state.animationComplete) {
      return(
        <WebView
        style={styles.qrWebView}
        injectedJavaScript={this.injectedJs()}
        javaScriptEnabledAndroid={true}
        html='<body><div id="qrcode"></div></body>'
        />
      )
    }
    return null
  }

  render() {
    let d = new Date(this.props.keyPair.get('createdAt'))
    let createdAt = `${d.getFullYear()}.${utils.zeroPad(d.getMonth()+1,2)}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
    // 2016.01.26 15:45
    return (
      <View style={styles.container}>
        <Text style={styles.keyName}>{this.props.keyPair.get('name')}</Text>
        <View style={styles.qrWrapper}>
          {this.renderQRCode()}
        </View>
        <View style={styles.details}>
          <Text style={styles.heading}>Public ID</Text>
          <Text style={styles.publicID}>{utils.spaceStr(this.props.keyPair.getPublicID())} </Text>
          <Text style={styles.heading}>Created At: <Text style={styles.publicID}>{ createdAt } </Text></Text>
        </View>
      </View>
    );
  }
}

KeyDetails.rightButton = {
  text: 'Edit',
  onPress: function(route, navigator){
    navigator.push({
      title: 'Edit key',
      component: EditKey,
      navigateBack: true,
      props: {keyPair: route.props.keyPair},
    });
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colours.background,
    padding: 10
  },
  details: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  heading: {
    fontWeight: '600',
  },
  publicID: {
    fontFamily: 'Menlo-Regular',
    paddingTop: 5,
    paddingBottom: 10,
    fontWeight: '300',
  },
  keyName: {
    fontSize: 20,
  },
  qrWebView:{
    height: 275,
    width: 275,
  },
  qrWrapper: {
    height: 294,
    width: 294,
    margin: 20,
    padding: 8,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    borderColor: Colours.primary,
  },
});

module.exports = KeyDetails
