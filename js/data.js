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
