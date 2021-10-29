const sass2less = require('less-plugin-sass2less/lib')
const convert = new sass2less()
const result = convert.process("$--color-primary: #e80af0;", {fileInfo: {filename: 'anything.scss'}})
console.log(result)