import React from 'react'
import PropTypes from 'prop-types'

import Transaction from '../../containers/Transaction'
import SecondaryButton from '../common/buttons/SecondaryButton'
import FlashMessage from '../FlashMessage'

import style from './TransactionList.css'

import Neon from '@cityofzion/neon-js/'
import { Fixed8 } from '../../utils/math'

// TODO add sort

const TransactionList = ({ transactions, transactionHistoryError, getTransactions }) => {
  let transactionCards = []

  if (transactions && transactions.data && transactions.data.length) {
    transactionCards = transactions.data.map(tx => {
      // TODO: implement change code in utils/rpc.js to hide business from pres
      const vin = tx.vin.filter(i => i.address_hash === transactions.address)
      const vout = tx.vouts.filter(o => o.address_hash === transactions.address)

      const change = {
        NEO: vin.filter(i => i.asset === Neon.CONST.ASSET_ID.NEO).reduce((p, c) => p.add(c.value), new Fixed8(0)),
        GAS: vout.filter(i => i.asset === Neon.CONST.ASSET_ID.GAS).reduce((p, c) => p.add(c.value), new Fixed8(0)),
      }

      const amounts = {
        neo: change.NEO ? Number(change.NEO) : 0,
        gas: change.GAS ? Math.abs(Number(change.GAS)) : 0,
      }

      return (
        <Transaction
          key={ tx.txid }
          transaction={ tx }
          neoSent={ amounts.neo > 0 }
          amounts={ amounts }
        />
      )
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
          <div align='center'>
            { transactions.data.length }
          </div>
          <div>{ transactionCards }</div>
        </div>
      )
    } else {
      content = <h5 className={ style.transactionListNoTransactions }>No transactions to display.</h5>
    }
  }

  return <section className={ style.transactionList }>{content}</section>
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  transactionHistoryError: PropTypes.string,
  getTransactions: PropTypes.func.isRequired,
}

export default TransactionList
