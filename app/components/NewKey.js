var React = require('react-native');
var KeyStore = require('../stores/KeyStore');
var NewKeyConfirm = require('./NewKeyConfirm');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  TouchableHighlight,
} = React;

const SeedCharSet = '023456789abcdefghjkmnpqrstuvwxyz'
const SeedLen = 32 // 5*32=160 bit of entropy

class NewKey extends React.Component {

  constructor (p, c) {
    super(p, c)
    this.state = this.setInitialState()
    this.createRandomSeed()
  }

  async createRandomSeed() {
    let seed = ''
    let randArr = await React.NativeModules.SecureRandom.getBytes(32)
    for (let i=0; i < SeedLen; i++) {
      seed = seed + SeedCharSet.substr(randArr[i]%32,1)
    }
    this.setState({seed:seed.toUpperCase()})
  }

  setInitialState() {
    return {
      seed: '',
      name: '',
    };
  }

  _handleImportKey() {
  }

  _handleAddKey() {
    let seed = this.state.seed
    KeyStore.create(seed, this.state.name)
    this.props.navigator.push({
      title: 'Confirm Key',
      component: NewKeyConfirm,
      popToTop: true,
      props: {
        seed: seed,
      },
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        />
        <TouchableHighlight onPress={() => this._handleAddKey()}>
          <Text>
            Create Key
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this._handleImportKey()}>
          <Text>
            Import From Backup
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default NewKey;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

module.exports = NewKey
