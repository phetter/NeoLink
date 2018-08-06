import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { addTransactionRemark } from '../../actions/config'

import AddTransactionRemark from './AddTransactionRemark'

const actionCreators = {
  addTransactionRemark,
}

const mapStateToProps = state => ({
  transactionRemarks: state.config.transactionRemarks,
})

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddTransactionRemark)
