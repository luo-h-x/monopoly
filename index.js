const canvas = document.querySelector('#canvas')
const brush = canvas.getContext('2d')
console.log(brush)
// 方形
function createRect(color = 'aqua', x, y, w = 40, h = 40, shadow = true) {
	brush.save()
	if (shadow) {
		brush.shadowOffsetX = 10
		brush.shadowOffsetY = 10
		brush.shadowColor = '#ccc'
	}
	brush.fillStyle = color
	brush.fillRect(x, y, w, h)
	brush.restore()
}
// 字体
function createText(text, x, y, size = '20px', color = '#fff', shadow = true) {
	brush.save()
	if (shadow) {
		brush.shadowOffsetX = 2
		brush.shadowOffsetY = 2
		brush.shadowColor = '#000'
	}
	brush.fillStyle = color
	brush.font = size + ' 微软雅黑'
	brush.fillText(text, x, y)
	brush.restore()
}
//清除画布
function clearArea(x, y, w, h) {
	brush.clearRect(x, y, w, h)
}
//角色
let playerName = ['👼', '🧔', '🤴', '👶', '👦', '🧒', '👩', '👨', '🤶', '🎅']
//资金
let startMoney = [10000, 15000, 20000, 25000]
//选项
let gameOption = ['开始游戏', '初始资金', '选择角色']
//色子
let dice = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']
// 玩家
let players = []

function Player(name, index, money, state, stop, control, x, y) {
	this.name = name // 名字
	this.index = index // 顺序
	this.money = money // 金钱
	this.state = state // 状态：活跃或破产
	this.stop = stop // 休息天数
	this.control = control // 是否玩家控制
	this.x = x
	this.y = y
	players.push(this)

	// function dis(index, x, y) {
	// 	let tarX, tarY,targetX,targetY,step =50
	// 	if (y === 100) { // 上面
	// 		if (index * 50 + x >= 650) { //拐弯
	// 			tarX = 650
	// 			// targetY = (index - (650 - x) / 50) * 50 + y
	// 			tarY = (index - (650 - x) / 50) * 50 + y
	// 		} else {
	// 			// targetX = index * 50 + x
	// 			tarX = index * 50 + x
	// 			tarY = 100
	// 		}
	// 	} else if (x === 650) { // 右边
	// 		if (index * 50 + y >= 600) { //拐弯
	// 			// targetX = 650 - (index - (600 - y) / 50) * 50
	// 			tarX = 650 - (index - (600 - y) / 50) * 50
	// 			tarY = 600
	// 		} else {
	// 			tarX = 650
	// 			// targetY = index * 50 + y
	// 			tarY = index * 50 + y
	// 		}
	// 	} else if (y === 600) { //下面
	// 		if (x - index * 50 <= 100) { //拐弯
	// 			tarX = 100
	// 			// targetY = 600 - (index - (x - 100) / 50) * 50
	// 			tarY = 600 - (index - (x - 100) / 50) * 50
	// 		} else {
	// 			tarY = 600
	// 			// targetX = x -index * 50
	// 			tarX = x - index * 50
	// 		}
	// 	} else if (x === 100) { //左边
	// 		if (y - index * 50 <= 100) { //拐弯
	// 			// targetX = x + (index - (y - 100) / 50) * 50
	// 			tarX = x + (index - (y - 100) / 50) * 50
	// 			tarY = 100
	// 		} else {
	// 			tarX = 100
	// 			// targetY = y - index * 50
	// 			tarY = y - index * 50
	// 		}
	// 	}
	// 	return {
	// 		tarX,
	// 		tarY
	// 	}
	// }
	//获取目标位置
	Player.prototype.getDis = function (index) {
		let tarX, tarY
		if (this.y === 100) { // 上面
			if (index * 50 + this.x >= 650) { //拐弯
				tarX = 650
				tarY = (index - (650 - this.x) / 50) * 50 + this.y
			} else {
				tarX = index * 50 + this.x
				tarY = 100
			}
		} else if (this.x === 650) { // 右边
			if (index * 50 + this.y >= 600) { //拐弯
				tarX = 650 - (index - (600 - this.y) / 50) * 50
				tarY = 600
			} else {
				tarX = 650
				tarY = index * 50 + this.y
			}
		} else if (this.y === 600) { //下面
			if (this.x - index * 50 <= 100) { //拐弯
				tarX = 100
				tarY = 600 - (index - (this.x - 100) / 50) * 50
			} else {
				tarY = 600
				tarX = this.x - index * 50
			}
		} else if (this.x === 100) { //左边
			if (this.y - index * 50 <= 100) { //拐弯
				tarX = this.x + (index - (this.y - 100) / 50) * 50
				tarY = 100
			} else {
				tarX = 100
				tarY = this.y - index * 50
			}
		}
		// return {
		// 	tarX,
		// 	tarY
		// }
		this.tarX = tarX
		this.tarY =tarY
	}

	//角色移动
	Player.prototype.move = function() {
		
		let step = 50
		// const {
		// 	tarX,
		// 	tarY
		// } = dis(index, this.x, this.y)
		let land = lands.find(item => (item.x === this.x) && (item.y === this.y))
		const {
			x,
			y,
			color,
			name,
			sojourner
		} = land
		clearArea(this.x, this.y, 40, 40) //清除出发前的
		createRect(color, this.x, this.y) //复原棋格
		if(sojourner) {  //逗留
			createText(sojourner, x , y , '30px', '#000', false)
		} else {
			createText(name, x + 10, y + 25, '20px', '#000', false)
		}
		//目的地
		// this.x = tarX
		if (this.y === 100) { // 上面
			if (this.x >= 650) { //拐弯
				this.x = 650
				this.y += step 
			} else {
				this.x += step
				this.y = 100
			}
		} else if(this.x === 650){
			if(this.y >=600){
				this.y = 600
				this.x -= step
			}else {
				this.x =650
				this.y +=step
			}
		}else if(this.y === 600) {
			if(this.x <=100){
				this.x = 100
				this.y -= step
			}else {
				this.y = 600
				this.x -= step
			}
		} else if(this.x === 100) {
			if(this.y <=100){
				this.y = 100
				this.x += step
			}else {
				this.x = 100
				this.y -=step
			}
		}
		// this.y = tarY
		createText(this.name, this.x, this.y + 30, '30px', '#000', false)
	}

	//购买土地
	Player.prototype.purchase = function() {
		const land = lands.find(item => (item.x === this.x) && (item.y === this.y))
		const {
			price,
			owner,
			state
		} = land
		land.owner = this.name
		this.money -= price
	}
	// 升级土地
	Player.prototype.upgrade = function(){
		const land = lands.find(item => (item.x === this.x) && (item.y === this.y))
		const {
			price,
			owner,
			state,
			cost
		} = land
		this.money -= price
		land.cost +=price / 5
	}
}
// new Player('👦', 0, 10000, 1, 0, true, 100, 100) // 创建角色
// new Player('🐷', 1, 10000, 1, 0, false, 650, 600) // 创建电脑角色
// 棋格
let lands = []
let domains = []

