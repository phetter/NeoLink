import React from 'react'
import PropTypes from 'prop-types'

import downloadSVG from '../../../img/download.svg'

import style from './FileUpload.css'

const FileUpload = ({ onChangeHandler }) => {
  return (
    <label className={ style.fileUpload }>
      <img src={ downloadSVG } alt='file being downloaded' className={ style.fileUploadImage } />
      <input type='file' id='file' onChange={ onChangeHandler } className={ style.fileUploadInput } />
    </label>
  )
}

FileUpload.propTypes = {
  onChangeHandler: PropTypes.func.isRequired,
}

export default FileUpload
