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