function Domain(name, money) { //土地
	this.name = name
	this.money = money
	this.cost = money / 5
	domains.push(this)
}
new Domain("京", 990)
new Domain("津", 800)
new Domain("冀", 130)
new Domain("晋", 100)
new Domain("内", 300)
new Domain("辽", 400)
new Domain("吉", 120)
new Domain("黑", 310)
new Domain("沪", 380)
new Domain("苏", 160)
new Domain("浙", 320)
new Domain("皖", 240)
new Domain("闽", 180)
new Domain("豫", 150)
new Domain("鄂", 280)
new Domain("湘", 200)
new Domain("粤", 220)
new Domain("桂", 240)
new Domain("琼", 450)
new Domain("蜀", 300)
new Domain("黔", 330)
new Domain("云", 360)
new Domain("渝", 170)
new Domain("藏", 110)
new Domain("陕", 340)
new Domain("甘", 260)
new Domain("青", 180)
new Domain("宁", 180)
new Domain("新", 190)
new Domain("港", 580)
new Domain("澳", 580)
new Domain("台", 580)

function Land(name, price, state, owner, color = 'aqua', x = 0, y = 0) {
	this.name = name // 地名
	this.price = price // 价值
	this.state = state // 状态：特殊事件 / 普通地产的等级
	this.owner = owner // 有无地主 / 特殊棋格
	this.color = color //颜色
	this.cost = 0 // 过路费
	this.x = x //x坐标
	this.y = y //y坐标
	this.sojourner = '' // 逗留者
	lands.push(this)
}

let map1 = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 4, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 3,
	0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 3, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 4,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]
//初始化棋格



// 机会命运
let fates = []

