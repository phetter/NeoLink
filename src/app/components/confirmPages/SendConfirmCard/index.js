import React from 'react'
import PropTypes from 'prop-types'

import style from './SendConfirmCard.css'

const SendConfirmCard = ({ assetType, amount, address, remark, successClickHandler, rejectClickHandler }) => (
  <section className={ style.confirmSendCard }>
    <div className={ style.confirmSendCardContainer }>
      <i className={ `${style.confirmSendCardMainIcon} far fa-paper-plane` } />
      <h2 className={ style.confirmSendHeader }>You are about to send</h2>
      <h3>
        {amount} {assetType} {remark}
      </h3>
      <h4 className={ style.confirmSendCardDetailsHeading }>Details</h4>
      <section className={ style.confirmSendCardDetails }>
        <i className={ `${style.confirmSendSecondaryIcon} far fa-paper-plane` } />
        <p className={ style.confirmSendDetailsText }>
          You are about to send {amount} {assetType} {remark} to the following address
        </p>
      </section>
      <div className={ style.confirmSendCardAddress }>{address}</div>
    </div>
    <section className={ style.confirmSendButtons }>
      <button
        className={ `${style.confirmSendCardRejectButton} ${style.confirmSendButton}` }
        onClick={ rejectClickHandler }
      >
        Reject
      </button>
      <button
        className={ `${style.confirmSendCardAcceptButton} ${style.confirmSendButton}` }
        onClick={ successClickHandler }
      >
        Accept
      </button>
    </section>
  </section>
)

SendConfirmCard.propTypes = {
  assetType: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  remark: PropTypes.string,
  successClickHandler: PropTypes.func.isRequired,
  rejectClickHandler: PropTypes.func.isRequired,
}

export default SendConfirmCard
