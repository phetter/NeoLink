import React from 'react'
import PropTypes from 'prop-types'

import style from './TransactionRemark.css'

// import neoPNG from '../../../img/icon-34.png'

const TransactionRemark = ({ transaction }) => {
  if (transaction && transaction.attributes !== undefined) {
    const txAttrs = transaction.attributes ? transaction.attributes : []

    return txAttrs.map((remark) => {
      return (

        <div className={ style.transactionRemark }>
          <p>
            {remark.usage}
            {remark.data}
          </p>
        </div>
      )
    })
  } else { return null }
}

TransactionRemark.propTypes = {
  transaction: PropTypes.object,
  remarks: PropTypes.array,
}

export default TransactionRemark
