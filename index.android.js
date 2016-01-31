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

var cssVar = require('cssVar');
var Colours = require('./app/config/Colours');



var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
      return null;
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

var navigator = React.createClass({
  currentRoute: null,
  navigator: null,
  componentWillMount: function(){
    console.log("dAuth: GoBackListener")
    BackAndroid.addEventListener('hardwareBackPress', () => {
      console.log("dAuth: GoBack")
      if (this.navigator && this.currentRoute) {
        if (this.currentRoute.popToTop) {
          console.log("dAuth: Current route PopToTop")
          this.navigator.popToTop()
          return true;
        } else if (this.currentRoute.navigateBack) {
          console.log("dAuth: Current route NavBack")
          this.navigator.pop()
          return true;
        }
        console.log("dAuth: Current route Exit")
        return false;
      } else {
        console.log("dAuth: Exit")
        return false;
      }
    });
  },
  render: function() {
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
