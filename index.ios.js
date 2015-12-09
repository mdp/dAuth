/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
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

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    if (route.popToTop) {
      return (
        <TouchableOpacity
          onPress={() => navigator.popToTop()}
          style={styles.navBarLeftButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText]}>
            Done
          </Text>
        </TouchableOpacity>
      );
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Done
        </Text>
      </TouchableOpacity>
    );
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
        {route.title} [{index}]
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
    top: 64,
    flex: 1,
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: cssVar('fbui-bluegray-60'),
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: cssVar('fbui-accent-blue'),
  },
})


AppRegistry.registerComponent('dotp_client', () => navigator);
