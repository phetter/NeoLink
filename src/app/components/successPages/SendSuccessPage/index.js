import React from 'react'
import PropTypes from 'prop-types'

import SuccessPage from '../SuccessPage'
import SecondaryButton from '../../common/buttons/SecondaryButton'

import style from './SendSuccessPage.css'

const SendSuccessPage = ({ txid, title, onClickHandler, url }) => (

  <SuccessPage title={ title }>
    <p className={ style.sendSuccessPageText }>You can verify the transaction at the following transactionid</p>
    <a href={ url } className={ style.transactionLink } target='_blank'> {txid} </a>
    <SecondaryButton buttonText='Back to home' onClickHandler={ onClickHandler } />
  </SuccessPage>
)

SendSuccessPage.propTypes = {
  txid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default SendSuccessPage
