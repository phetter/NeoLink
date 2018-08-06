import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import plusSVG from '../../../img/plus.svg'
import signInSVG from '../../../img/sign-in-alt.svg'
import uploadSVG from '../../../img/upload.svg'

import style from './StartPage.css'

const StartPage = ({ history }) => {
  return (
    <section className={ style.startPage }>
      <button className={ style.startPageButton } onClick={ () => history.push('/newWallet') }>
        <img src={ plusSVG } alt='plus' className={ style.startPageIcon } />
        New Wallet
      </button>
      <button className={ style.startPageButton } onClick={ () => history.push('/login') }>
        <img src={ signInSVG } alt='arrow through door' className={ style.startPageIcon } />
        Use Saved Wallet
      </button>
      <button className={ style.startPageButton } onClick={ () => history.push('/importWallet') }>
        <img src={ uploadSVG } alt='file upload' className={ style.startPageIcon } />
        Import Wallet
      </button>
    </section>
  )
}

StartPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(StartPage)
