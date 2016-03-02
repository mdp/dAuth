/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var App = require('./app/components/KeyList');
var Decode = require('./app/components/Decode');
var NewKey = require('./app/components/NewKey');
var {
  Navigator,
  StyleSheet,
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} = React;

var cssVar = require('cssVar');
var Colours = require('./app/config/Colours');

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    if (route.popToTop) {
      return (
        <TouchableOpacity
          onPress={() => navigator.popToTop()}
          style={styles.navBtnLeft}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            Done
          </Text>
        </TouchableOpacity>
      );
    } else if (route.navigateBack) {
      return (
        <TouchableOpacity
          onPress={() => navigator.pop()}
          style={styles.navBtnLeft}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            Back
          </Text>
        </TouchableOpacity>
      );
    }
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
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },

};

const DEBUG_OTP = false
var navigator = React.createClass({
  render: function() {
    var initialRoute = {
      component: App,
      title: 'dAuth',
    }
    if (DEBUG_OTP) {
      console.log(Decode.TestChallenge)
      initialRoute = {
        component: Decode,
        title: 'Decoded Challenge',
        props:{
          challenge: Decode.TestChallenge,
        },
      }
    }
    return (
      <Navigator
        initialRoute={initialRoute}
        renderScene={(route, navigator) => {
          var Component = route.component;
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
    paddingTop: 64,
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
    marginVertical: 9,
  },
  navBtnRight: {
    padding: 3,
    marginRight: 10,
    marginTop: 7,
  },
  navBtnLeft: {
    padding: 3,
    marginLeft: 10,
    marginTop: 7,
  },
  navBarButtonText: {
    color: '#DDDDDD',
    fontSize: 16,
  },
})


AppRegistry.registerComponent('dotp_client', () => navigator);
