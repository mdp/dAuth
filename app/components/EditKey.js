let React = require('react-native');
let KeyStore = require('../stores/KeyStore');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
} = React;
let Button = require('./Button');
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
        <View style={styles.top}>
          <TextInput
          style={Styles.input}
          placeholder='Key Name'
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          />
        </View>
        <View style={styles.bottom}>
          <View style={styles.controls}>
            <View style={styles.row}>
              <Button text='Save'
                onPress={() => this._handleUpdateKey()}
              />
            </View>
            <View style={styles.row}>
              <Button text='Delete'
                onPress={() => Alert.alert(
                'Are you sure you want to delete this key?',
                null,
                [
                  {text: 'OK', onPress: async () => {
                      this.props.keyPair.destroy();
                      this.props.navigator.popToTop();
                    }
                  },
                  {text: 'Cancel', style:'cancel', onPress: () => logger.info('cancel') },
                ])}
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

module.exports = EditKey
