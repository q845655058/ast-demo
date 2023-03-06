// demo1
// const babylon = require('@babel/parser')

// const code = `
//   const a = 10
//   let b = 'a'
// `

// const code2 = '2*(1+20)'

// const ast = babylon.parse(code)
// const ast2 = babylon.parseExpression(code2)

// console.log('--------\nparse:', ast)
// console.log('--------\nparseExpression:', ast2)

// demo2
// const babylon = require('@babel/parser')
// const traverse = require('@babel/traverse').default

// const code = `
//   const a = 10
//   function test () {}
// `
// const ast = babylon.parse(code)

// traverse(ast, {
//   enter(path) {
//     console.log('enter -> path.type', path.type)
//   },
//   exit(path) {
//     console.log('leave -> path.type', path.type)
//   },
//   'VariableDeclaration|Identifier': (path) => {
//     console.log('VariableDeclaration and Identifier', path.node)
//   },
//   FunctionDeclaration(path) {
//     console.log('FunctionDeclaration')
//   },
// })

// demo3
const babylon = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')

const code = `
  const a = 10
  function test () {}
`
const ast = babylon.parse(code)

traverse(ast, {
  Identifier(path, state) {
    console.log(state)
    path.node.name += '_append'
  },
})

const result = generate(ast, { sourceMaps: true }, code)
console.log('---------------')
console.log(result)
