import { connect } from 'react-redux'
import SwitchAccount from './SwitchAccount'

const mapStateToProps = state => ({
  accounts: state.wallet.accounts,
})

export default connect(mapStateToProps)(SwitchAccount)
