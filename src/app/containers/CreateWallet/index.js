import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import { addAccount } from '../../actions/wallet'
import { setAccount } from '../../actions/account'

import CreateWallet from './CreateWallet'

const actionCreators = {
  addAccount,
  setAccount,
}

const mapStateToProps = state => ({
  accounts: state.wallet.accounts,
})

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateWallet))
