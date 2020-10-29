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