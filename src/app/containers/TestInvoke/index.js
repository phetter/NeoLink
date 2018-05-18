import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Neon, { api, u } from '@cityofzion/neon-js'

import { Button } from 'rmwc/Button'
import { TextField } from 'rmwc/TextField'
import '@material/button/dist/mdc.button.min.css'
import '@material/textfield/dist/mdc.textfield.min.css'

import tempStyle from '../App/App.css'
import styles from './testInvoke.css'

@connect(state => ({
  selectedNetworkId: state.config.selectedNetworkId,
  networks: state.config.networks,
}))
export default class TestInvoke extends Component {
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

  _handleTextFieldChange = e => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value,
    })
  }

  _handleArgChange = (id, e) => {
    const myArgs = this.state.args
    myArgs[id] = e.target.value

    this.setState({ args: myArgs })
  }

  _handleAddArgument = e => {
    e.preventDefault()
    const a = this.state.args
    const b = ['']
    console.log('this is a', this.state.args)
    console.log('w', b)
    const x = a.concat(b)
    this.setState({ args: x }, () => console.log('set', this.state))
    // this.setState({ args: this.state.args.concat(['']) }, () => console.log(this.state))
  }

  _handleRemoveArg = id => {
    console.log('removing')
    this.setState({ args: this.state.args.filter((s, idx) => id !== idx) })
  }

  _handleSubmit = event => {
    event.preventDefault()
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

    // const parsedArgs = args.map(arg => {
    //   if (arg !== '') return { type: 7, value: arg }
    // })
    //
    // const query = Neon.create.query({
    //   method: 'invokefunction',
    //   params: [this.state.scriptHash, this.state.operation, parsedArgs],
    // })

    const parsedArgs = args.map(arg => u.reverseHex(arg));

    const props = {
      scriptHash: scriptHash, // Scripthash for the contract
      operation: operation, // name of operation to perform.
      args: [Neon.u.reverseHex('cef0c0fdcfe7838eff6ff104f9cdec2922297537')] // any optional arguments to pass in. If null, use empty array.
    }

    const script = Neon.create.script(props)

    api[networks[selectedNetworkId].apiType]
      .getRPCEndpoint(networks[selectedNetworkId].url)
      .then(endpoint => {

        rpc.Query.invokeScript(script)
          .execute('http://seed3.neo.org:20332')
          .then(res => {
            console.log(res) // You should get a result with state: "HALT, BREAK"
          })

        query.execute(endpoint).then(response => {
          this.setState({
            loading: false,
            result: response.result,
          })
        })
      })
      .catch(e => {
        console.log('ejhowe', e);
        this.setState({
          loading: false,
          errorMsg: 'Error testing invoke.',
        })
      })
  }

  render() {
    const { result, loading, errorMsg } = this.state
    return (
      <div>
        <form>
          <div className={ tempStyle.tempFormStyle }>
            <TextField
              type='text'
              placeholder='Script Hash'
              value={ this.state.scriptHash }
              id='scriptHash'
              onChange={ this._handleTextFieldChange }
            />
            <TextField
              type='text'
              placeholder='Operation'
              value={ this.state.operation }
              id='operation'
              onChange={ this._handleTextFieldChange }
            />
          </div>
          <div className={ styles.argsWrapper } >

            {this.state.args.map((arg, idx) => (
              <React.Fragment>
                <TextField
                  style={ { flexGrow: 1, order: 1 } }
                  type='text'
                  key={ idx + 1 }
                  placeholder={ `Argument #${idx + 1}` }
                  value={ arg }
                  id={ `Argument #${idx + 1} name` }
                  onChange={ (event) => this._handleArgChange(idx, event) }
                />
                <Button raised ripple style={ { flexGrow: 0, order: 0 } } onClick={ () => this._handleRemoveArg(idx) }>
                  -
                </Button>
              </React.Fragment>
            ))}
            <Button className={ styles.btn } style={ { marginRight: 2 } } raised ripple onClick={ this._handleAddArgument }>Add Argument</Button>

            <Button raised ripple className={ styles.btn } style={ { marginLeft: 2 } }
              onClick={ this._handleSubmit }
            >
              Invoke
            </Button>
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
      </div>
    )
  }
}

TestInvoke.propTypes = {
  selectedNetworkId: PropTypes.string,
  networks: PropTypes.object,
}
