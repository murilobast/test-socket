const { Server } = require('ws')

const PORT = 8080

const players = {}

const wss = new Server({ port: PORT }, () => {
	console.log('server started on', PORT)
})

wss.on('connection', (ws) => {
	ws.on('message', (data) => {
		try {
			const playerData = JSON.parse(data);
			players[playerData.playerId] = playerData;
			ws.send(JSON.stringify({ values: Object.values(players) }))
		} catch (e) {
			console.log('ERROR while trying to parse data', e)
		}
	})
})

wss.on('listening', () => {
	console.log('server listening on port', PORT)
})

function doCleanup() {
	console.time('Cleanup')

	const afkPlayers = Object.keys(players).filter(key => {
		const player = players[key]
		const difference = Math.abs(Date.now() - player.timestamp)
		
		return difference > 10000 // More than 1 second afk
	})

	afkPlayers.forEach(key => {
		if (players[afkPlayers]) {
			console.log('Deleting afk player', key)
			delete players[key]
		}
	})

	console.timeEnd('Cleanup')

	setTimeout(doCleanup, 30000)
}

doCleanup()
