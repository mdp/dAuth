var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;
var Scan = require('./Scan');
var KeyStore = require('../stores/KeyStore');

class Decode extends React.Component {
  constructor(props) {
    super(props)
    console.log('Decode')
    this.state = {
      otp: null
    }
    this.decodeChallenge(this.props.challenge)
  }
  async decodeChallenge(challenge) {
    console.log('Keys', keys)
    let keys = await KeyStore.getAll()
    console.log('Keys', keys)
    for (let key of keys) {
      console.log('Trying key', key.hash(), challenge)
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
