let React = require('react-native');
let KeyStore = require('../stores/KeyStore');
let NewKeyConfirm = require('./NewKeyConfirm');
let ImportKey = require('./ImportKey');
let Styles = require('../config/Styles');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  TouchableHighlight,
} = React;

const SeedCharSet = '023456789abcdefghjkmnpqrstuvwxyz'
const SeedLen = 32 // 5*32=160 bits of entropy

class NewKey extends React.Component {

  constructor (p, c) {
    super(p, c)
    this.state = this.setInitialState()
    this.createRandomSeed()
  }

  async createRandomSeed() {
    let seed = ''
    let randArr = await React.NativeModules.SecureRandom.getBytes(32)
    console.log('dAuth: RandArr:', randArr)
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
    console.log(ImportKey)
    this.props.navigator.push({
      title: 'Import Key',
      component: ImportKey,
      navigateBack: true,
      props: {},
    });
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
        style={{height: 40,
          borderColor: 'gray',
          fontSize: 30,
          borderWidth: 1,
          marginVertical: 10,
          }}
        placeholder='Key Name'
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        />
        <TouchableHighlight onPress={() => this._handleAddKey()}>
          <Text style={Styles.btn}>
            Create Key
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this._handleImportKey()}>
          <Text style={Styles.btn}>
            Import From Backup
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}


let styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

module.exports = NewKey
