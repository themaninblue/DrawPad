
var MAX_LINE_WIDTH = 2
var MIN_LINE_WIDTH = 0.4;
var MAX_VELOCITY = 10;
var MOVE_Z = 40;
var MOVE_TIME = 20;
var DISPLAY_TIME = 5;
var FINAL_X = 50;
var FINAL_Y = -38;
var FINAL_Z = 510;
var FPS = 60;
var COLORS = [
	{foreground: {r: 255, g: 100, b: 100}, background: {r: 170, g: 0, b: 0}},
	{foreground: {r: 255, g: 204, b: 0}, background: {r: 255, g: 102, b: 0}},
	{foreground: {r: 234, g: 255, b: 89}, background: {r: 143, g: 195, b: 4}},
	{foreground: {r: 81, g: 216, b: 255}, background: {r: 6, g: 121, b: 218}},
	{foreground: {r: 224, g: 118, b: 255}, background: {r: 121, g: 6, b: 218}}
];
var DATA_REFRESH_TIME = 5000;

var colorCount = 0;
var canvases = [];

$(init);

function init() {
	getData();
}

function getData() {
	$.getJSON('data.json', writeData);
}

function writeData(data) {
	var first = true;
	
	if (canvases.length > 0) {
		first = false;
	}
	
	for (var i = 0; i < data.length; i++) {
		canvases.push(data[i]);
	}
	
	if (first && canvases.length > 0) {
		drawCanvas();
	}
}

