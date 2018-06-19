import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import plusSVG from '../../../img/plus.svg'

import style from '../../components/StartPage/StartPage.css'

const CreateAccountStartPage = ({ history }) => {
  return (
    <section className={ style.startPage + ' ' + style.startPageCreateAccount }>
      <button className={ style.startPageButton } onClick={ () => history.push('/createWallet') }>
        <img src={ plusSVG } alt='plus' className={ style.startPageIcon } />
        Create New Wallet
      </button>
      <button className={ style.startPageButton } onClick={ () => history.push('/newAccountFromEncryptedKey') }>
        <img src={ plusSVG } alt='plus' className={ style.startPageIcon } />
        Use Encrypted Key
      </button>
      <button className={ style.startPageButton } onClick={ () => history.push('/newAccountFromWIF') }>
        <img src={ plusSVG } alt='plus' className={ style.startPageIcon } />
        Use Wif
      </button>
    </section>
  )
}

CreateAccountStartPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(CreateAccountStartPage)
