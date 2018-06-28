import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Button } from 'rmwc/Button'
import '@material/button/dist/mdc.button.min.css'

import { callInvoke } from '../../utils/api/neon'

import style from './SendInvoke.css'
import globalStyle from '../../components/ContentWrapper/ContentWrapper.css'
import withLoginCheck from '../../components/Login/withLoginCheck'

class SendInvokeReadonly extends Component {
  state = {
    loading: false,
    errorMsg: '',
    txid: '',
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { selectedNetworkId, networks, account, transaction, onSuccess } = this.props

    this.setState({
      loading: true,
      errorMsg: '',
      txid: '',
    })

    const txConfig = {
      scriptHash: transaction.scriptHash,
      operation: transaction.operation,
      args: transaction.args,
      assetAmount: transaction.amount,
      assetType: transaction.type,
    }

    callInvoke(networks[selectedNetworkId].url, account, txConfig)
      .then((c) => {
        if (c.response.result === true) {
          this.setState({
            loading: false,
            txid: c.response.txid,
          })

          if (onSuccess) {
            onSuccess(c.response)
          }
        } else {
          this.setState({
            loading: false,
            errorMsg: 'Invoke failed',
          })
        }
      })
      .catch((e) => {
        console.log('e', e)
        this.setState({
          loading: false,
          errorMsg: `Invoke failed: ${e.message}`,
        })
      })
  }

  render() {
    const { loading, txid, errorMsg } = this.state
    const { transaction, account } = this.props

    if (!account || !account.wif) {
      return (
        <div>
          Please login through browser button and reinitiate this operation.
        </div>
      )
    }

    return (
      <div>
        <form onSubmit={ this.handleSubmit } style={ { paddingTop: '35px' } }>
          <div className={ style.entryItem }>
            <span className={ style.label }>Script Hash:</span>
            <span className={ globalStyle.infoText }>{ transaction.scriptHash }</span>
          </div>
          <div className={ style.entryItem }>
            <span className={ style.label }>Operation:</span>
            <span className={ globalStyle.infoText }>{ transaction.operation }</span>
          </div>
          {
            transaction.args.map((arg, index) => {
              console.log(transaction);
              console.log(arg);
              return (              <div className={ style.entryItem } key={`tx-args-readonly-${index}`}>
                <span className={ style.label }>Argument {index}:</span>
                <span className={ globalStyle.infoText }>{ arg }</span>
              </div>)
            }

            )
          }
          <div className={ style.entryItem }>
            <span className={ style.label }>Amount:</span>
            <span className={ globalStyle.infoText }>{ transaction.amount }</span>
          </div>
          <div className={ style.entryItem }>
            <span className={ style.label }>Asset:</span>
            <span className={ globalStyle.infoText }>{ transaction.type }</span>
          </div>
          <Button raised ripple disabled={ this.state.loading || this.state.success }>Invoke</Button>
        </form>>
        { txid &&
          <div className={ style.statusBox }>
            <div>Success!</div>
            <span className={ globalStyle.infoText }>txid: { txid }</span>
          </div>
        }
        { loading &&
          <div className={ style.statusBox }>Loading...</div>
        }
        { errorMsg !== '' &&
          <div className={ style.statusBox }>ERROR: {errorMsg}</div>
        }
      </div>
    )
  }
}

SendInvokeReadonly.propTypes = {
  account: PropTypes.object,
  networks: PropTypes.object,
  selectedNetworkId: PropTypes.string,
  transaction: PropTypes.object,
  onSuccess: PropTypes.func,
}

const mapStateToProps = state => ({
  selectedNetworkId: state.config.selectedNetworkId,
  networks: state.config.networks,
  account: state.account,
})

export default withLoginCheck(connect(mapStateToProps)(SendInvokeReadonly))
