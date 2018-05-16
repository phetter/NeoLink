import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import withForm from '../../components/HoC/withForm'

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

export default withForm(withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateWallet)))
