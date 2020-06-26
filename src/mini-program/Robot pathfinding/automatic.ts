// function buildGraph(edges: string[]) {
// 	let graph = Object.create(null);
// 	function addEdge(from: string, to: string) {
// 		graph[from] === null ? graph[from] = [to] : graph[from].push(to)
// 	}
// 	for (let [from, to] of  edges.map(r => r.split('-'))) {
// 		addEdge(from, to)
// 		addEdge(to, from)
// 	}
// 	return graph
// }