function Fate(text, value, stop) {
	this.text = text // 对应说明
	this.value = value // 金钱变动值
	this.stop = stop // 是否需要休息
	fates.push(this)
}
new Fate("扶老奶奶过马路的事迹被大家知道了，村委会颁发￥1000奖金", 1000, 0)
new Fate("中了彩票，获得头奖￥5000", 5000, 0)
new Fate("在街边被劫匪抢劫，为了保住性命，失去￥3000", -3000, 0)
new Fate("喝了一杯一点点，花费￥30", -30, 0)
new Fate("路边捡到￥500", 500, 0)
new Fate("吃鱼卡到鱼刺，去医院花了￥800", -800, 0)
new Fate("钱包落在出租车里，丢失￥1000", -1000, 0)
new Fate("空闲时间去兼职家教，收获￥2000", 2000, 0)
new Fate("扶老奶奶过马路摔了一跤，买药花了￥100", -100, 0)
new Fate("手机突然坏了，换了部最新款iPhone，花费￥1300", -1300, 0)
new Fate("吃羊肉火锅，花费￥500", -500, 0)
new Fate("去日本看樱花，花费￥2000", -2000, 0)
new Fate("什么也没有发生，除了钱包少了￥800", -800, 0)
new Fate("什么也没有发生, 除了钱包多了￥1000", 1000, 0)
new Fate("在广交会做翻译，获得￥1000", 1000, 0)
new Fate("在校门口发传单，得到￥100", 100, 0)
new Fate("获得三好学生奖学金，奖金￥3000", 3000, 0)
new Fate("抢了个微信红包，获得￥1", 1, 0)
new Fate("梦见得到￥3000奖金，醒来决定花￥50去拜神", -50, 0)
new Fate("获得了￥3000奖金！赶紧花￥500去还愿", 2500, 0)
new Fate("卖闲置赚了￥100", 100, 0)
new Fate("什么也没有发生", 0, 0)
new Fate("看电影花费了￥100", -100, 0)
new Fate("还花呗欠款￥999", -999, 0)
new Fate("一年一度的双十一到了，剁手花了￥2000", -2000, 0)
new Fate("突然很渴想买瓶矿泉水，花费￥5", -5, 0)
new Fate("去工地搬砖赚了￥500", 500, 0)
new Fate("偷税漏税罚款￥1000，休息1日", -1000, 1)
new Fate("超速行驶被罚款￥2000，休息2天", -2000, 2)
new Fate("被查水表发现有违建，罚款￥1000并休息3日", -1000, 3)
new Fate("考试作弊被休息5日", 0, 5)

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
	drawDice() //显示色子
}
// 初始化色子
function initDice() {
	clearArea(800, 270, 100, 50)
	canvas.removeEventListener('click', clickDice)
}
// 初始化
function init() {
	changer = 0 //开始游戏
	order = 0 // 初始化顺序
	initPlayer() //初始化角色
	initLand() //初始化棋格
	initDice() //初始化色子
	initTru() // 初始化托管
	clearInterval(diceT)
	clearInterval(colorT) //清除定时器
	clearArea(0, 0, canvas.width, canvas.height) //清除画布
	introduce() // 简介介绍
	gameOption.forEach((item, index) => { // 初始化游戏选项
		createText(item, 800, 120 + (index * 40), '20px', 'aqua', false)
	})
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
					new Land("❓", 1000, 2, "命运", '#f56c6c', x, y)
					break;
				case 3:
					new Land("💤", 4200, 3, "酒店", '#999', x, y)
					break
				case 4:
					new Land("🚩", 2000, 4, "起点", '#409eff', x, y)
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
//初始化托管
function initTru() {
	clearArea(800, 380, 80, 30)
	canvas.removeEventListener('click', cancelTru)
	canvas.removeEventListener('click', clickTru)
}
// 开始游戏
function start() {
	clearArea(0, 0, 800, 800)
	changer = 1 //开始游戏
	showMessage() // 显示金额
	canvas.removeEventListener('click', clickOption) //移除选项事件
	writeMoney(players[0].money) // 添加默认资金
	writeName(players[0].name) // 添加默认角色
	initMap() // 加载地图
	clearArea(800, 100, 80, 22) //“开始游戏”->“重新开始”
	createText('重新开始', 800, 120, '20px', '#999', false)
	canvas.addEventListener('click', tryAgain) //添加重新开始事件
	createText('游戏开始了', 350, 200, '20px', 'aqua')
	createText('当前行动者:' + players[order].name, 800, 340, '20px', '#999', false)
	createText('开启托管', 800, 400, '20px', '#999', false)
	canvas.addEventListener('click', clickTru) //托管事件
	canvas.addEventListener('click', clickLandMessage) // 显示棋格详细信息事件
}
// 简介介绍
function introduce() {
	createText('欢迎来到lhx自制的大富翁小游戏', 250, 100, '20px', '#999', false)
	createText('玩法说明', 250, 240, '20px', '#999', false)
	createText('◾ 点击色子进行游戏，电脑玩家会自动掷色子', 250, 280, '20px', '#999', false)
	createText('◾ 游戏目标：直到一方玩家破产', 250, 320, '20px', '#999', false)
	createText('◾ 每个棋格都会触发对应事件', 250, 360, '20px', '#999', false)
	createText('◾ 游戏还支持托管，让你解放双手', 250, 400, '20px', '#999', false)
	createText('◾ 点击棋格可显示详细信息', 250, 440, '20px', '#999', false)
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
function writeMoney(num = 10000) {
	clearArea(800, 140, 160, 25)
	// brush.strokeRect(800,140,160,25)
	createText('初始资金: ' + num, 800, 160, '20px', '#999', false)
}
function writeName(name = '👦') {
	clearArea(800, 180, 160, 25)
	createText('选择角色: ' + name, 800, 200, '20px', '#999', false)
}