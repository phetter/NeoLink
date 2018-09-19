import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import * as Neoscan from '../../../utils/api/neoscan'

import paperPlaneSVG from '../../../../img/paper-planeSolid.svg'
import eyeSVG from '../../../../img/eye.svg'
import editSVG from '../../../../img/edit.svg'

import style from './AccountInfoDropDownContent.css'

const AccountInfoDropDownContent = ({ onClickHandler, address }) => {
  let addressLookupUrl
  let net = Neoscan.getNet()
  if (net && net.addressUrl) {
    addressLookupUrl = net.addressUrl + address
  } else {
    addressLookupUrl = 'https://neoscan-testnet.io/address/' + address
  }
  return (
    <Fragment>
      <Link to='/send' className={ style.dropDownLinks }>
        <img src={ paperPlaneSVG } className={ style.dropDownLinksImage } alt='paper plane' />Send
      </Link>

      <a href={ `${addressLookupUrl}` } target='_blank' className={ style.dropDownLinks }>
        <img src={ eyeSVG } className={ style.dropDownLinksImage } alt='eye' />View on Neoscan
      </a>
      <button className={ style.dropDownLinksButton } onClick={ onClickHandler }>
        <img src={ editSVG } className={ style.dropDownLinksImage } alt='pen' />Edit Name
      </button>
    </Fragment>
  )
}

AccountInfoDropDownContent.propTypes = {
  onClickHandler: PropTypes.func,
  address: PropTypes.string.isRequired,
}

export default AccountInfoDropDownContent
