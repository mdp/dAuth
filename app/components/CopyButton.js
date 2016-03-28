let React = require('react-native');
let Button = require('./Button')
let {
  Text,
  TouchableHighlight,
} = React;

class CopyButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCopied: false
    }
  }
  render() {
    let buttonText = this.props.beforeCopyText
    if (this.state.isCopied) {
      buttonText = this.props.afterCopyText
    }
    return (
      <Button
        text={buttonText}
        onPress={ () => {
          this.setState({isCopied: true})
          React.NativeModules.Clipboard.copyStr(this.props.strToCopy)
          }
        }
      />
    )
  }
}

CopyButton.defaultProps = { beforeCopyText: 'Copy', afterCopyText: 'Copied' };

module.exports = CopyButton
