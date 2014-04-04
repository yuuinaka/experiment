function Stage() {
	this.stageWidth = (window.innerWidth) ? window.innerWidth : document.documentElement.offsetWidth;
	this.stageHeight = (window.innerHeight) ? window.innerHeight : document.documentElement.offsetHeight;
	document.write('<canvas id="stage" width="'+ this.stageWidth +'" height="'+ this.stageHeight +'"></canvas>');
}

function Mouse() {
	this.x = 0; this.y = 0;
}

Mouse.prototype.getMouse = function(e) {
	if (e) {
		this.x = e.pageX;
		this.y = e.pageY;
	} else {
		this.x = event.x + document.body.scrollLeft;
		this.y = event.y + document.body.scrollTop;
	}
}

function Point3D(e_x, e_y, e_z) {
	this.x = e_x; this.y = e_y; this.z = e_z;
	this.fl = 250; this.vpX = 0; this.vpY = 0;
	this.cX = 0; this.cY = 0; this.cZ = 0;
}

Point3D.prototype.setVanishingPoint = function(e_vpX, e_vpY) {
	this.vpX = e_vpX;
	this.vpY = e_vpY;
}

Point3D.prototype.screenX = function() {
	var scale = this.fl / (this.fl + this.z + this.cZ);
	return this.vpX + this.cX + this.x * scale;
}

Point3D.prototype.screenY = function() {
	var scale = this.fl / (this.fl + this.z + this.cZ);
	return this.vpY + this.cY + this.y * scale;
}

Point3D.prototype.rotateX = function(angleX) {
	var cosX = Math.cos(angleX);
	var sinX = Math.sin(angleX);
	var y1 = this.y * cosX - this.z * sinX;
	var z1 = this.z * cosX + this.y * sinX;
	this.y = y1;
	this.z = z1;
}

Point3D.prototype.rotateY = function(angleY) {
	var cosY = Math.cos(angleY);
	var sinY = Math.sin(angleY);
	var x1 = this.x * cosY - this.z * sinY;
	var z1 = this.z * cosY + this.x * sinY;
	this.x = x1;
	this.z = z1;
}

Point3D.prototype.rotateZ = function(angleZ) {
	var cosZ = Math.cos(angleZ);
	var sinZ = Math.sin(angleZ);
	var x1 = this.y * cosZ - this.y * sinZ;
	var y1 = this.z * cosZ + this.x * sinZ;
	this.x = x1;
	this.y = y1;
}

Point3D.prototype.setCenter = function(e_cX, e_cY, e_cZ) {
	this.cX = e_cX;
	this.cY = e_cY;
	this.cZ = e_cZ;
}

function Light() {
	this.x = -100;; this.y = -100; this.z = -100;
	this.brightness = 1;
}

Light.prototype.setBrightness = function(e_b) {
	this.brightness = Math.max(e_b, 0);
	this.brightness = Math.min(this.brightness, 1);
}

Light.prototype.getBrightness = function() {
	return this.brightness;
}

function Triangle(e_a, e_b, e_c, e_color) {
	this.pointA = new Point3D();
	this.pointA = e_a;
	this.pointB = new Point3D();
	this.pointB = e_b;
	this.pointC = new Point3D();
	this.pointC = e_c;
	this.color = e_color;
	this.light = new Light();
}

Triangle.prototype.draw = function() {
/*
// データつくるの大変なので・・・。
    if (this.isBackFace()) {
		return;
	}
*/
    var canvas = document.getElementById("stage");
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
		ctx.lineWidth = 1;
		ctx.moveTo(this.pointA.screenX(), this.pointA.screenY());
		ctx.lineTo(this.pointB.screenX(), this.pointB.screenY());
		ctx.lineTo(this.pointC.screenX(), this.pointC.screenY());
		ctx.lineTo(this.pointA.screenX(), this.pointA.screenY());
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
}

Triangle.prototype.getAdjustedColor = function() {
	var red = this.color >> 16;
	var green = this.color >> 8 & 0xff;
	var blue = this.color & 0xff;
	var lightFactor = this.getLightFactor();
	red *= lightFactor;
	green *= lightFactor;
	blue *= lightFactor;
	return red << 16 | green << 8 | blue;
}

