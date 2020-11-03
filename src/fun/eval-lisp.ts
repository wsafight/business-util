// https://stopa.io/post/265

const fns: Record<string, any> = {
  drawLine: '',
  do: (...args: any[]) => args[args.length -1],
}

function evalLisp(data: {instructions: any[]}) {
  data.instructions.forEach(([fName, ...args]) => fns[fName](...args))
}

evalLisp({
  instructions: ['drawLine', {x: 0, y: 0}, {x: 1, y: 1}]
})

function evalLisp2(data: {instructions: any[]}) {
  const parseInstruction = (ins: any[] | any): any => {
    if (!Array.isArray(ins)) {
      return ins
    }
    const [fName, ...args] = ins
    return fns[fName](...args.map(parseInstruction))
  }

  data.instructions.forEach(parseInstruction)
}

evalLisp2({
  instructions: ['rotate', ['drawLine', {x: 0, y: 0}, {x: 1, y: 1}]]
})


function evalLisp3 (data: any[]) {
  const parseInstruction = (ins: any[] | any): any => {
    if (!Array.isArray(ins)) {
      return ins
    }
    const [fName, ...args] = ins
    return fns[fName](...args.map(parseInstruction))
  }
  parseInstruction(data)
}

evalLisp3(['do', ['drawLine', {x: 0, y: 0}, {x: 1, y: 1}]])

const finallyEval = (instruction: any[]) => {
  const variables: Record<string, any> = {};
  const fns: Record<string, any> = {
    drawLine: '',
    drawPoint: '',
    rotate: '',
    do: (...args: any[]) => args[args.length - 1],
    def: (name: string, v: any) => {
      variables[name] = v;
    },
  };
  const mapArgsWithValues = (args: any[], values: any[]) => {
    return args.reduce((res, k, idx) => {
      res[k] = values[idx];
      return res;
    }, {});
  };
  const parseFnInstruction = (args: any, body: any, oldVariables: any) => {
    return (...values: any[]) => {
      const newVariables = {
        ...oldVariables,
        ...mapArgsWithValues(args, values),
      };
      return parseInstruction(body, newVariables);
    };
  };
  const parseInstruction = (ins: any[] | any, variables: Record<string, any>): any => {
    if (variables[ins]) {
      // this must be some kind of variable
      return variables[ins];
    }
    if (!Array.isArray(ins)) {
      // this must be a primitive argument, like {x: 0 y: 0}
      return ins;
    }
    const [fName, ...args] = ins;
    if (fName == "fn") {
      // @ts-ignore
      return parseFnInstruction(...args, variables);
    }
    const fn = fns[fName] || variables[fName];
    return fn(...args.map((arg) => parseInstruction(arg, variables)));
  };
  parseInstruction(instruction, variables);
}