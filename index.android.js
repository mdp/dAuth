/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var App = require('./app/components/KeyList');
var KeyStore = require('./app/stores/KeyStore');
var NewKey = require('./app/components/NewKey');
var {
  Navigator,
  StyleSheet,
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  BackAndroid
} = React;

var Colours = require('./app/config/Colours');

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    if (route.component.rightButton) {
      let btn = route.component.rightButton
      return (
        <TouchableOpacity
          onPress={() => btn.onPress(route, navigator)}
          style={styles.navBtnRight}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            {btn.text}
          </Text>
        </TouchableOpacity>
      );
    }
    return null
  },

  Title: function(route, navigator, index, navState) {
      return false;
  },

};

var navigator = React.createClass({
  currentRoute: null,
  navigator: null,
  getInitialState: function() {
    return {
      ready: false
    }
  },
  componentWillMount: async function(){
    console.log('dAuth: GoBackListener')
    let isSetup = await KeyStore.setupDatastore()
    this.setState({ready: true})
    BackAndroid.addEventListener('hardwareBackPress', () => {
      console.log('dAuth: GoBack')
      if (this.navigator && this.currentRoute) {
        if (this.currentRoute.popToTop) {
          console.log('dAuth: Current route PopToTop')
          this.navigator.popToTop()
          return true;
        } else if (this.currentRoute.navigateBack) {
          console.log('dAuth: Current route NavBack')
          this.navigator.pop()
          return true;
        }
        console.log('dAuth: Current route Exit')
        return false;
      } else {
        console.log('dAuth: Exit')
        return false;
      }
    });
  },
  render: function() {
    if (!this.state.ready) {
      return false
    }
    return (
      <Navigator
        initialRoute={{
          component: App,
          title: 'dAuth',
        }}
        renderScene={(route, navigator) => {
          var Component = route.component;
          this.currentRoute = route;
          this.navigator = navigator;
          if (route.component) {
            return (
              <View style={styles.container}>
                <Component navigator={navigator} {...route.props} />
              </View>
            );
          }
        }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: Colours.background,
  },
  navBar: {
    backgroundColor: Colours.primary,
  },
  navBarText: {
    fontSize: 16,
  },
  navBarTitleText: {
    color: '#DDDDDD',
    fontWeight: '500',
    marginVertical: 18,
    marginLeft:10,
  },
  navBtnRight: {
    marginRight: 15,
    marginVertical: 13,
  },
  navBarButtonText: {
    color: '#DDDDDD',
    fontSize: 16,
  },
})


AppRegistry.registerComponent('dotp_client', () => navigator);