Triangle.prototype.getLightFactor = function() {
	var ab = new Object();
	ab.x = this.pointA.x - this.pointB.x;
	ab.y = this.pointA.y - this.pointB.y;
	ab.z = this.pointA.z - this.pointB.z;		
	var bc = new Object();
	bc.x = this.pointB.x - this.pointC.x;
	bc.y = this.pointB.y - this.pointC.y;
	bc.z = this.pointB.z - this.pointC.z;
	var norm = new Object();
	norm.x = (ab.y * bc.z) - (ab.z * bc.y);
	norm.y = - ((ab.x * bc.z) - (ab.z * bc.x));
	norm.z = (ab.x * bc.y) - (ab.y * bc.x);
	var dotProd = norm.x * this.light.x + norm.y * this.light.y + norm.z * this.light.z;
	var normMag = Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
	var lightMag = Math.sqrt(this.light.x * this.light.x + this.light.y * this.light.y + this.light.z * this.light.z);
	return (Math.acos(dotProd / (normMag * lightMag)) / Math.PI) * this.light.brightness;
}

Triangle.prototype.isBackFace = function() {
	// http://www.jurjans.lv/flash/shape.html
	var cax = this.pointC.screenX() - this.pointA.screenX();
	var cay = this.pointC.screenY() - this.pointA.screenY();
	var bcx = this.pointB.screenX() - this.pointC.screenX();
	var bcy = this.pointB.screenY() - this.pointC.screenY();
	return cax * bcy > cay * bcx;
}

Triangle.prototype.depth = function() {
	var zpos = Math.min(this.pointA.z, this.pointB.z);
	zpos = Math.min(zpos, this.pointC.z);
	return zpos;
}

function Model() {
	this.points = new Array();
	this.triangles = new Array();
}

Model.prototype.set = function(vpX, vpY, depth) {
	for(var i = 0; i < this.points.length; i++) {
		this.points[i].setVanishingPoint(vpX, vpY);
		this.points[i].setCenter(0, 0, depth);		
	}
}

Model.prototype.rotate = function(angleX, angleY, offsetX, offsetY, depth) {
	for (var i = 0; i < this.points.length; i++) {		
		var point = this.points[i];
		point.rotateX(angleX);
		point.rotateY(angleY);
		this.points[i].setCenter(offsetX, offsetY, depth);
	}
}

Model.prototype.draw = function() {
	for(i = 0; i < this.triangles.length; i++) {
		this.triangles[i].draw();
	}
}

var stage = new Stage();
var mouse = new Mouse();

var fl = 250;
var vpX = stage.stageWidth/2;
var vpY = stage.stageHeight/2;
var offsetX = 0;
var offsetY = 0;
var angleX = 0;
var angleY = 0;
var depth = -200;
var mv = 0;

var model_h = new Model();

model_h.points[0] = new Point3D(-200, -300, -50);
model_h.points[1] = new Point3D(-100, -300, -50);
model_h.points[2] = new Point3D(-100, -50, -50);
model_h.points[3] = new Point3D(100, -50, -50);
model_h.points[4] = new Point3D(100, -300, -50);
model_h.points[5] = new Point3D(200, -300, -50);
model_h.points[6] = new Point3D(200, -50, -50);
model_h.points[7] = new Point3D(200, 50, -50);
model_h.points[8] = new Point3D(200, 300, -50);
model_h.points[9] = new Point3D(100, 300, -50);
model_h.points[10] = new Point3D(100, 50, -50);
model_h.points[11] = new Point3D(-100, 50, -50);
model_h.points[12] = new Point3D(-100, 300, -50);
model_h.points[13] = new Point3D(-200, 300, -50);
model_h.points[14] = new Point3D(-200, 50, -50);
model_h.points[15] = new Point3D(-200, -50, -50);
model_h.points[16] = new Point3D(-200, -300, 50);
model_h.points[17] = new Point3D(-100, -300, 50);
model_h.points[18] = new Point3D(-100, -50, 50);
model_h.points[19] = new Point3D(100, -50, 50);
model_h.points[20] = new Point3D(100, -300, 50);
model_h.points[21] = new Point3D(200, -300, 50);
model_h.points[22] = new Point3D(200, -50, 50);
model_h.points[23] = new Point3D(200, 50, 50);
model_h.points[24] = new Point3D(200, 300, 50);
model_h.points[25] = new Point3D(100, 300, 50);
model_h.points[26] = new Point3D(100, 50, 50);
model_h.points[27] = new Point3D(-100, 50, 50);
model_h.points[28] = new Point3D(-100, 300, 50);
model_h.points[29] = new Point3D(-200, 300, 50);
model_h.points[30] = new Point3D(-200, 50, 50);
model_h.points[31] = new Point3D(-200, -50, 50);

