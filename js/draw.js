
var CANVAS_WIDTH = 0;
var CANVAS_HEIGHT = 0;
var MAX_LINE_WIDTH = 30;
var MIN_LINE_WIDTH = 3;
var MAX_VELOCITY = 10;
var context = null;

$(init);

var paths = [];

function init() {
	CANVAS_WIDTH = $(window).width();
	CANVAS_HEIGHT = $(window).height();
	
	var canvas = document.createElement('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	document.body.appendChild(canvas);
	
	context = canvas.getContext('2d');
	context.fillStyle = '#ffffff';
	context.strokeStyle = '#ffffff';
	context.lineWidth = MAX_LINE_WIDTH;
	context.lineCap = 'round';
	context.lineJoin = 'miter';
	
	canvas.addEventListener('touchmove', touchMove, false);
	canvas.addEventListener('touchstart', touchStart, false);
	canvas.addEventListener('touchend', touchEnd, false);
	
	$('#refresh').click(function() {
		$(canvas).animate({opacity: 0}, 500, function() {
			context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
			paths = [];
			
			$(canvas).css('opacity', 1);
		});
		
		$('#saved').animate({opacity: 0}, 500, function() {
			$(this).remove();
		});
	
		return false;
	});

	$('#submit').click(function(){
		if (confirm('Save this canvas?')) {
			$('#saved').remove();
			
			$(canvas).animate({opacity: 0.2}, 2000);

			var serial = '{"paths":[';
			
			for (var i = 0; i < paths.length; i++) {
				if (i > 0) {
					serial += ',';
				}
				
				serial += '[';
				
				for (var j = 0; j < paths[i].points.length; j++) {
					if (j > 0) {
						serial += ',';
					}
					
					serial += '{"x":' + paths[i].points[j].x + ',"y":' + paths[i].points[j].y + ',"t":' + paths[i].points[j].timestamp + '}';
				}
				
				serial += ']';
			}
			
			serial += ']}';

			$.ajax('http://someurl.com/?blah=blah', {type: 'POST', contentType: 'application/json', dataType:'json', processData: false, cache: false, data: serial, success: function() {
				var saved = $('<div id="saved">Saved!</div>')
					.appendTo('body')
			}});
		}
		
		return false;
	});

	setInterval(draw, 20);
}

function touchStart(event) {
	event.preventDefault();

	for (var i = 0; i < event.touches.length; i++) {
		paths.push({
			id: event.touches[i].identifier,
			points: [{
				x: event.touches[i].pageX,
				y: event.touches[i].pageY,
				timestamp: new Date().getTime(),
				drawn: false
			}],
			complete: false
		});
	}
}

function touchEnd(event) {
	event.preventDefault();

	for (var i = 0; i < event.changedTouches.length; i++) {
		for (var j = 0; j < paths.length; j++) {
			if (paths[j].id == event.changedTouches[i].identifier) {
				paths[j].id = null;
				paths[j].complete = true;
			}
		}
	}
}

function touchMove(event) {
	event.preventDefault();

	for (var i = 0; i < event.touches.length; i++) {
		for (var j = 0; j < paths.length; j++) {
			if (paths[j].id == event.touches[i].identifier) {
				paths[j].points.push({
					x: event.touches[i].pageX,
					y: event.touches[i].pageY,
					drawn: false,
					timestamp: new Date().getTime()
				});
			}
		}
	}
}

function draw() {
	// Limit the amount of time allowed for a draw to take place
	var DRAW_TIME_THRESHOLD = 10;
	var start = new Date();
	
	for (var i = 0; i < paths.length && new Date() - start < DRAW_TIME_THRESHOLD; i++) {
		var firstPoint = true;
		var points = paths[i].points;
		
		if (points.length > 1 && points[points.length - 1].drawn == false) {
			var prevLineWidth = MAX_LINE_WIDTH;
			
			context.beginPath();
	
			for (var j = 1; j < points.length; j++) {
				var pointDistance = Math.sqrt(Math.pow(points[j].x - points[j - 1].x, 2) + Math.pow(points[j].y - points[j - 1].y, 2));
				var lineWidth = Math.max(MIN_LINE_WIDTH, (MAX_VELOCITY - pointDistance) / MAX_VELOCITY * MAX_LINE_WIDTH);
				
				if (Math.abs(lineWidth - prevLineWidth) > 1) {
					lineWidth = prevLineWidth + (lineWidth - prevLineWidth) / Math.abs(lineWidth - prevLineWidth);
				}
				
				lineWidth = Math.round(lineWidth);
				
				if (firstPoint && points[j].drawn == false) {
					firstPoint = false;
					
					context.moveTo(points[j - 1].x, points[j - 1].y);
					points[j - 1].drawn = true;

					context.lineWidth = lineWidth;
					context.lineTo(points[j].x, points[j].y);
				}
				else if (points[j].drawn == false) {
					var pointDistance = Math.sqrt(Math.pow(points[j].x - points[j - 1].x, 2) + Math.pow(points[j].y - points[j - 1].y, 2));
					context.lineWidth = lineWidth;
					context.lineTo(points[j].x, points[j].y);
				}
				
				prevLineWidth = lineWidth;
				
				points[j].drawn = true;
			}
	
			context.stroke();
			context.closePath();
		}
		else if (paths[i].complete && points[0].drawn == false) {
			context.arc(points[0].x, points[0].y, MAX_LINE_WIDTH / 2, 0, Math.PI * 2, false);
			context.closePath();
			context.fill();
			
			points[0].drawn = true;
		}
	}
}

function debug(text, append) {
	var debug = document.getElementById('debug');
	
	if (typeof append != 'undefined' && append) {
		debug.innerHTML += text;
	}
	else {
		debug.innerHTML = text;
	}
}
