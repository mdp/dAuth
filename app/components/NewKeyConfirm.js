let React = require('react-native');
let KeyStore = require('../stores/KeyStore');
let Colours = require('../config/Colours');
let Styles = require('../config/Styles');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} = React;

class NewKeyConfirm extends React.Component {

  constructor (p, c) {
    super(p, c)
    this.state = this.setInitialState()
  }

  setInitialState() {
    let seed = this.props.seed.match(/.{1,4}/g).join(' ')
    return {
      seed: seed,
    };
  }

  _handleConfirm() {
    this.props.navigator.popToTop();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{marginBottom:10, fontSize:20}}>Backup Key</Text>
        <Text style={styles.seed}>
          {this.state.seed}
        </Text>
        <Text style={styles.warning}>Write this backup key down, it's the only way to recover a dOTP key if you lose access to your phone or accidentally delete the keypair!</Text>
        <TouchableHighlight onPress={() => this._handleConfirm()}>
          <Text style={Styles.btn}>
            Ok, I got it!
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: Colours.background,
  },
  warning: {
    marginVertical: 30,
    color: '#CC3333',
    fontWeight: 'bold',
  },
  seed: {
    fontSize: 20,
    fontFamily: 'Menlo-Regular',
    fontWeight: '300',
  },
});

module.exports = NewKeyConfirm
