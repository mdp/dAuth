var React = require('react-native');
var KeyStore = require('../stores/KeyStore');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  TouchableHighlight,
} = React;

const PASSWORD_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

class NewKey extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      seed: this.setRandomSeed()
    }
  }

  setRandomSeed() {
    //TODO: Crypto secure rand source needed
    let seed = ''
    for (let i=0; i<40; i++) {
      seed = seed + PASSWORD_CHARS[Math.floor(Math.random() * 1000) % PASSWORD_CHARS.length]
      if (i !== 0 && i % 5 === 0) {
        seed = seed + ' '
      }
    }
    return seed
  }

  _onCreateButton() {
    KeyStore.create(this.state.seed)
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(seed) => this.setState({seed})}
        value={this.state.seed}
        />
        <TouchableHighlight onPress={() => this._onCreateButton()}>
          <Text>
            Create Key
          </Text>
        </TouchableHighlight>
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
});

module.exports = NewKey
