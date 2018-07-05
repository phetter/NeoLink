import React from 'react'
import PropTypes from 'prop-types'

import style from './TransactionCard.css'

import neoPNG from '../../../img/icon-34.png'

import TransactionRemark from '../TransactionRemark'

const TransactionCard = ({ transaction, neoSent, amounts, remarks }) => {
  const icon = neoSent === true ? <img src={ neoPNG } alt='neo' /> : <i className='fas fa-tint' />

  const amount = neoSent === true ? amounts.neo : amounts.gas
  const amountText = neoSent === true ? 'NEO' : 'GAS'
  const transactionId = transaction.txid
  // const { addTransactionRemark } = this.props
  // console.log('txurl: '+state.config.network.)

  // const txUrl = state.config.networks[state.config.selectedNetworkId] + transactionId

  const txUrl = ''
  return (
    <div className={ style.transactionCard }>
      <a href={ txUrl } className={ style.transactionCardLink } target='_blank' rel='noopener'>
        <h4 className={ style.transactionCardHeading }>{transactionId}</h4>
      </a>

      <p className={ style.transactionCardParagraph }>
        {icon}{' '}
        <span className={ style.transactionCardAmount }>
          {amount} {amountText}
        </span>
      </p>

      <TransactionRemark transaction={ transaction } />
    </div>
  )
}

TransactionCard.propTypes = {
  // transactionId: PropTypes.string.isRequired,
  transaction: PropTypes.object.isRequired,
  neoSent: PropTypes.bool.isRequired,
  amounts: PropTypes.object.isRequired,
  remarks: PropTypes.array,
  // addTransactionRemark: PropTypes.func,
}

export default TransactionCard
