import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Transaction from './Transaction'

const actionCreators = {
}

const mapStateToProps = state => ({
  selectedNetworkId: state.config.selectedNetworkId,
  networks: state.config.networks,
})

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
