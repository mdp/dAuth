/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var Promise = require('bluebird');
Promise.config({
    longStackTraces: true,
    warnings: true
})

var React = require('react-native');
var App = require('./app/components/KeyList');
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
    if (route.rightButton) {
      return (
        <TouchableOpacity
          onPress={() => route.rightButton.onPress}
          style={styles.navBarLeftButton}>
          <Text style={[styles.navBarText, route.rightButton.style]}>
            route.rightButton.text
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

var navigator = React.createClass({
  render: function() {
    return (
      <Navigator
        initialRoute={{component: App, title: 'dOTP'}}
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
  navBarRightButton: {
    paddingRight: 10,
  },
  navBtnLeft: {
    padding: 3,
    marginLeft: 10,
    marginTop: 7,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
  },
  navBarButtonText: {
    color: '#DDDDDD',
  },
})


AppRegistry.registerComponent('dotp_client', () => navigator);
