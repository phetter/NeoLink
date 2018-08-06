import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Asset from './Asset'

const actionCreators = {
}

const mapStateToProps = state => ({
  selectedNetworkId: state.config.selectedNetworkId,
  networks: state.config.networks,
  account: state.account,
})

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Asset)
