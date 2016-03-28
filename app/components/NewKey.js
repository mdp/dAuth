let React = require('react-native');
let KeyStore = require('../stores/KeyStore');
let NewKeyConfirm = require('./NewKeyConfirm');
let ImportKey = require('./ImportKey');
let Button = require('./Button');
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

let logger = require('../lib/logger')

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
    logger.debug('dAuth: RandArr:', randArr)
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
        <View style={styles.top}>
          <TextInput
          style={{height: 40,
            borderColor: 'gray',
            fontSize: 30,
            paddingLeft: 10,
            borderWidth: 1,
            marginVertical: 10,
            }}
          placeholder='Key Name'
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.controls}>
            <View style={styles.row}>
              <Button text='Create Key'
                onPress={() => this._handleAddKey()}
              />
            </View>
            <View style={styles.row}>
              <Button text='Import From Backup'
                onPress={() => this._handleImportKey()}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}


let styles = StyleSheet.create({
  top: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  bottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 40
  },
  controls: {
    marginLeft: 20,
    marginRight: 20,
  },
  row: {
    flexDirection: 'row',
    flex:1,
    marginTop:10,
  },
});

module.exports = NewKey
