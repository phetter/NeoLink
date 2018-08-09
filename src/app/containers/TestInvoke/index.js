import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Neon, { api, u, rpc } from '@cityofzion/neon-js'

import Input from '../../components/common/form/InputField'
import Button from '../../components/common/buttons/PrimaryButton'

import styles from './testInvoke.css'
import withLoginCheck from '../../components/Login/withLoginCheck'

import { logDeep } from '../../utils/debug'

export class TestInvoke extends Component {
  state = {
    errorMsg: '',
    loading: false,
    scriptHash: '',
    operation: '',
    args: [''],
  }

  resetState = () => {
    this.setState({
      errorMsg: '',
      loading: false,
      scriptHash: '',
      args: [''],
      operation: '',
    })
  }

  _handleInputChange = e => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value,
    })

    logDeep('key: ', key + ' ' + e.target.value)
  }

  _handleArgChange = (id, e) => {
    let myArgs = this.state.args
    myArgs[id] = e.target.value

    this.setState({ args: myArgs })
    logDeep('args: ', myArgs)
  }

  _handleAddArgument = e => {
    e.preventDefault()
    this.setState({ args: this.state.args.concat(['']) })
  }

  _handleRemoveArg = (id, e) => {
    e.preventDefault()
    this.setState({ args: this.state.args.filter((s, idx) => id !== idx) })
  }

  _handleSubmit = e => {
    e.preventDefault()
    const { selectedNetworkId, networks } = this.props
    const { scriptHash, operation, args } = this.state
    this.setState({
      loading: true,
      errorMsg: '',
      result: '',
    })

    if (!scriptHash || !operation) {
      this.setState({
        loading: false,
        errorMsg: 'Error! Script hash and operation are both required!',
      })

      return
    }

    if (!u.isHex(scriptHash) || scriptHash.length !== 40) {
      this.setState({
        loading: false,
        errorMsg: 'Error! No valid scripthash was given!',
      })

      return
    }

    const parsedArgs = args.map(arg => u.str2hexstring(arg))

    logDeep('pa: ', parsedArgs)

    const props = {
      scriptHash: scriptHash,
      operation: operation,
      args: parsedArgs,
    }

    const script = Neon.create.script(props)

    api[networks[selectedNetworkId].apiType]
      .getRPCEndpoint(networks[selectedNetworkId].url)
      .then(endpoint => {
        rpc.Query.invokeScript(script)
          .execute(endpoint)
          .then(response => {
            this.setState({
              loading: false,
              result: response.result,
            })
          })
      })
      .catch(e => {
        this.setState({
          loading: false,
          errorMsg: 'Error testing invoke.',
        })
      })
  }

  render() {
    const { result, loading, errorMsg } = this.state
    return (
      <React.Fragment>
        <form className={ styles.formWrapper }>
          <Input
            type='text'
            placeholder='Script Hash'
            defaultValue={ this.state.scriptHash }
            id='scriptHash'
            onChangeHandler={ this._handleInputChange }
          />
          <Input
            type='text'
            placeholder='Operation'
            defaultValue={ this.state.operation }
            id='operation'
            onChangeHandler={ this._handleInputChange }
          />
          <div className={ styles.argsWrapper }>
            {this.state.args.map((arg, idx) => (
              <div
                key={ `testInvoke-Args-${idx + 1}` }
                className={ styles.innerArgsWrapper }
              >
                <Input
                  style={ { flexGrow: 1, order: 1 } }
                  type='text'
                  placeholder={ `Argument #${idx + 1}` }
                  defaultValue={ arg }
                  id={ `Argument #${idx + 1} name` }
                  onChangeHandler={ (event) => this._handleArgChange(idx, event) }
                />
                <Button
                  style={ { flexGrow: 0, order: 0 } }
                  buttonText={ '-' }
                  onClickHandler={ (event) => this._handleRemoveArg(idx, event) } />
              </div>
            ))}
          </div>
          <div className={ styles.btnWrapper }>
            <Button
              classNames={ styles.btn }
              style={ { marginRight: '2px' } }
              onClickHandler={ this._handleAddArgument }
              buttonText={ 'Add Argument' } />

            <Button
              onClickHandler={ this._handleSubmit }
              buttonText={ 'Invoke' } />
          </div>
        </form>
        {result && (
          <div>
            <div>result:</div>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
        {loading && <div>Loading...</div>}
        {errorMsg !== '' && <div>ERROR: {errorMsg}</div>}
      </React.Fragment>
    )
  }
}

TestInvoke.propTypes = {
  selectedNetworkId: PropTypes.string,
  networks: PropTypes.object,
}

const mapStateToProps = state => ({
  selectedNetworkId: state.config.selectedNetworkId,
  networks: state.config.networks,
})

export default withLoginCheck(connect(mapStateToProps)(TestInvoke))
