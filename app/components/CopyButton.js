let React = require('react-native');
let {
  Text,
  TouchableHighlight,
} = React;

class CopyButton extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.children)
    this.state = {
      buttonText: 'Copy'
    }
  }
  render() {
    return (
      <TouchableHighlight
        onPress={ () => {
          this.setState({buttonText: 'Copied'})
          React.NativeModules.Clipboard.copyStr(this.props.strToCopy)
          }
        }>
        <Text>{this.state.copyText}</Text>
      </TouchableHighlight>
    )
  }
}

module.exports = CopyButton
