let React = require('react-native');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableHighlight,
} = React;
let CopyButton = require('./CopyButton');
let KeyStore = require('../stores/KeyStore');
let utils = require('../lib/utils');
let Styles = require('../config/Styles');
let Colours = require('../config/Colours');

class Decode extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'Decrypting...'
    }
  }

  componentDidMount() {
    console.log('Props', this.props.challenge)
    InteractionManager.runAfterInteractions(() => {
      this.decodeChallenge(this.props.challenge)
    });
  }

  decodeChallenge(challenge) {
    let result;
    try {
      result = KeyStore.decryptChallenge(challenge)
    } catch(e) {
      console.log(e)
    }
    if (result) {
      this.setState({otp: utils.spaceStr(result.otp),
                    key: result.key,
                    challengerID: result.challengerID,
                    status: ''})
    } else {
      this.setState({status: 'Failed to decrypt'})
    }
  }
  _cancel() {
    this.props.navigator.popToTop()
  }
  render() {
    if (this.state.otp) {
      return (
        <View style={styles.container}>
          <Text style={styles.status}>
            One Time Password for:
          </Text>
          <Text style={styles.challengerID}>
            {this.state.challengerID}
          </Text>
          <Text style={styles.otp}>
            {this.state.otp}
          </Text>
          <View style={styles.copyButton}>
            <CopyButton strToCopy={this.state.otp}/>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.status}>
            {this.state.status}
          </Text>
        </View>
      );
    }
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
    fontSize: 20,
    marginBottom: 5,
  },
  challengerID: {
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 25,
  },
  otp: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 25,
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colours.primary,
  },
  copyButton: {
    marginVertical: 10,
  },
});

Decode.propTypes = {
  challenge: React.PropTypes.string,
}

Decode.TestChallenge = 'ACZLAQCE6ARO2IPUIDPFFW6PLX5NUI4OV75SYPR3UGSK4EVL3PMIS564JPX7U5CVIKY74VYTG5IFVSEWOE4IA6CZCSUYA2HV6RJJNWKTEV55LC2VIRNR2ZBR23XULHXSRI'
module.exports = Decode
