var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;
var Scan = require('./Scan');
var NewKey = require('./NewKey');
var KeyDetails = require('./KeyDetails');
var KeyStore = require('../stores/KeyStore');


class KeyList extends React.Component {

  constructor(){
    super()
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([])}
    this.setInitialState()
  }

  async setInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.hash() !== r2.hash()});
    this.setState({dataSource: ds.cloneWithRows(await KeyStore.getAll())})
  }

  componentWillReceiveProps() {
    this.setInitialState()
  }

  _newKey() {
    this.props.navigator.push({
      title: 'Create a new key',
      component: NewKey
    });
  }

  async _deleteKeys() {
    await KeyStore.deleteAll()
    this.setInitialState()
  }

  _scan() {
    this.props.navigator.push({
      title: 'Scan a Challenge',
      component: Scan
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
        <View style={styles.buttonRow}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this._scan()}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this._newKey()} >
            <Text style={styles.buttonText}>New Key</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this._deleteKeys()} >
            <Text style={styles.buttonText}>Delete Keys</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  _pressRow(key){
    //Open KeyDetails
    this.props.navigator.push({
      title: 'KeyDetails',
      component: KeyDetails,
      props: {keyData: key},
    });
  }
  _renderRow(rowData: object) {
    return (
        <TouchableHighlight onPress={() => this._pressRow(rowData)}>
          <View style={styles.row}>
            <View style={styles.keyRow}>
                <Text style={styles.text}>
                  {rowData.pretty()}
                </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  listview: {
    flexDirection: 'column',
    flex: 0.8,
  },
  button: {
    alignItems: 'center',
    flex: 1
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  separator: {
    height:2,
    backgroundColor: '#333333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor: '#F6F6F6',
  },
  buttonRow: {
    flexDirection: 'row',
    flex: 0.2,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
  },
});

module.exports = KeyList
