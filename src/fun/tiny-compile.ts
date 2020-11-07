// https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js

interface Token {
  type: string;
  value: string
}

interface AstNode {
  type: string;
  value?: string;
  name?: string;
  params?: AstNode[];
  body?: AstNode[]
  _context?: AstNode[] | Expression
  expression?: Expression
}

interface Expression {
  [key: string]: any
}

const WHITESPACE = /\s/
const NUMBERS = /[0-9]/
const LETTERS = /[a-z]/i;


function tokenizer(input: string) {
  let current = 0

  let tokens: Token[] = []

  while (current < input.length) {
    let char = input[current]

    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '(',
      })
      current++;
      continue
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }

    if (WHITESPACE.test(char)) {
      current++;
      continue
    }

    if (NUMBERS.test(char)) {
      const value = []
      while (NUMBERS.test(char)) {
        value.push(char)
        char = input[++current]
      }
      tokens.push({
        type: 'number',
        value: value.join('')
      })

      continue
    }


    if (char === '"') {
      const value = []

      char = input[++current]
      while (char !== '"') {
        value.push(char)
        char = input[++current]
      }
      char = input[++current]

      tokens.push({
        type: 'string',
        value: value.join('')
      })

      continue
    }

    if (LETTERS.test(char)) {
      const value = [];

      // Again we're just going to loop through all the letters pushing them to
      // a value.
      while (LETTERS.test(char)) {
        value.push(char);
        char = input[++current];
      }

      // And pushing that value as a token with the type `name` and continuing.
      tokens.push({type: 'name', value: value.join('')});

      continue;
    }

    throw new TypeError('I dont know what this character is: ' + char);
  }
  return tokens
}

function parser(tokens: Token[]) {
  let current = 0

  function walk(): AstNode {
    let token = tokens[current]

    if (token.type === 'number') {
      current++

      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current]

      let node: AstNode = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      token = tokens[++current];

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
        ) {
        node.params?.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }
    throw new TypeError(token.type);
  }

  let ast: AstNode = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body?.push(walk());
  }

  // At the end of our parser we'll return the AST.
  return ast;
}

function traverser(ast: AstNode, visitor: any) {
  function traverseArray(array: AstNode[], parent: AstNode) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node: AstNode, parent: AstNode | null) {
    let methods = visitor[node.type];

    methods?.enter(node, parent);

    // Next we are going to split things up by the current node type.
    switch (node.type) {

      // We'll start with our top level `Program`. Since Program nodes have a
      // property named body that has an array of nodes, we will call
      // `traverseArray` to traverse down into them.
      //
      // (Remember that `traverseArray` will in turn call `traverseNode` so  we
      // are causing the tree to be traversed recursively)
      case 'Program':
        traverseArray(node.body ?? [], node);
        break;

      // Next we do the same with `CallExpression` and traverse their `params`.
      case 'CallExpression':
        traverseArray(node.params ?? [], node);
        break;

      // In the cases of `NumberLiteral` and `StringLiteral` we don't have any
      // child nodes to visit, so we'll just break.
      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      // And again, if we haven't recognized the node type then we'll throw an
      // error.
      default:
        throw new TypeError(node.type);
    }

    methods?.exit(node, parent)
  }

  // Finally we kickstart the traverser by calling `traverseNode` with our ast
  // with no `parent` because the top level of the AST doesn't have a parent.
  traverseNode(ast, null);
}

function transformer(ast: AstNode) {
  let newAst: AstNode = {
    type: 'Program',
    body: []
  }

  ast._context = newAst.body

  traverser(ast, {
    NumberLiteral: {
      enter(node: AstNode, parent: AstNode) {
        parent._context?.push({
          type: 'NUmberLiteral',
          value: node.value
        })
      }
    },
    // Next we have `StringLiteral`
    StringLiteral: {
      enter(node: AstNode, parent: AstNode) {
        parent._context?.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    // Next up, `CallExpression`.
    CallExpression: {
      enter(node: AstNode, parent: AstNode) {

        // We start creating a new node `CallExpression` with a nested
        // `Identifier`.
        let expression: Expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        // Next we're going to define a new context on the original
        // `CallExpression` node that will reference the `expression`'s arguments
        // so that we can push arguments.
        node._context = expression.arguments;

        // Then we're going to check if the parent node is a `CallExpression`.
        // If it is not...
        if (parent.type !== 'CallExpression') {

          // We're going to wrap our `CallExpression` node with an
          // `ExpressionStatement`. We do this because the top level
          // `CallExpression` in JavaScript are actually statements.
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        // Last, we push our (possibly wrapped) `CallExpression` to the `parent`'s
        // `context`.
        parent._context?.push(expression);
      },
    }
  })

  return newAst
}

function codeGenerator(node: AstNode | Expression): any {
  switch (node.type) {

    // If we have a `Program` node. We will map through each node in the `body`
    // and run them through the code generator and join them with a newline.
    case 'Program':
      return node.body?.map(codeGenerator)
        .join('\n');

    // For `ExpressionStatement` we'll call the code generator on the nested
    // expression and we'll add a semicolon...
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) +
        ';' // << (...because we like to code the *correct* way)
      );

    // For `CallExpression` we will print the `callee`, add an open
    // parenthesis, we'll map through each node in the `arguments` array and run
    // them through the code generator, joining them with a comma, and then
    // we'll add a closing parenthesis.
    case 'CallExpression':
      return (
        codeGenerator((node as any).callee) +
        '(' +
        (node as any).arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );

    // For `Identifier` we'll just return the `node`'s name.
    case 'Identifier':
      return node.name;

    // For `NumberLiteral` we'll just return the `node`'s value.
    case 'NumberLiteral':
      return node.value;

    // For `StringLiteral` we'll add quotations around the `node`'s value.
    case 'StringLiteral':
      return '"' + node.value + '"';

    // And if we haven't recognized the node, we'll throw an error.
    default:
      throw new TypeError(node.type);
  }
}

/**
 * 编译
 * @param input
 */
export function compiler(input: string) {
  const tokens = tokenizer(input);
  const ast    = parser(tokens);
  const newAst = transformer(ast);
  const output = codeGenerator(newAst);
  return output;
}
