const babylon = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')
const fs = require('fs')
const path = require('path')

// 读取目录下所有的js文件
function getJsFiles(dir) {
  const filePaths = []
  const stat = fs.statSync(dir)
  if (stat.isDirectory()) {
    const dirs = fs.readdirSync(dir)
    dirs.forEach((value) => {
      filePaths.push(...getJsFiles(path.join(dir, value)))
    })
  } else if (stat.isFile()) {
    if (dir.split('.').pop() === 'js') {
      filePaths.push(dir)
    }
  }
  return filePaths
}

function insertFuncNameOutput(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8')

  const ast = babylon.parse(code, {
    sourceType: 'module',
  })

  traverse(ast, {
    ArrowFunctionExpression(path) {
      const funcName = path.parent.id.name
      let node = path.node
      let params = node.params
      let appendAst = t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier('console'), t.identifier('log')),
          [
            t.stringLiteral(
              `arrow function: ${funcName} => function, function params: ${
                params.length
                  ? params.map((item) => item.name).join(', ')
                  : 'null'
              }`
            ),
          ]
        )
      )
      let block = t.blockStatement([appendAst, t.returnStatement(node.body)])
      let func = t.functionExpression(null, params, block, false, false)
      path.replaceWith(func)
    },
    FunctionDeclaration(path) {
      const node = path.node,
        blockStatement = node.body,
        params = node.params,
        funcName = node.id.name

      let insertAst = t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier('console'), t.identifier('log')),
          [
            t.stringLiteral(
              `function name: ${funcName}, function params: ${
                params.length
                  ? params.map((item) => item.name).join(', ')
                  : 'null'
              }`
            ),
          ]
        )
      )
      blockStatement.body.unshift(insertAst)
    },
    CallExpression(path) {
      const calleePath = path.get('callee')
      if (calleePath && calleePath.matchesPattern('console', true)) {
        path.remove()
      }
    },
  })

  const result = generate(ast, {}, code)
  fs.writeFileSync(filePath, result.code, 'utf-8')
}

const jsFileList = getJsFiles('./src')

jsFileList.forEach((file) => {
  insertFuncNameOutput(file)
})
