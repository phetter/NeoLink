import util from 'util'

export const lookDeep = (o) => {
  return util.inspect(o, { depth: null })
}

// TODO implement automatic argument passing option— see below
// I.e., if !msg, use argument.callee/caller for tracing and argument.name(?) for printing
export const logDeep = (msg, o) => {
  console.log(msg + ' ' + lookDeep(o))
}