function drawCanvas() {
	var LOOP = true;
	
	var backgroundColor = 'rgb(' + COLORS[colorCount].background.r + ',' + COLORS[colorCount].background.g + ',' + COLORS[colorCount].background.b + ')';
	document.body.style.backgroundColor = backgroundColor;
	
	var foregroundR = COLORS[colorCount].foreground.r;
	var foregroundG = COLORS[colorCount].foreground.g;
	var foregroundB = COLORS[colorCount].foreground.b;
	
	if (++colorCount >= COLORS.length) {
		colorCount = 0;
	}
	
	var container = document.createElement('div');
	document.body.appendChild(container);

	var scene = new THREE.Scene();

	var camera = new THREE.Camera(10, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = -300;
	camera.position.y = 0;
	camera.position.z = 800;
	camera.target.position.x = FINAL_X;
	camera.target.position.y = FINAL_Y;
	camera.target.position.z = 50;
	camera.up.x = 1;
	camera.up.y = -1;
	
	if (Math.random() > 0.5) {
		camera.position.x = 1000;
		camera.position.y = -80;
	}
	
	var canvas = null;
	
	for (var i = canvases.length - 1; i >= 0; i--) {
		if (typeof canvases[i].displayed == 'undefined' || canvases[i].displayed == false) {
			canvas = canvases[i];
			
			break;
		}
	}
	
	if (canvas == null) {
		for (var i = canvases.length - 1; i >= 0; i--) {
			canvases[i].displayed = false;
		}
		
		canvas = canvases[canvases.length - 1];
	}
	
	canvas.displayed = true;
	
	var paths = canvas.paths;

	var canvasStartTime = paths[0][0].t;
	var canvasEndTime = paths[0][paths[0].length - 1].t;
	
	for (var i = 1; i < paths.length; i++) {
		canvasEndTime = Math.max(canvasEndTime, paths[i][paths[i].length - 1].t);
	}

	var canvasTotalTime = canvasEndTime - canvasStartTime;

	for (var k = 0; k < paths.length; k++) {
		var points = paths[k];
	
		var prevLineWidth = MAX_LINE_WIDTH;
	
		for (var i = 0; i < points.length; i++) {
			var material = new THREE.ParticleCircleMaterial({color: 255 << 24 | i / points.length * (255 - foregroundR) + foregroundR << 16 | i / points.length * (255 - foregroundG) + foregroundG << 8 | i / points.length * (255 - foregroundB) + foregroundB});
			var pointDistance = 0;
			var lineWidth = prevLineWidth;
			var delayTime = i * 40;
			
			if (i > 0) {
				pointDistance = Math.sqrt(Math.pow(points[i].x - points[i - 1].x, 2) + Math.pow(points[i].y - points[i - 1].y, 2));
				var lineWidth = Math.max(MIN_LINE_WIDTH, (MAX_VELOCITY - pointDistance) / MAX_VELOCITY * MAX_LINE_WIDTH);
	
				if (Math.abs(lineWidth - prevLineWidth) > 0.1) {
					lineWidth = prevLineWidth + (lineWidth - prevLineWidth) / Math.abs(lineWidth - prevLineWidth) * 0.1;
				}
			}
			
			if (pointDistance > 0) {
				if (pointDistance / 5 / lineWidth > 1) {
					var segments = Math.round(pointDistance / 5 / lineWidth);
	
					for (var j = 1; j < segments; j++) {
						particle = new THREE.Particle(material);
						particle.position.x = (points[i - 1].x + (points[i].x - points[i - 1].x) / segments * j) / 10;
						particle.position.y = -(points[i - 1].y + (points[i].y - points[i - 1].y) / segments * j) / 10;
						particle.position.z = (i - 1) / points.length * MOVE_Z + j / segments * MOVE_Z / points.length;
						particle.scale.x = particle.scale.y = lineWidth;
						
						setTimeout(function(particle) {
							return function() {
								scene.addObject(particle);
							}
						}(particle),  (points[i].t - canvasStartTime) / canvasTotalTime * MOVE_TIME * 1000 + Math.random() * 40);
					}
				}
			}
			
			particle = new THREE.Particle(material);
			particle.position.x = points[i].x / 10;
			particle.position.y = -points[i].y / 10;
			particle.position.z = i / points.length * MOVE_Z;
			particle.scale.x = particle.scale.y = lineWidth;
			
			setTimeout(function(particle) {
				return function() {
					scene.addObject(particle);
				}
			}(particle), (points[i].t - canvasStartTime) / canvasTotalTime * MOVE_TIME * 1000);
	
			prevLineWidth = lineWidth;
		}
	}

	var renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	JSTweener.addTween(camera.position, {
		time: MOVE_TIME,
		transition: 'easeOutSine',
		y: FINAL_Y,
		onUpdate: function(originalX, originalY, originalZ) {
			var controlPointX = 1000;
			
			if (originalX > 0) {
				controlPointX = -600;
			}
			
			camera.position.x = JSTweener.Utils.bezier2((camera.position.y - originalY) / (FINAL_Y - originalY), originalX, controlPointX, FINAL_X);
			camera.position.z = JSTweener.Utils.bezier2((camera.position.y - originalY) / (FINAL_Y - originalY), originalZ, -1000, FINAL_Z);
		},
		onUpdateParams: [camera.position.x, camera.position.y, camera.position.z]
	});
	  
	JSTweener.addTween(camera.target.position, {
		time: MOVE_TIME,
		transition: 'easeOutSine',
		z: 0
	});
	  
	JSTweener.addTween(camera.up, {
		time: MOVE_TIME,
		transition: 'easeOutSine',
		x: 0,
		y: 1,
		onComplete: function() {
			LOOP = false;
			
			$('h1')
				.animate({opacity: 1}, 1500);

			$('canvas')
				.animate({opacity: 0}, DISPLAY_TIME * 1000 * 2, function() {
					$(this).remove();
				})
			
			setTimeout(function() {
				drawCanvas();
			}, DISPLAY_TIME * 1000);

			setTimeout(function() {
				$('h1')
					.animate({opacity: 0}, 1500);
			}, DISPLAY_TIME * 1.3 * 1000);
		}
	});
	  
	var timer = setInterval(loop, 1000 / FPS);
	
	function loop() {
		if (!LOOP) {
			clearTimeout(timer);
		}
		
		renderer.render(scene, camera);
	}
}