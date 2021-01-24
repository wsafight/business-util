// getTreeShapeSelectItems (withRoot, disableProp) {
//   const visitNode = function (node, level, structure) {
//     const item = {id: node.id, name: node.name, nameWithLevel: '　'.repeat(level) + node.name}
//     if (typeof disableProp === 'function') {
//       item.disableProp = disableProp(node)
//     } else if (typeof disableProp === 'string') {
//       item.disableProp = node[disableProp]
//     }
//     structure.push(item)
//     if (node.children) {
//       for (let i = 0, len = node.children.length; i < len; i++) {
//         visitNode(node.children[i], level + 1, structure)
//       }
//     }
//     return structure
//   }
//   const treeStructure = visitNode(this.getRootItems()[0], 0, [])
//   if (!withRoot) {
//     treeStructure.splice(0, 1)
//   }
//   return treeStructure
// }
//
//
// function getTreeShape() {
//
// }
