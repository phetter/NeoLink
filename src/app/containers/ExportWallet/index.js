import { connect } from 'react-redux'

import ExportWallet from './ExportWallet'

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts,
})

export default connect(mapStateToProps)(ExportWallet)
