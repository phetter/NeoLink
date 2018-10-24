import React from 'react'
import PropTypes from 'prop-types'

import Transaction from '../../containers/Transaction'
import SecondaryButton from '../common/buttons/SecondaryButton'
import FlashMessage from '../FlashMessage'

import style from './TransactionList.css'

// TODO WHY DID THIS CHANGE?
const NEO = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
const GAS = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'

const TransactionList = ({ transactions, transactionHistoryError, getTransactions }) => {
  let transactionCards = []

  if (transactions && transactions.data && transactions.data.length) {
    let i = 1
    transactionCards = transactions.data.map(tx => {
      const vin = tx.vin.filter(i => i.address_hash === transactions.address)
      const vout = tx.vouts.filter(o => o.address_hash === transactions.address)

      const change = {
        NEO: vin.filter(i => i.asset === NEO).reduce((p, c) => p + c.value, 0),
        GAS: vout.filter(i => i.asset === GAS).reduce((p, c) => p + c.value, 0),
        // TODO Figure out WHY THIS CHANGED.
        // NEO: vin.filter(i => i.asset === 'NEO').reduce((p, c) => p + c.value, 0),
        // GAS: vout.filter(i => i.asset === 'GAS').reduce((p, c) => p + c.value, 0),
      }

      const amounts = {
        neo: change.NEO ? Number(change.NEO) : 0,
        gas: Number(change.GAS) ? Number(change.GAS) : 0,
      }

      return <Transaction number={ i++ } key={ tx.txid } transaction={ tx } neoSent={ amounts.neo > 0 } amounts={ amounts } />
    })
  }

  let content

  if (transactionHistoryError) {
    content = (
      <div className={ style.transactionHistoryErrorContainer }>
        <FlashMessage flashMessage={ transactionHistoryError } />
        <SecondaryButton
          buttonText='Retry'
          classNames={ style.retryTransactionHistoryButton }
          onClickHandler={ getTransactions }
        />
      </div>
    )
  } else {
    if (transactionCards.length > 0) {
      content = (
        <div>
          <div align='center'>{transactions.viewing}</div>
          <div>{transactionCards}</div>
        </div>
      )
    } else {
      content = <h5 className={ style.transactionListNoTransactions }>No transactions to display.</h5>
    }
  }

  return <section className={ style.transactionList }>{content}</section>
}

TransactionList.propTypes = {
  transactions: PropTypes.object.isRequired,
  transactionHistoryError: PropTypes.string,
  getTransactions: PropTypes.func.isRequired,
}

export default TransactionList
