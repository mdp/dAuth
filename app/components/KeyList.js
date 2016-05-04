let dotpCrypt = require('dotp-crypt');
let React = require('react-native');
let {
  AppRegistry,
  StyleSheet,
  Text,
  Linking,
  Platform,
  View,
  ListView,
  TouchableHighlight,
} = React;
let Scan = require('./Scan');
let Styles = require('../config/Styles');;
let Colours = require('../config/Colours');
let NewKey = require('./NewKey');
let Decode = require('./Decode');
let KeyDetails = require('./KeyDetails');
let KeyStore = require('../stores/KeyStore');
let logger = require('../lib/logger')

// Takes a public key and returns a dark colour code
function keyToColour(keyArr) {
  let colours = []
  for (let i=0; i < 3; i++) {
    let colour = keyArr[i]
    if (colour > 127) {
      colour = Math.floor(colour * 0.5)
    }
    colours.push(colour)
  }
  return `rgb(${colours[0]}, ${colours[1]}, ${colours[2]})`
}


let InboundURLMatcher = new RegExp('https:\/\/dauth.atrailing.space\/([a-zA-Z0-9]+)')
class KeyList extends React.Component {

  constructor(){
    super()
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds.cloneWithRows([])}
    this.state = this.fetchInitialState()
  }


  fetchInitialState() {
    let keys = KeyStore.getAll()
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.hash() !== r2.hash()});
    return {
      dataSource: ds.cloneWithRows(keys),
      keys: keys,
    }
  }

  componentWillReceiveProps() {
    this.setState(this.fetchInitialState())
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', this._handleOpenURL.bind(this));
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      Linking.removeEventListener('url', this._handleOpenURL.bind(this));
    }
  }

  _handleOpenURL(event) {
    logger.debug('OpenURLEvent', event);
    let url = event.url
    let challengeMatch = url.match(InboundURLMatcher)
    if (challengeMatch.length > 1) {
      this.props.navigator.push({
        title: 'Decoded Challenge',
        component: Decode,
        popToTop: true,
        props: {
          challenge: challengeMatch[1]
        }
      });

    }
  }

  _newKey() {
    this.props.navigator.push({
      title: 'Create a new key',
      component: NewKey,
      navigateBack: true,
    });
  }

  _scan() {
    this.props.navigator.push({
      title: 'Scan a Challenge',
      component: Scan,
      navigateBack: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={this._renderRow.bind(this)}
        />
        <View style={styles.buttonRow}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this._scan()}>
            <Text style={styles.buttonText}>Decrypt OTP</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  _pressRow(keyPair){
    //Open KeyDetails
    this.props.navigator.push({
      title: 'KeyDetails',
      component: KeyDetails,
      navigateBack: true,
      props: {keyPair: keyPair},
    });
  }
  _renderRow(rowData: object, sectionID: number, rowID: number) {
    return (
        <TouchableHighlight onPress={() => this._pressRow(rowData)}>
          <View style={styles.row}>
            <View style={styles.keyRow}>
                <Text style={styles.text}>
                  {rowData.pretty()}
                </Text>
                <Text style={styles.rowSubText}>
                  {rowData.getPublicID()}
                </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
    );
  }
}

KeyList.rightButton = {
  text: (<Text style={{fontSize: 20}}> +</Text>),
  onPress: function(route, navigator){
    navigator.push({
      title: 'Create a new key',
      component: NewKey,
      navigateBack: true,
    });
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.background,
  },
  listview: {
    flexDirection: 'column',
    flex: 6,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colours.background,
    alignItems: 'center',
    flex: 1,
    borderBottomColor: Colours.background,
    borderTopColor: '#DDDDDD',
    borderRightColor: Colours.background,
    borderLeftColor: Colours.background,
    borderWidth: 1,
  },
  buttonText: {
    color: '#666666',
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
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor: Colours.background,
    borderBottomColor: Colours.background,
    borderTopColor: Colours.lightA,
    borderRightColor: Colours.background,
    borderLeftColor: Colours.background,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    flex: 1,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  rowSubText: {
    flex: 1,
    fontSize: 11,
    color: '#555555',
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
  },
});

KeyList.propTypes = {
  navigator: React.PropTypes.instanceOf(React.Navigator),
}

module.exports = KeyList
