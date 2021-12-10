const loadStructs = ({nodes}) => {
  return nodes[nodes.length-1].nodes
    .filter(({nodeType}) => nodeType === 'StructDefinition')
    .reduce((struct, {name, members}) => {
      members = members.reduce((memberObject, {name, typeDescriptions: {typeString: type}}) => {
        return memberObject.members = mapParameters(members);
      }, {});

      struct[name] = { name, members };
      return struct;
    }, {});
}

const loadConstructor = ({nodes}) => {
  return nodes[nodes.length-1].nodes
    .filter(({nodeType, isConstructor}) => isConstructor && nodeType === 'FunctionDefinition')
    .reduce((constructor, {parameters = {parameters: []}}) => {
      constructor.parameters = mapParameters(parameters.parameters);
      return constructor;
    }, {});
};

const loadInterface = ({nodes}) => {
  return nodes[nodes.length-1].nodes
    .filter(({nodeType, visibility, isConstructor}) => {
      return (nodeType === 'FunctionDefinition'
      || nodeType ===  'VariableDeclaration')
        && visibility === "public"
        && !isConstructor;
    })
    .reduce((functions, {name, stateMutability = "view", nodeType, typeDescriptions = null, parameters = {parameters: []}, returnParameters = {parameters: []}}) => {
      parameters = mapParameters(parameters.parameters);
      returnParameters = mapParameters(returnParameters.parameters);

      if (!returnParameters.count && nodeType === 'VariableDeclaration') {
        returnParameters.push({name: "", type: typeDescriptions.typeString});
      }

      functions[name] = { name, parameters, returnParameters, stateMutability };

      return functions;
    }, {});
};

const mapParameters = parameters => {
  return parameters.map(({name, typeDescriptions: {typeString: type}}) => ({ name, type }));
};

const loadEnums = ({nodes}) => {
  return nodes[nodes.length-1].nodes
    .filter(({nodeType}) => nodeType === 'EnumDefinition')
    .reduce((enums, {name, members = []}) => {
      enums[name] = members.reduce((memberObject, member, index) => {
        memberObject[index] = member.name;
        return memberObject;
      }, {});
      return enums;
    }, {});
}

const loadEvents = ({nodes}) => {
  return nodes[nodes.length-1].nodes
    .filter(({nodeType}) => nodeType === 'EventDefinition')
    .reduce((events, {name, parameters = []}) => {
      parameters = mapParameters(parameters.parameters);
      events[name] = { name, parameters };
      return events;
    }, {});
};

const loadAll = ast => ({
  events: loadEvents(ast),
  structs: loadStructs(ast),
  enums: loadEnums(ast),
  constructor: loadConstructor(ast),
  interface: loadInterface(ast)
});

module.exports = {
  loadConstructor,
  loadInterface,
  loadStructs,
  loadEvents,
  loadEnums,
  loadAll
}