model_h.set(vpX, vpY, depth);

model_h.triangles[0] = new Triangle(model_h.points[0], model_h.points[1], model_h.points[2], "rgba(0, 255, 0, 0.4)");

model_h.triangles[1] = new Triangle(model_h.points[2], model_h.points[3], model_h.points[10], "rgba(0, 255, 0, 0.4)");
model_h.triangles[2] = new Triangle(model_h.points[3], model_h.points[4], model_h.points[6], "rgba(0, 255, 0, 0.4)");
model_h.triangles[3] = new Triangle(model_h.points[4], model_h.points[5], model_h.points[6], "rgba(0, 255, 0, 0.4)");
model_h.triangles[4] = new Triangle(model_h.points[6], model_h.points[7], model_h.points[3], "rgba(0, 255, 0, 0.4)");
model_h.triangles[5] = new Triangle(model_h.points[7], model_h.points[8], model_h.points[10], "rgba(0, 255, 0, 0.4)");
model_h.triangles[6] = new Triangle(model_h.points[8], model_h.points[9], model_h.points[10], "rgba(0, 255, 0, 0.4)");
model_h.triangles[7] = new Triangle(model_h.points[10], model_h.points[3], model_h.points[7], "rgba(0, 255, 0, 0.4)");
model_h.triangles[8] = new Triangle(model_h.points[10], model_h.points[11], model_h.points[2], "rgba(0, 255, 0, 0.4)");
model_h.triangles[9] = new Triangle(model_h.points[11], model_h.points[12], model_h.points[14], "rgba(0, 255, 0, 0.4)");
model_h.triangles[10] = new Triangle(model_h.points[12], model_h.points[13], model_h.points[14], "rgba(0, 255, 0, 0.4)");
model_h.triangles[11] = new Triangle(model_h.points[14], model_h.points[15], model_h.points[11], "rgba(0, 255, 0, 0.4)");
model_h.triangles[12] = new Triangle(model_h.points[15], model_h.points[2], model_h.points[11], "rgba(0, 255, 0, 0.4)");
model_h.triangles[13] = new Triangle(model_h.points[15], model_h.points[0], model_h.points[2], "rgba(0, 255, 0, 0.4)");

var light = new Light();
for (i = 0; i < model_h.triangles.length; i++) {
	model_h.triangles[i].light = light;
}

window.document.onmousemove = function(e){
	mouse.getMouse(e);
}

var mainloop = setInterval(function(){

	if (depth < 500) {		
		mv += 4;
		depth += mv;
	} else {		
		mv = 100;
		angleX = (mouse.y - vpY) * 0.001;
		angleY = (mouse.x - vpX) * 0.001;
	}
	
	model_h.rotate(angleX, angleY, offsetX, offsetY, depth);

/*
	var canvas = document.getElementById("stage");
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, stage.stageWidth, stage.stageHeight);
	}	
*/
    
    	var cR = Math.floor(Math.random() * 255);
	var cG = Math.floor(Math.random() * 20);
	var cB = Math.floor(Math.random() * 20);
    
	for (var i = 0; i < model_h.triangles.length; i++) {
		model_h.triangles[i].color = "rgba("+ cR +", "+ cG +", "+ cB +", 0.4)";
	}
	
	model_h.draw();
	
},1000/60);
