const roads = [
	'a-b', 'a-c',
	'a-p', 'b-t',
	'd-e', 'd-t',
	'e-g', 'g-f',
	'g-s', 'm-f',
	'm-p', 'm-s',
	'm-t', 's-t'
]

function buildGraph(edges: string[]) {
	let graph = Object.create(null);
	function addEdge(from: string, to: string) {
		graph[from] == null ? graph[from] = [to] : graph[from].push(to)
	}
	for (let [from, to] of  edges.map(r => r.split('-'))) {
		addEdge(from, to)
		addEdge(to, from)
	}
	return graph
}


const roadGraph = buildGraph(roads)


type Address = string

/**
 * 包裹，含有地址等信息
 */
interface Parcel {
	address: Address;
	place: Address
}

class VillageState {
	place: Address
	parcels: Parcel[]

	constructor(place: string, parcels: Parcel[]) {
		this.place = place
		this.parcels = parcels
	}

	move(destination: string) {
		if (!roadGraph[this.place].includes(destination)) {
			return this
		} else {
			let parcels = this.parcels.map(p => {
				if (p.place !== this.place) {
					return p
				}
				return {
					place: destination,
					address: p.address
				}
			}).filter(p => p.place !== p.address)
			return new VillageState(destination, parcels)
		}
	}

  static random(parcelCount = 5) {
		let parcels: Parcel[] = []
		const roads = Object.keys(roadGraph)
		for(let i= 0; i< parcelCount;i++) {
			let address = randomPick(roads)
			let place: Address
			do {
				place = randomPick(roads)
			}while (place === address)
		}
		return new VillageState('p', parcels)
	}
}


function runRobot(state: VillageState, robot: any, memory?: any) {
	for(let turn = 0; ;turn++) {
		if (state.parcels.length === 0) {
			console.log(`Done in ${turn} turns`);
			break
		}
		let action = robot(state, memory)
		state = state.move(action.direction)
		memory = action.memory
		console.log(`Move to ${action.direction}`)
	}
}


function randomPick(array: any[]) {
	let choice = Math.floor(Math.random() * array.length)
	return array[choice]
}

function randomRobot(state: any) {
	return {
		direction: randomPick(roadGraph[state.place])
	}
}

runRobot(VillageState.random(), randomRobot)
