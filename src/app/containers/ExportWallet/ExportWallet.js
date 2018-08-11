import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'

import ErrorCard from '../../components/errors/ErrorCard'
import Box from '../../components/common/Box'
import PrimaryButton from '../../components/common/buttons/PrimaryButton'

import style from './ExportWallet.css'
import BackNavigation from "../../components/BackNavigation";

export default class ExportWallet extends Component {
  state = {
    errorMsg: '',
  }

  exportWallet = event => {
    event.preventDefault()

    const { accounts } = this.props

    try {
      const walletObject = new wallet.Wallet({ name: 'neoLinkWallet', accounts: Object.values(accounts) })

      // eslint-disable-next-line no-undef
      const blob = new Blob([JSON.stringify(walletObject.export())], { type: 'text/plain' })
      // eslint-disable-next-line no-undef
      const url = URL.createObjectURL(blob)

      chrome.downloads.download(
        {
          url: url,
          filename: 'NeoLinkWallet.json',
          saveAs: true,
        },
        downloadId => {
          if (!downloadId) {
            this.setState({
              // eslint-disable-next-line no-undef
              errorMsg: runtime.lastError,
            })
          }
        }
      )
    } catch (e) {
      this.setState({
        errorMsg: e.message,
      })
    }
  }

  render() {
    const { errorMsg } = this.state
    const { accounts, history } = this.props

    if (Object.keys(accounts).length === 0) {
      return <div>You have no stored accounts</div>
    }

    return (
      <React.Fragment>
        <BackNavigation onClickHandler={() => history.push('/settings')}/>
        <section className={ style.exportWallet }>
          <Box>
            <h1>Export Wallet</h1>
            <p className={ style.exportWalletParagraph }>
              Export your wallets encrypted keys, to a JSON format that you can import into other wallets. Never give this
              file to anyone.
            </p>
            <form onSubmit={ this.exportWallet }>
              <div>
                <PrimaryButton buttonText='Export wallet' />
              </div>
            </form>
            {errorMsg && <ErrorCard message={ errorMsg } onClickHandler={ () => this.setState({ errorMsg: '' }) } />}
          </Box>
        </section>
      </React.Fragment>

    )
  }
}

ExportWallet.propTypes = {
  accounts: PropTypes.object.isRequired,
  history: PropTypes.object
}
