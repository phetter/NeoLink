import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './Transaction.css'
import neoPNG from '../../../img/icon-34.png'

import * as Neoscan from '../../utils/NeoscanApi'

import * as string from '../../utils/string'

class Transaction extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    const { transaction, neoSent, amounts, selectedNetworkId, networks } = this.props
    this.icon = neoSent === true ? <img src={ neoPNG } alt='neo' /> : <i className='fas fa-tint' />
    this.amount = neoSent === true ? amounts.neo : amounts.gas
    this.amountText = neoSent === true ? 'NEO' : 'GAS'
    this.transactionId = transaction.txid
    this.apiUrl = networks[selectedNetworkId].url
    this.txUrl = networks[selectedNetworkId].txUrl + this.transactionId
    this.remarks = []
  }

  render() {
    Neoscan.getTxById(this.transactionId).then(tx => {
      this.remarks = []

      tx.attributes.map((remark, i) => {
        if (remark.usage === 'Remark') {
          let s = string.hexstring2str(remark.data)
          this.remarks.push(s)
        }
      })

      // let d = new Date(0)
      this.txTime = new Date(tx.time * 1000).toLocaleString()
    }).catch(error => {
      console.log('error: ' + error)
    })

    let remarks
    if (this.remarks && this.remarks.length) {
      remarks = this.remarks.map((remark, i) => {
        return <li key={ this.transactionId + i }>{ remark}</li>
      })
    } else {
      remarks = ['']
    }

    return (
      <div>
        <div />
        <div className={ style.transactionCard }>

          <a
            href={ this.txUrl }
            className={ style.transactionCardLink }
            target='_blank'
            rel='noopener'
          >
            <h4 className={ style.transactionCardHeading }>{this.transactionId}</h4>
          </a>

          <p className={ style.transactionCardParagraph }>
            {this.icon}{' '}
            <span className={ style.transactionCardAmount }>
              {this.amount} {this.amountText}</span>
          </p>
          <div>
            <p className={ style.transactionCardParagraph }>
              <span className={ style.transactionCardRemarks }>{remarks}
              </span>
            </p>
          </div>
          <div>
            <p className={ style.transactionCardParagraph }>
              <span className={ style.transactionCardTime }>
                <b>{ this.txTime }</b>
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

Transaction.propTypes = {
  // transactionId: PropTypes.string.isRequired,
  // key: PropTypes.number,
  transaction: PropTypes.object.isRequired,
  networks: PropTypes.object,
  selectedNetworkId: PropTypes.string.isRequired,
  neoSent: PropTypes.bool.isRequired,
  amounts: PropTypes.object.isRequired,
  // remarks: PropTypes.array,
  // addTransactionRemark: PropTypes.func,

}

export default Transaction
