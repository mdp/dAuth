const React = require('react-native')

const {
  Component,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} = React

class InnerButtonView extends Component {

  render() {
    return(
      <View style={styles.insideView}>
        <Text style={ this.props.labelStyle }>{ this.props.text }</Text>
      </View>
    )
  }
}

class MyButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={ this.props.touchableStyle } onPress={ this.props.onPress }>
        <View style={[ this.props.backgroundStyle ]}>
          <InnerButtonView {...this.props}/>
        </View>
      </TouchableOpacity>
    )
  }

}

MyButton.defaultProps = {
  touchableStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  backgroundStyle: {
    flex: 1,
    height: 40,
    backgroundColor: '#673AB7',
    borderRadius: 20,
    paddingLeft: 50,
    paddingRight: 50,
  },
  labelStyle: {
    color: '#FFFFFF',
  },
}

const styles = StyleSheet.create({
  insideView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  }
})

module.exports = MyButton
