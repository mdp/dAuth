var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableHighlight,
} = React;
var Scan = require('./Scan');
var KeyStore = require('../stores/KeyStore');

class Decode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      otp: 'Decrypting...'
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.decodeChallenge(this.props.challenge)
    });
  }

  async decodeChallenge(challenge) {
    var now = Date.now()
    let keys = await KeyStore.getAll()
    for (let key of keys) {
      now = Date.now()
      let otp = key.decrypt(challenge)
      if (otp) {
        this.setState({otp: otp})
        return true
      }
    }
    this.setState({otp: 'Failed to decrypt'})
  }
  _cancel() {
    this.props.navigator.popToTop()
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.otp}>
          {this.state.otp}
        </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scan: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  otp: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

module.exports = Decode
