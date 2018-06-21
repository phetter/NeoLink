import { connect } from 'react-redux'
import SwitchAccount from './SwitchAccount'

const mapStateToProps = state => ({
  accounts: state.wallet.accounts,
  account: state.account,
  networks: state.config.networks,
  selectedNetworkId: state.config.selectedNetworkId,
})

export default connect(mapStateToProps)(SwitchAccount)
