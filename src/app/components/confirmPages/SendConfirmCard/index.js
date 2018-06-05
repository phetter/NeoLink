import React from 'react'
import PropTypes from 'prop-types'

import paperPlaneSVG from '../../../../img/paper-planeThin.svg'

import style from './SendConfirmCard.css'

const SendConfirmCard = ({ assetType, amount, address, succesClickHandler, rejectClickHandler }) => (
  <section className={ style.confirmSendCard }>
    <div className={ style.confirmSendCardContainer }>
      <img src={ paperPlaneSVG } alt='paper plane' className={ style.confirmSendCardMainIcon } />
      <h2 className={ style.confirmSendHeader }>You are about to send</h2>
      <h3>
        {amount} {assetType}
      </h3>
      <h4 className={ style.confirmSendCardDetailsHeading }>Details</h4>
      <section className={ style.confirmSendCardDetails }>
        <img src={ paperPlaneSVG } alt='paper plane' className={ style.confirmSendSecondaryIcon } />
        <p className={ style.confirmSendDetailsText }>
          You are about to send {amount} {assetType} to the following address
        </p>
      </section>
      <div className={ style.confirmSendCardAddress }>{address}</div>
    </div>
    <section className={ style.confirmSendButtons }>
      <button
        className={ style.confirmSendCardRejectButton + ' ' + style.confirmSendButton }
        onClick={ rejectClickHandler }
      >
        Reject
      </button>
      <button
        className={ style.confirmSendCardAcceptButton + ' ' + style.confirmSendButton }
        onClick={ succesClickHandler }
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
  succesClickHandler: PropTypes.func.isRequired,
  rejectClickHandler: PropTypes.func.isRequired,
}

export default SendConfirmCard
