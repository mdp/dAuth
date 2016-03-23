let React = require('react-native');
let KeyStore = require('../stores/KeyStore');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  AlertIOS,
} = React;
let Styles = require('../config/Styles');
let logger = require('../lib/logger')

class EditKey extends React.Component {

  constructor(props){
    super(props)
    this.state = this.setInitialState()
  }

  setInitialState() {
    return {
      name: this.props.keyPair.name,
    };
  }

  _handleUpdateKey() {
    this.props.keyPair.update({name: this.state.name})
    this.props.navigator.pop()
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
          textAlign: 'center',
          }}
        placeholder='Key Name'
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        />
        <TouchableHighlight onPress={() => this._handleUpdateKey()}>
          <Text style={Styles.btn}>
            Save
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => AlertIOS.alert(
            'Are you sure you want to delete this key?',
            null,
            [
              {text: 'OK', onPress: async () => {
                  this.props.keyPair.destroy();
                  this.props.navigator.popToTop();
                }
              },
              {text: 'Cancel', onPress: () => logger.info('cancel') },
            ]
          )}>
          <Text
            style={Styles.deleteBtn}>Delete</Text>
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

module.exports = EditKey
