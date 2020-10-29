# canvas大富翁

该项目是使用原生js和canvas开发的，复刻经典的大富翁玩法。

## 初始化

### init初始化

- 清除画布-保证最先执行
- 游戏介绍
- 游戏控制changer ：0

	- 0：游戏结束
	- 1：游戏开始

- 初始化顺序
- initOptions
- initPlayer
- initLand
- initTru
- 清除定时器clearInterval

### initMap初始化地图

- drawLand绘制棋格

	- 根据x,y坐标绘制

- drawPlayer绘制角色

	- 绘制在起点🚩

- Dice

	- drawDice绘制色子
	- diceEvent色子事件

### initPlayer初始化角色

- new Player()

	- player玩家控制
	- computer电脑控制

### initOptions初始化游戏选项

- drawOptions绘制游戏选项

	- 开始游戏
	- 选择金额
	- 选择角色

- addEvent添加事件

	- chooseMoney

		- ￥10000~25000

	- choosePlayerName

		- 👼🧔🤴.......

	- start

		- 清除画布
		- initMap
		- 添加click事件

			- 重新开始
			- 托管
			- 棋格信息

		- 添加相关文字

### initLand初始化棋格

- new Land

	- domain地名

		- new Domain()

	- start起点🚩
	- fate命运❓
	- rest休息💤

### initTru初始化托管

- 清除文字
- 清除事件

	- 托管
	- 取消托管

## 数据

### Player角色

- name角色名
- money资金
- state状态
- stop休息日
- control是否玩家控制
- x坐标
- y坐标
- move角色移动方法
- purchase购买土地方法

### Land棋格

- name棋格名
- price价值
- state类型
- owner归属
- color颜色
- x坐标
- y坐标

### Domain土地

- name土地名
- money价格

### gameOption游戏选项

- '开始游戏', '初始资金', '选择角色'

### startMoney启动资金

- 10000, 15000, 20000, 25000

### dice色子

- 1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣

### playerName角色名

- 👼🧔'🤴......

## 核心逻辑

![add image](https://github.com/luo-h-x/monopoly/img/monopoly.png)