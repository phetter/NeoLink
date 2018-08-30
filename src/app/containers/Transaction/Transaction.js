import React, { Component } from 'react'
import PropTypes from 'prop-types'
import style from './Transaction.css'
import neoPNG from '../../../img/icon-34.png'

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
    // this.txUrl = networks[selectedNetworkId].url + '/transaction/' + this.transactionId
    this.txTime = transaction.txTime
    this.remarks = []
  }

  render() {
    const { transaction, number } = this.props

    let remarks
    if (transaction.stringRemarks && transaction.stringRemarks.length) {
      remarks = transaction.stringRemarks.map((remark, i) => {
        return <li key={ this.transactionId + i }>{remark}</li>
      })
    } else {
      remarks = ['']
    }

    return (
      <div>
      <div />
      <div className={ style.transactionCard }>
      { number }
        <a href={ this.txUrl } className={ style.transactionCardLink } target='_blank' rel='noopener'>
          <h4 className={ style.transactionCardHeading }>{this.transactionId}</h4>
        </a>

        <p className={ style.transactionCardParagraph }>
          {this.icon}{' '}
          <span className={ style.transactionCardAmount }>
            {this.amount} {this.amountText}
          </span>
        </p>
        <div>
          <p className={ style.transactionCardParagraph }>
            <span className={ style.transactionCardRemarks }>{remarks}</span>
          </p>
        </div>
        <div>
          <p className={ style.transactionCardParagraph }>
            <span className={ style.transactionCardTime }>
              <b>{this.txTime}</b>
            </span>
          </p>
        </div>
      </div>
    </div>
    )
  }
}

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
  networks: PropTypes.object,
  selectedNetworkId: PropTypes.string.isRequired,
  neoSent: PropTypes.bool.isRequired,
  amounts: PropTypes.object.isRequired,
}

export default Transaction
