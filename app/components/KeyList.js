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
    console.log(await KeyStore.getAll())
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

  _scan() {
    this.props.navigator.push({
      title: 'Scan a Challenge',
      component: Scan
    });
  }
  render() {
    console.log('KeyList render')
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
        <View style={styles.buttonRow}>
          <TouchableHighlight onPress={() => this._scan()}>
            <Text style={styles.text}>Scan</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this._newKey()}>
            <Text style={styles.text}>New Key</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  _pressRow(key){
    //Open KeyDetails
    console.log(key)
    this.props.navigator.push({
      title: 'KeyDetails',
      component: KeyDetails,
      props: {keyData: key},
    });
  }
  _renderRow(rowData: object) {
    console.log(rowData)
    return (
        <TouchableHighlight onPress={() => this._pressRow(rowData)}>
          <View style={styles.row}>
            <View style={styles.buttonRow}>
              <View style={styles.button}>
                <Text style={styles.text}>
                  {rowData.pretty()}
                </Text>
              </View>
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
  buttonRow: {
    flexDirection: 'row',
    flex: 0.2,
    backgroundColor: '#F6F6F6',
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
  text: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
  },
  scan: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = KeyList
