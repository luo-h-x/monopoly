
// 掷色子
function diceStart() {
	if (changer) {
		let num = Math.floor(Math.random() * 6)
		moveNumber = num
		dice.forEach((item, index) => {
			index === num ?
				createText(item, 800, 300, '30px', 'aqua') : ''
		})
	}
}
//停止色子
function diceStop() {
	let timer1 = setInterval(diceStart, 50)
	let timer2 = setTimeout(function() {
		clearInterval(timer1)
		if (changer) {
			// players[order].getDis(moveNumber + 1) //获取目标位置
			let timer = setInterval(function() {
				players[order].move() //角色移动
			}, 500)
			canvas.removeEventListener('click', clickDice) //角色移动时移除掷色子事件
			let timer3 = setTimeout(function() {
				clearInterval(timer)
				showDialog() // 棋格事件
				gameSequence() // 轮骰顺序
				clearArea(800, 320, 200, 40)
				createText('当前行动者:' + players[order].name, 800, 340, '20px', '#999', false)
				clearTimeout(timer3)
			}, 510 * (moveNumber + 1))
		}
		clearTimeout(timer2)
	}, 2000)
}
// 色子事件
function clickDice(e) {
	const x = e.clientX
	const y = e.clientY
	if (x > 800 && x < 840 && y > 270 && y < 300) {
		diceStop()
	}
}
//托管
function clickTru(e) {
	const x = e.clientX
	const y = e.clientY
	// brush.strokeRect(800,380,80,30)
	if (x > 800 && x < 880 && y > 380 && y < 410) {
		// trusteeship()
		players[0].control = false
		clearArea(800, 380, 80, 30)
		createText('取消托管', 800, 400, '20px', '#999', false)
		showInfo('开启托管', 'green')
		canvas.addEventListener('click', cancelTru)
		canvas.removeEventListener('click', clickTru)

	}
}
//取消托管
function cancelTru(e) {
	const x = e.clientX
	const y = e.clientY
	// brush.strokeRect(800,380,80,30)
	if (x > 800 && x < 880 && y > 380 && y < 410) {
		players[0].control = true
		clearArea(800, 380, 80, 30)
		createText('开启托管', 800, 400, '20px', '#999', false)
		showInfo('取消托管')
		canvas.addEventListener('click', clickTru)
		canvas.removeEventListener('click', cancelTru)
	}
}
// 鼠标移动到选项上时更换鼠标样式
function addMouse(e) {
	const x = e.clientX
	const y = e.clientY
	if (x > 800 && x < 880 && y > 100 && y < 120) {
		canvas.style.cursor = 'pointer'
	} else if (x > 800 && x < 880 && y > 140 && y < 160) {
		canvas.style.cursor = 'pointer'
	} else if (x > 800 && x < 880 && y > 180 && y < 200) {
		canvas.style.cursor = 'pointer'
	} else if (x > 800 && x < 840 && y > 270 && y < 300) {
		canvas.style.cursor = 'pointer'
	} else if (x > 800 && x < 880 && y > 380 && y < 410) {
		canvas.style.cursor = 'pointer'
	} else {
		canvas.style.cursor = 'default'
	}
}
//添加点击事件显示土地信息
function clickLandMessage(e) {
	const clientX = e.clientX
	const clientY = e.clientY
	lands.forEach((item, index) => {
		const {
			name,
			price,
			owner,
			cost,
			x,
			y
		} = item
		if (clientX > x && clientX < x + 40 && clientY > y && clientY < y + 40) {
			clearArea(350, 330, 200, 200)
			// brush.strokeRect(350,330,200,200)
			createText('地名: ' + name, 350, 350, '20px', '#999', false)
			createText('价值: ￥' + price, 350, 390, '20px', '#999', false)
			createText('地主: ' + owner, 350, 430, '20px', '#999', false)
			createText('过路费: ￥' + cost, 350, 470, '20px', '#999', false)
		}
	})
}
//游戏选项
function clickOption(e) {
	const x = e.clientX
	const y = e.clientY
	if (x > 800 && x < 880 && y > 100 && y < 120) { //开始游戏
		start()
	} else if (x > 800 && x < 880 && y > 140 && y < 160) { //选择资金
		chooseMoney()
	} else if (x > 800 && x < 880 && y > 180 && y < 200) { //选择角色
		chooseName()
	}
}
// 重新开始
function tryAgain(e) {
	const x = e.clientX
	const y = e.clientY
	if (x > 800 && x < 880 && y > 100 && y < 120) {
		let isInit = confirm('是否重新开始')
		if (isInit) {
			init()
			canvas.removeEventListener('click', tryAgain) //移除重新开始
			canvas.removeEventListener('click', clickLandMessage)
		} else {
			return
		}

	}

}
//资金选项
function chooseMoney() {
	startMoney.forEach((item, index) => {
		createText(item, 700, 160 + (index * 40), '20px', 'red', false)
	})
	canvas.addEventListener('click', clickMoney)
}
//选择资金
function clickMoney(e) {
	const x = e.clientX
	const y = e.clientY

	function common(money) {
		players.forEach(item => {
			item.money = money
		})
		clearArea(700, 145, 60, 140) // 清除画布
		writeMoney(money) // 选择金额
		canvas.removeEventListener('click', clickMoney) //移除选择金额事件
	}
	startMoney.forEach((item, index) => {
		const dis = 145 + (index * 40)
		if (x > 700 && x < 760 && y > dis && y < dis + 20) {
			common(item)
		}
	})
}
// 角色选项
function chooseName() {
	playerName.forEach((item, index) => {
		createText(item, 760, 100 + (index * 40), '30px', 'red', false)
	})
	canvas.addEventListener('click', clickName)
}
// 选择角色
function clickName(e) {
	const x = e.clientX
	const y = e.clientY

	function common(name) {
		players[0].name = name
		clearArea(760, 70, 40, 400) // 清除画布
		writeName(name) // 选择名字/角色
		canvas.removeEventListener('click', clickName) //移除选择角色事件
	}
	playerName.forEach((item, index) => {
		const dis = 60 + (index * 40) // 角色纵坐标
		if (x > 760 && x < 800 && y > dis && y < dis + 40) {
			common(item)
		}
	})
}
