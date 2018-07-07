import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setAccount } from '../../actions/account'

import SwitchAccount from './SwitchAccount'

const mapStateToProps = state => ({
  accounts: state.wallet.accounts,
  account: state.account,
  networks: state.config.networks,
  selectedNetworkId: state.config.selectedNetworkId,
})

const actionCreators = {
  setAccount,
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchAccount)
