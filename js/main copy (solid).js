
var MAX_LINE_WIDTH = 2
var MIN_LINE_WIDTH = 0.4;
var MAX_VELOCITY = 10;

var canvas = [[{x: 67, y: 318}, {x: 72, y: 308}, {x: 73, y: 305}, {x: 75, y: 303}, {x: 80, y: 298}, {x: 83, y: 295}, {x: 85, y: 292}, {x: 89, y: 288}, {x: 91, y: 285}, {x: 94, y: 282}, {x: 96, y: 279}, {x: 100, y: 275}, {x: 102, y: 272}, {x: 105, y: 269}, {x: 107, y: 265}, {x: 109, y: 263}, {x: 112, y: 260}, {x: 114, y: 256}, {x: 117, y: 252}, {x: 119, y: 247}, {x: 123, y: 241}, {x: 126, y: 235}, {x: 129, y: 228}, {x: 132, y: 223}, {x: 134, y: 215}, {x: 136, y: 209}, {x: 138, y: 203}, {x: 139, y: 197}, {x: 141, y: 191}, {x: 142, y: 184}, {x: 143, y: 178}, {x: 143, y: 173}, {x: 143, y: 168}, {x: 142, y: 164}, {x: 140, y: 159}, {x: 138, y: 155}, {x: 136, y: 152}, {x: 134, y: 148}, {x: 131, y: 145}, {x: 129, y: 143}, {x: 126, y: 142}, {x: 124, y: 141}, {x: 121, y: 141}, {x: 119, y: 141}, {x: 116, y: 143}, {x: 113, y: 149}, {x: 109, y: 157}, {x: 107, y: 164}, {x: 106, y: 173}, {x: 106, y: 182}, {x: 106, y: 192}, {x: 105, y: 202}, {x: 105, y: 213}, {x: 105, y: 223}, {x: 105, y: 232}, {x: 105, y: 241}, {x: 105, y: 250}, {x: 109, y: 260}, {x: 111, y: 272}, {x: 114, y: 284}, {x: 116, y: 295}, {x: 119, y: 308}, {x: 121, y: 320}, {x: 124, y: 332}, {x: 127, y: 346}, {x: 129, y: 357}, {x: 130, y: 371}, {x: 131, y: 381}, {x: 131, y: 391}, {x: 129, y: 399}, {x: 124, y: 404}, {x: 115, y: 406}, {x: 105, y: 406}, {x: 94, y: 402}, {x: 84, y: 390}, {x: 76, y: 378}, {x: 72, y: 368}, {x: 71, y: 362}, {x: 72, y: 356}, {x: 80, y: 349}, {x: 93, y: 341}, {x: 104, y: 333}, {x: 116, y: 325}, {x: 128, y: 315}, {x: 140, y: 305}, {x: 149, y: 298}, {x: 157, y: 291}, {x: 163, y: 287}, {x: 170, y: 283}, {x: 176, y: 281}, {x: 181, y: 280}, {x: 187, y: 280}, {x: 193, y: 284}, {x: 199, y: 291}, {x: 202, y: 298}, {x: 207, y: 306}, {x: 210, y: 318}, {x: 211, y: 326}, {x: 211, y: 337}, {x: 212, y: 347}, {x: 212, y: 359}, {x: 212, y: 372}, {x: 212, y: 383}, {x: 214, y: 395}, {x: 216, y: 402}, {x: 220, y: 410}, {x: 225, y: 415}], [{x: 308, y: 328}, {x: 314, y: 323}, {x: 318, y: 323}, {x: 322, y: 323}, {x: 328, y: 323}, {x: 334, y: 322}, {x: 340, y: 321}, {x: 347, y: 320}, {x: 354, y: 318}, {x: 362, y: 315}, {x: 372, y: 313}, {x: 381, y: 313}, {x: 390, y: 311}, {x: 399, y: 310}, {x: 408, y: 308}, {x: 418, y: 307}, {x: 427, y: 306}, {x: 436, y: 304}, {x: 446, y: 303}, {x: 456, y: 303}, {x: 467, y: 302}, {x: 478, y: 301}, {x: 489, y: 300}, {x: 500, y: 299}, {x: 511, y: 298}, {x: 524, y: 298}, {x: 535, y: 298}, {x: 549, y: 298}, {x: 561, y: 298}, {x: 575, y: 298}, {x: 588, y: 298}, {x: 602, y: 298}, {x: 615, y: 298}, {x: 630, y: 298}, {x: 644, y: 298}, {x: 661, y: 298}, {x: 678, y: 298}, {x: 694, y: 298}, {x: 714, y: 298}, {x: 732, y: 298}, {x: 751, y: 298}, {x: 771, y: 298}, {x: 790, y: 302}, {x: 808, y: 306}, {x: 826, y: 311}, {x: 845, y: 317}, {x: 868, y: 324}, {x: 891, y: 332}, {x: 913, y: 344}]];

var container;
var camera, scene, renderer;

$(init);

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = -70;
	camera.position.y = -50;
	camera.position.z = -200;
	camera.target.position.x = 45;
	camera.target.position.y = -30;
	camera.target.position.z = 0;

	scene = new THREE.Scene();

	for (var k = 0; k < canvas.length; k++) {
		var points = canvas[k];
	
		var material = new THREE.ParticleCircleMaterial( { color: 0xffffff } );
		var prevLineWidth = MAX_LINE_WIDTH;
	
		for (var i = 0; i < points.length; i++) {
			var pointDistance = 0;
			var lineWidth = prevLineWidth;
			
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
						particle.position.z = (i - 1) * 0.2 + 0.2 / segments * j;
						particle.scale.x = particle.scale.y = lineWidth;
						
						setTimeout(function(particle) {
							return function() {
								scene.addObject(particle);
							}
						}(particle), i * 40);
					}
				}
			}
			
			particle = new THREE.Particle(material);
			particle.position.x = points[i].x / 10;
			particle.position.y = -points[i].y / 10;
			particle.position.z = i * 0.2;
			particle.scale.x = particle.scale.y = lineWidth;
			
			setTimeout(function(particle) {
				return function() {
					scene.addObject(particle);
				}
			}(particle), i * 40);
	
			prevLineWidth = lineWidth;
		}
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	setInterval(loop, 1000/60);
	
	setTimeout(destroy, 7000);
}

function loop() {
	camera.position.z = camera.position.z + 0.5;
	camera.position.x += 0.5 * (camera.position.x / -50);
	camera.position.y += 0.5 * (camera.position.y / -50);

	renderer.render(scene, camera);
}

function destroy() {
	scene.objects.splice(0, 1);
	
	if (scene.objects.length > 0) {
		setTimeout(destroy, 5);
	}
}