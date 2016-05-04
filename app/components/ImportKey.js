let React = require('react-native');
let dotpCrypt = require('dotp-crypt');
let Buffer = require('buffer').Buffer;
let {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  ListView,
  TouchableHighlight,
} = React;
let Scan = require('./Scan');
let Styles = require('../config/Styles');
let Colours = require('../config/Colours');
let Decode = require('./Decode');
let Button = require('./Button');
let KeyDetails = require('./KeyDetails');
let KeyStore = require('../stores/KeyStore');

const SeedCharSet = '023456789abcdefghjkmnpqrstuvwxyz'
const SeedLen = 32 // 5*32=160 bit of entropy

class ImportKey extends React.Component {

  constructor (p, c) {
    super(p, c)
    this.state = this.setInitialState()
  }

  _createRandomSeed() {
    let seed = ''
    let randArr = new Uint8Array(SeedLen)
    window.crypto.getRandomValues(randArr)
    for (let i=0; i < SeedLen; i++) {
      if (i > 0 && i % 4 === 0) seed = seed + ' '
      seed = seed + SeedCharSet.substr(randArr[i]%32,1)
    }
    return seed.toUpperCase()
  }

  setInitialState() {
    return {
      seed: '',
      name: '',
      keys: [],
    };
  }

  _updateSeed(value) {
    console.log('UpdateSeed', value)
    if (value) {
      // Nasty android issue where with the autocomplete
      let lastChar = value.slice(-1).toUpperCase()
      let newVal = this.state.seed + lastChar;
      this.setState({seed: newVal.replace(/\s/g, '').match(/.{1,4}/g).join(' ').trim()})
    } else {
      this.setState({seed: ''})
    }
  }

  _handleAddKey() {
    let seed = this.state.seed.replace(/[^a-zA-Z0-9]/,'')
    KeyStore.create(seed, this.state.name)
    this.props.navigator.popToTop()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <TextInput
          style={Styles.input}
          placeholder='Key Name'
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          />
          <TextInput
          style={Styles.input}
          placeholder='Backup Seed'
          onChangeText={(val)=>this._updateSeed(val)}
          value={this.state.seed}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.controls}>
            <View style={styles.row}>
              <Button text='Create Key'
                onPress={() => this._handleAddKey()}
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

module.exports = ImportKey
