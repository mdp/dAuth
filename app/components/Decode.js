let React = require('react-native');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableHighlight,
} = React;
let Scan = require('./Scan');
let KeyStore = require('../stores/KeyStore');
let utils = require('../lib/utils');

class Decode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Decrypting...'
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.decodeChallenge(this.props.challenge)
    });
  }

  async decodeChallenge(challenge) {
    let result;
    try {
      result = await KeyStore.decryptChallenge(challenge)
    } catch(e) {
      console.log(e)
    }
    if (result) {
      this.setState({otp: utils.spaceStr(result.otp), key: result.key, status: ''})
    } else {
      this.setState({status: 'Failed to decrypt'})
    }
  }
  _cancel() {
    this.props.navigator.popToTop()
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.status}>
          {this.state.status}
        </Text>
        <Text style={styles.otp}>
          {this.state.otp}
        </Text>
      </View>
    );
  }
}

let styles = StyleSheet.create({
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
  status: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
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
