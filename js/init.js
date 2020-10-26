let diceT = 0 //色子定时器
let colorT = 0 //颜色定时器
let moveNumber = 0 // 色子数
let changer = 0 // 控制游戏开始/结束
let order = 0 //当前行动角色
init()
//初始化角色
function initPlayer() {
	players = []
	new Player('👦', 0, 10000, 1, 0, true, 100, 100) // 创建角色
	new Player('🐷', 1, 10000, 1, 0, false, 650, 600) // 创建电脑角色
}
// 初始化地图
function initMap() {
	drawMap() // 绘制棋格
	drawPlayer() //显示角色
	createText('游戏开始了', 350, 200, '20px', 'aqua')
	createText('当前行动者:' + players[order].name, 800, 340, '20px', '#999', false)
	drawDice() //显示色子
}
// 初始化色子
function initDice() {
	clearArea(800, 270, 100, 50)
	canvas.removeEventListener('click', clickDice)
}
// 初始化
function init() {
	changer = 0
	order = 0
	initPlayer()
	initLand()
	initDice()
	initTru()
	clearInterval(diceT)
	clearInterval(colorT) //清除定时器
	clearArea(0, 0, canvas.width, canvas.height) //重新->开始
	gameOption.forEach((item, index) => { // 初始化游戏选项
		createText(item, 800, 120 + (index * 40), '20px', 'aqua', false)
	})
	introduce() // 简介介绍
	canvas.addEventListener('click', clickOption) //游戏选项事件
	canvas.addEventListener('mousemove', addMouse) //鼠标事件
}
//初始化棋格
function initLand() {
	lands = []
	map1.forEach((item, index) => { // 创建棋格对象
		if (item > 0) {
			const {
				x,
				y
			} = getP(index)
			switch (item) {
				case 1:
					new Land('name', 9000, 1, "", 'aqua', x, y)
					break;
				case 2:
					new Land("❓", 1000, 2, "", '#f56c6c', x, y)
					break;
				case 3:
					new Land("💤", 4200, 3, "", '#999', x, y)
					break
				case 4:
					new Land("🚩", 2000, 4, "", '#409eff', x, y)
					break
			}
		}
	})
	// for (let i = 1; i < domains.length; i++) {
	//     const random = Math.floor(Math.random() * (i + 1));
	//     [domains[i], domains[random]] = [domains[random], domains[i]];
	// }
	let a = 0
	lands.forEach((item, index) => { // 土地名/价值
		if (item.state === 1) {
			item.name = domains[a].name
			item.price = domains[a].money
			item.cost = domains[a].cost
			a++
		}
	})
}
//显示色子
function drawDice() {
	changeColor() // 绘制‘🔻点击开始出发’
	colorT = setInterval(changeColor, 2000) //改变颜色
	createText('6️⃣', 800, 300, '30px', 'aqua')
	canvas.addEventListener('click', clickDice) // 掷色子事件
	function changeColor() {
		let color = '#' + (~~(Math.random() * (1 << 24))).toString(16)
		createText('🔻点击开始出发', 800, 260, '20px', color, false)
	}
}
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
			players[order].getDis(moveNumber+1) //获取目标位置
			let	timer = setInterval(function(){
				players[order].move() //角色移动
			},500)
			canvas.removeEventListener('click',clickDice ) //角色移动时移除掷色子事件
			let timer3 = setTimeout(function() {
				clearInterval(timer)
				showDialog() // 棋格事件
				gameSequence() // 轮骰顺序
				clearArea(800, 320, 200, 40)
				createText('当前行动者:' + players[order].name, 800, 340, '20px', '#999', false)
				clearTimeout(timer3)
			}, 510*(moveNumber+1))
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
//初始化托管
function initTru() {
	clearArea(800, 380, 80, 30)
	canvas.removeEventListener('click', cancelTru)
	canvas.removeEventListener('click', clickTru)
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

// 轮骰顺序
function gameSequence() {
	order = order === 0 ? 1 : 0
	if (checkStop()) {
		order = order === 0 ? 1 : 0
	}
	if (order === 0) {
		canvas.addEventListener('click', clickDice)
		if(!players[order].control) {
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

function writeMoney(num = 10000) {
	clearArea(800, 140, 160, 25)
	// brush.strokeRect(800,140,160,25)
	createText('初始资金: ' + num, 800, 160, '20px', '#999', false)
}

function writeName(name = '👦') {
	clearArea(800, 180, 160, 25)
	createText('选择角色: ' + name, 800, 200, '20px', '#999', false)
}
// 开始游戏
function start() {
	clearArea(0,0,800,800)
	changer = 1
	showMessage()
	canvas.removeEventListener('click', clickOption) //移除选项事件
	writeMoney(players[0].money) // 添加默认资金
	writeName(players[0].name) // 添加默认角色
	initMap() // 加载地图
	clearArea(800, 100, 80, 22) //开始->重新
	createText('重新开始', 800, 120, '20px', '#999', false)
	canvas.addEventListener('click', tryAgain) //添加重新开始事件
	createText('开启托管',800,400,'20px','#999',false)
	canvas.addEventListener('click',clickTru)
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
		init()
		canvas.removeEventListener('click', tryAgain) //移除重新开始
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
	} else {
		canvas.style.cursor = 'default'
	}
}
// 简介介绍
function introduce(){
	createText('欢迎来到大富翁',350,100,'20px','#999',false)
	createText('玩法说明',380,240,'20px','#999',false)
	createText('❕ 点击色子进行游戏，电脑玩家会自动掷色子',250,280,'20px','#999',false)
	createText('❕ 游戏目标：直到一方玩家破产',250,320,'20px','#999',false)
	createText('❕ 每个棋格都会触发对应事件',250,360,'20px','#999',false)
	createText('❕ 游戏还支持托管，让你解放双手',250,400,'20px','#999',false)
}