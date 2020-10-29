//角色显示
function drawPlayer() {
	players.forEach(item => {
		const {
			name,
			x,
			y
		} = item
		// name != '🐷' ? item.position = 0 : item.position = 42
		clearArea(x, y, 50, 50)
		createRect('#409eff', x, y)
		createText(name, x, y + 30, '30px')
	})
}
//显示提示信息
function showInfo(text = '提示信息', color = 'red') {
	clearArea(150, 0, 1200, 40)
	createText(players[order].name + text, 150, 30, '30px', color, false)
	let timer = setTimeout(function() {
		clearArea(150, 0, 1200, 40)
		clearTimeout(timer)
	}, 2000)
}
// 绘制地图
function drawMap() {
	lands.forEach((item, index) => {
		const {
			name,
			x,
			y,
			color
		} = item
		switch (item.state) { // 绘制棋格
			case 1:
				createRect(color, x, y)
				createText(name, x + 10, y + 25, '20px', '#000', false)
				break;
			case 2:
				createRect(color, x, y)
				createText(name, x + 10, y + 25)
				break;
			case 3:
				createRect(color, x, y)
				createText(name, x + 5, y + 25)
				break
			case 4:
				createRect(color, x, y)
				createText(name, x + 10, y + 25)
				break
		}
	})
}
// 棋格事件
function showDialog() {
	const {
		x,
		y
	} = players[order]
	const land = lands.find(item => (item.x === x) && (item.y === y))
	const {
		owner,
		state,
		name,
		price,
		cost
	} = land

	if (state === 1) { // 土地
		if (owner === '') {
			let ispurchase
			if (players[order].control) {
				ispurchase = confirm(`是否购买价值 ￥${price} 的 ${name} `)
			} else {
				ispurchase = true
			}
			if (ispurchase) {
				players[order].purchase() //购买土地
				showOwner()
				// landRank()
				showMessage()
				showInfo('购买成功', 'green')
			} else {
				showInfo('购买失败')
			}
		} else if (owner != players[order].name) { // 过路费
			players[order].money -= cost
			let player = players.find(item => item.name === owner)
			player.money += cost
			showMessage()
			showInfo('支付过路费￥' + cost)
		} else if (owner === players[order].name) { // 升级土地
			if (players[order].control) {
				ispurchase = confirm(`是否升级当前土地 `)
			} else {
				ispurchase = true
			}
			if (ispurchase) {
				players[order].upgrade() // 升级土地
				landRank()
				showMessage()
				showInfo('升级成功', 'green')
			} else {
				showInfo('升级失败')
			}
		}
	} else if (state === 2) {
		const num = generateNum(0, fates.length)
		const {
			text,
			value,
			stop
		} = fates[num]
		players[order].money += value
		players[order].stop = stop
		showMessage()
		showInfo(text)
	} else if (state === 3) {
		players[order].stop = 1
		showInfo('感觉身体疲惫，需要休息1天')
	} else if (state === 4) {
		players[order].money += 1000
		showMessage()
		showInfo('恭喜获得￥1000')
	}

	checkBankrupt()
}
// 生成随机数
function generateNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}
// 获取x,y坐标
function getP(index) {
	let x = index % 13 * 50 + 50
	let y = parseInt(index / 13) * 50 + 50
	return {
		x,
		y
	}
}
//购买土地显示归属者
function showOwner() {
	const {
		name,
		x,
		y
	} = players[order]
	if (y === 100) {
		createText(name, x + 5, y - 10, '20px', '#fff', false)
	} else if (x === 650) {
		createText(name, x + 50, y + 30, '20px', '#fff', false)
	} else if (y === 600) {
		createText(name, x + 5, y + 70, '20px', '#fff', false)
	} else if (x === 100) {
		createText(name, x - 35, y + 25, '20px', '#fff', false)
	}
}
//显示金额
function showMessage() {
	players.forEach((item, index) => {
		clearArea(200 + index * 300, 250, 100, 100)
		createText(item.name, 200 + index * 300, 250, '20px', '#999')
		createText('￥' + item.money, 200 + index * 300, 280, '20px', '#999', false)
	})
}
//破产判断
function checkBankrupt() {
	if (players[order].money < 0) {
		if (players[order].name != '🐷') {
			changer = 0
			order = 0
			alert(`${players[order].name}破产了，游戏结束,很遗憾你没有获胜`)
		} else {
			changer = 0
			order = 0
			alert('🐷破产了，游戏结束,恭喜你获胜')
		}
	}
}
// 显示土地等级
function landRank() {
	let land = lands.find(item => item.x === players[order].x && item.y === players[order].y)
	const {
		x,
		y,
		cost,
		price
	} = land
	// console.log(land)
	let level = cost / (price / 5)
	if (y === 100) {
		clearArea(x + 25, y - 40, 10, 10)
		// createRect('#000',x+25,y-40,10,10,false)
		createText(level, x + 25, y - 30, '10px', 'red', false)
	} else if (x === 650) {
		clearArea(x + 70, y, 10, 10)
		// createRect('#000',x+70,y,10,10,false)
		createText(level, x + 70, y + 10, '10px', 'red', false)
	} else if (y === 600) {
		clearArea(x + 35, y + 50, 10, 10)
		// createRect('#000',x+35,y+ 50,10,10,false)
		createText(level, x + 35, y + 60, '10px', 'red', false)
	} else if (x === 100) {
		clearArea(x - 15, y - 5, 10, 10)
		// createRect('#000',x-15,y-5,10,10,false)
		createText(level, x - 15, y + 5, '10px', 'red', false)
	}
}
// 轮骰顺序
function gameSequence() {
	order = order === 0 ? 1 : 0
	if (checkStop()) {
		order = order === 0 ? 1 : 0
	}
	if (order === 0) {
		canvas.addEventListener('click', clickDice)
		if (!players[order].control) {
			diceStop()
		}
	} else {
		canvas.removeEventListener('click', clickDice)
		diceStop()
	}
}
// 判断轮到的下个玩家是否处在停止状态
function checkStop() {
	let {
		name,
		stop
	} = players[order]
	if (stop) {
		showInfo(`需要休息${stop}天`)
		players[order].stop -= 1
		return true
	}

}
