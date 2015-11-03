var React = require('react-native');
var KeyStore = require('../stores/KeyStore');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;

class EditKey extends React.Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Edit a key</Text>
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

module.exports = EditKey
