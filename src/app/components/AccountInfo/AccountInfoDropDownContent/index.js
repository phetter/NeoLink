import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import paperPlaneSVG from '../../../../img/paper-planeSolid.svg'
import eyeSVG from '../../../../img/eye.svg'
import editSVG from '../../../../img/edit.svg'

import style from './AccountInfoDropDownContent.css'

const AccountInfoDropDownContent = ({ onClickHandler, address }) => {
  return (
    <Fragment>
      <Link to='/send' className={ style.dropDownLinks }>
        <img src={ paperPlaneSVG } className={ style.dropDownLinksImage } alt='paper plane' />Send
      </Link>

      <Link to={ `https://neoscan.io/address/${address}` } target='_blank' className={ style.dropDownLinks }>
        <img src={ eyeSVG } className={ style.dropDownLinksImage } alt='eye' />View on Neoscan
      </Link>
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
