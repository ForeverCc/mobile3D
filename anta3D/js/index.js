/*
	JS by xc
	场景的独立动画  圆柱的形成  手指的拖拽
*/
	setPersc();
	loadingAn();

/* 默认 */
document.addEventListener(
	'touchstart', 
	function(e) {
		e.preventDefault();
	},
	{ passive: false }
	);
	
//设置景深
function setPersc(){
	perscFn();
	window.onresize = perscFn;
	function perscFn(){
		var viewBox = document.querySelector('#viewBox');
		var main = document.querySelector('#main');
		var deg = 52;//
		var height = document.documentElement.clientHeight;
		var R = Math.round(Math.tan(deg/180*Math.PI)*height*.5);
		viewBox.style.WebkitPerspective = viewBox.style.perspective = R + 'px';
		css(main,'translateZ',R);
	}
}

//加载动画，图片预加载;
function loadingAn(){
	var loadingText = document.querySelector('.loadingText');
	var datas = [];
	var num = 0;
	for(var s in imgData) {
		//合并成一个大数组
		datas = datas.concat(imgData[s]);
	}
	for(var i = 0; i < datas.length; i++){
		var img = new Image();
		img.src = datas[i];
		img.onload = function(){
			num++;
			//console.log(Math.floor(num/data.length*100));
			loadingText.innerHTML = '已加载 '+(Math.floor(num/datas.length*100))+'%';
			//图片加载完成,隐藏loading部分;
			if( num === datas.length ){
				lodingHide();
			};
		};
	}
}
//音乐的播放
function musicPlay(){
	var music = document.querySelector('#music');
	var bgm = document.querySelector('#bgm');
	music.style.opacity  = 1;
	var onoff = true;//点击图标的切换状态
	bgm.play();
	music.addEventListener(
		'touchstart',
		function(e){
			if(!onoff){
				music.style.backgroundImage = 'url('+imgData.music[0]+')';
				bgm.play();
			}else{
				music.style.backgroundImage = 'url('+imgData.music[1]+')';
				bgm.pause();
			}
			onoff = !onoff;
			e.preventDefault();
		},
		false
	)
}

/* 隐藏loding区域，下一个场景的进场 */
function lodingHide(){
	var viewBox = document.querySelector('#viewBox');
	var loading = document.querySelector('#loading');
	var logo2 = document.createElement('div');
	var logo3 = document.createElement('div');
	var img = new Image();
	var img2 = new Image();
	//设置容器的样式
	logo2.id = 'logo2';
	logo3.id = 'logo3';
	logo3.className = logo2.className = 'logoImg';
	//图片的src
	img.src = imgData.logo[0];
	img2.src = imgData.logo[1];
	//添加
	logo2.appendChild(img);
	logo3.appendChild(img2);
	//远处  透明度的设置
	css(logo2, 'opacity', 0);
	css(logo3, 'opacity',0);
	css(logo2, 'translateZ', -2000);
	css(logo3, 'translateZ', -2000);	
	viewBox.appendChild(logo2);
	viewBox.appendChild(logo3);	
	//当loading结束 logo2进场
	MTween({
		el: loading,
		target: { opacity: 0 },
		time: 1000,
		type: 'easeOut',
		callBack: function(){
			viewBox.removeChild(loading);
			musicPlay();	
			css(logo2, 'opacity', 100);
			MTween({
				el: logo2,
				target: { translateZ: 0 },
				time: 500,
				type: 'easeBoth',
				callBack: logo3In
			});
		}
	});
}

//logo2 out  logo3 In
function logo3In(){
	var viewBox = document.querySelector('#viewBox');
	var logo2 = document.querySelector('#logo2');
	var logo3 = document.querySelector('#logo3');
	//展示一会在回去  2s左右
	setTimeout(function(){
		MTween({
			el: logo2,
			target: { translateZ: -2000 },
			time: 800,
			type: 'linear',
			callBack: function(){
				viewBox.removeChild(logo2);
				css(logo3, 'opacity', 100);
				setTimeout(function(){
					MTween({
						el: logo3,
						target: { translateZ: 0 },
						time: 500,
						type: 'easeBoth',
						callBack: logo3Out
					});
				},300);
			}
		});
	},2000);
}

/* 隐藏logo3，显示小的爆炸效果 */
function logo3Out(){
	var viewBox = document.querySelector('#viewBox');
	var logo3 = document.querySelector('#logo3');
	setTimeout(function(){
		MTween({
			el: logo3,
			target: { translateZ: -2000 },
			time: 2000,
			type: 'easeIn',
			callBack: function(){
				viewBox.removeChild(logo3);
				//爆炸
				boomIn();
			}
		});
	},1000);
}

/* 去打破 同时爆炸碎片*/
function boomIn(){
	var viewBox = document.querySelector('#viewBox');
	var logo4 = document.createElement('div');
	var logoIcos = document.createElement('div');
	var logo4Img = new Image();//去打破图片对象
	var iconsLength = 54;//多少碎片
	logo4.id = 'logo4';
	logo4Img.id = 'logo4Img';
	logoIcos.id = 'logoIcos';
	logo4Img.src = imgData.logo[2];
	css(logo4, 'translateZ', -2000); //初始在远处
	for(var i = 0; i < iconsLength; i++){
		var span = document.createElement('span');
		//随机分散在圆柱 的各个位置.先位移后旋转
		var zTranslate = 20 + Math.round( Math.random()*200 );
		var yTranslate = 30 + Math.round( Math.random()*200 );
		var yDeg = Math.round(Math.random()*360);
		var xDeg = Math.round(Math.random()*360);
		var zDeg = Math.round(Math.random()*360);
		css(span, 'rotateY', xDeg);
		css(span, 'translateZ', zTranslate); //远近的错落
		css(span, 'rotateX', yDeg);
		css(span, 'translateY',yTranslate);//上下的错落
		css(span, 'rotateZ', zDeg);
		span.style.backgroundImage = 'url(' + imgData.logoIco[i % imgData.logoIco.length] + ')';
		logoIcos.appendChild(span);
	}
	logo4.appendChild(logoIcos);
	logo4.appendChild(logo4Img);
	viewBox.appendChild(logo4);
	MTween({
		el: logo4,
		target: { translateZ: 0 },
		time: 500,
		type: 'easeOutStrong',
		callBack:function(){
			//延迟1s展示再消失
			setTimeout(function(){
				MTween({
					el: logo4,
					target: { translateZ: -1000, scale: 20 },
					time: 3000,
					type: 'linear',
					callBack: function(){
						viewBox.removeChild(logo4);
						controlZFn();
					}
				});
			}, 500);
		}
	});
}
/* 控制圆柱的远近，主体开始入场 */
function controlZFn(){
	var controlZ = document.querySelector('#controlZ');
	css(controlZ, 'translateZ', -2000);
	panoBgIn(); //圆柱的进场
	cloudIn();//云朵的出现
	panoIn(); //漂浮层
	MTween({
		el: controlZ,
		target: { translateZ: -160 },
		time: 3600,
		type: 'easeBoth'
	});
}

/* 生成主体的背景圆柱,圆柱入场 */
function panoBgIn(){
	var panoBg = document.querySelector('#panoBg');
	var width = 129;
	var panoLength = imgData.bg.length; 
	var outerDeg = 360 / panoLength;  //外角
	var innerDeg = (180-outerDeg)/2; //内角
	var R = parseInt(Math.tan(innerDeg * Math.PI/180) * (width/2)) - 3;
	var startDeg = 180;
	css(panoBg, 'rotateX', 0);
	css(panoBg, 'rotateY', -695);//原效果最终要停在25deg
	for(var i = 0; i < panoLength; i++){
		var span = document.createElement('span');
		//先位移在旋转拼成圆柱
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		span.style.backgroundImage = 'url(' + imgData.bg[i] + ')';
		span.style.display = 'none';
		panoBg.appendChild(span);
		startDeg -= outerDeg;
	}
	//圆柱的逐个显示
	var num = 0;
	var timer = setInterval(function(){
		panoBg.children[num].style.display = 'block';
		num++;
		if(num >= panoLength){
			clearInterval(timer);
		}
	}, 80);
	MTween({
		el: panoBg,
		target: { rotateY: 25 },
		time: 3200,
		type: 'linear',
		callBack:function(){
			fingerMove();
		}
	});
}

/*添加云朵及云朵入场*/
function cloudIn(){
	var cloud = document.querySelector('#cloud');
	css(cloud, 'translateZ', -400);
	var cloudLen = 10;//创建几多云
	for(var i = 0; i < cloudLen; i++){
		var span = document.createElement('span');
		span.style.backgroundImage = 'url(' + imgData.cloud[i % 3] + ')';
		var R = 200+(Math.random() * 150);
		var deg = (360/9) * i;
		var dirX = Math.sin(deg * Math.PI/180) * R;
		var dirY = (Math.random()-.5) * 200
		var dirZ = Math.cos(deg * Math.PI/180) * R;
		css(span, 'translateX', dirX);
		css(span, 'translateY', dirY);
		css(span, 'translateZ', dirZ);
		span.style.display = 'none';
		cloud.appendChild(span);
	}
	//云朵的逐个显示入场
	var num = 0;
	var timer = setInterval(function(){
		cloud.children[num].style.display = 'block';
		num++;
		if(num >= cloud.children.length){
			clearInterval(timer);
		}
	}, 50);
	MTween({
		el: cloud,
		target: { rotateY: 540 },
		time: 3000,
		type: 'easeIn',
		callIn:function(){
			//为了使图片始终正对
			var deg = -css(cloud, 'rotateY');
			for(var i = 0; i < cloud.children.length; i++){
				css(cloud.children[i], 'rotateY', deg);
			}
		},
		callBack:function(){
			cloud.parentNode.removeChild(cloud);
			bgShow();
		}
	});
}

/* 生成 漂浮层 图片也是拼接的 */
function panoIn(){
	var pano = document.querySelector('#pano');
	var R = 404; //漂浮层的半径
	var deg = 18;
	var num = 0; //图片的起始
	var startDeg = 180;//定义显示的初始角度
	//设置漂浮层的初始旋转位置
	css(pano, 'rotateX', 0);
	css(pano, 'rotateY', -180);
	css(pano, 'scale', 0);
	//第1个漂浮物;
	var pano1 = document.createElement('div');
	pano1.className = 'pano';
	//显示层级感
	css(pano1, 'translateX', 1.564);
	css(pano1, 'translateZ', -9.877);
	for(var i = 0; i < 2; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 344px; margin-top: -172px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', -163);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano1.appendChild(span);
	}
	pano.appendChild(pano1);
	//第2个漂浮物;
	var pano2 = document.createElement('div');
	pano2.className = 'pano';
	css(pano2, 'translateX', 20.225);
	css(pano2, 'translateZ', -14.695);
	for(var i = 0; i < 3; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 326px; margin-top: -163px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', 278);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano2.appendChild(span);
	}
	pano.appendChild(pano2);
	//第3个漂浮物;
	var pano3 = document.createElement('div');
	pano3.className = 'pano';
	css(pano3, 'translateX', 22.175);
	css(pano3, 'translateZ', -11.35);
	for(var i = 0; i < 4; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 195px; margin-top: -97.5px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', 192.5);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano3.appendChild(span);
	}
	pano.appendChild(pano3);
	//第4个漂浮物;
	var pano4 = document.createElement('div');
	pano4.className = 'pano';
	css(pano4, 'translateX', 20.225);
	css(pano4, 'translateZ', 14.695);
	startDeg = 90;
	for(var i = 0; i < 5; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 468px; margin-top: -234px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', 129);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano4.appendChild(span);
	}
	pano.appendChild(pano4);
	//第5个漂浮物;
	var pano5 = document.createElement('div');
	pano5.className = 'pano';
	css(pano5, 'translateX', -4.54);
	css(pano5, 'translateZ', 9.91);
	startDeg = 18;
	for(var i = 0; i < 6; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 444px; margin-top: -222px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', -13);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano5.appendChild(span);
	}
	pano.appendChild(pano5);
	//第6个漂浮物;
	var pano6 = document.createElement('div');
	pano6.className = 'pano';
	css(pano6, 'translateX', -11.35);
	css(pano6, 'translateZ', 22.275);
	startDeg = 18;
	for(var i = 0; i < 6; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 582px; margin-top: -291px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', 256);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano6.appendChild(span);
	}
	pano.appendChild(pano6);
	//第7个漂浮物;
	var pano7 = document.createElement('div');
	pano7.className = 'pano';
	css(pano7, 'translateX', -20.225);
	css(pano7, 'translateZ', -14.695);
	startDeg = -108;
	for(var i = 0; i < 3; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 522px; margin-top: -261px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', 176.5);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);
		num++;
		startDeg -= deg;
		pano7.appendChild(span);
	}
	pano.appendChild(pano7);
	//第8个漂浮物;
	var pano8 = document.createElement('div');
	pano8.className = 'pano';
	css(pano8, 'translateX', -17.82);
	css(pano8, 'translateZ', -9.08);
	startDeg = -72;
	for(var i = 0; i < 6; i++){
		var span = document.createElement('span');
		span.style.cssText = 'height: 421px; margin-top: -210px;';
		span.style.background = 'url(' + imgData.pano[num] + ')';
		css(span, 'translateY', -19.5);
		css(span, 'rotateY', startDeg);
		css(span, 'translateZ', -R);	
		num++;
		startDeg -= deg;
		pano8.appendChild(span);
	}
	pano.appendChild(pano8);
	//漂浮层的进场
	setTimeout(function(){
		MTween({
			el: pano,
			target: {
				rotateY: 25,
				scale: 100
			},
			time: 1200,
			type: 'easeBoth'
		});
	},2500);
}

//背景的图片的进场
function bgShow(){
	var bgBox = document.querySelector('#bgBox');
	MTween({
		el: bgBox,
		target: { opacity: 100 },
		time: 1000,
		type: 'easeBoth'
	});
}

//手指拖拽场景切换
function fingerMove(){
	var pano = document.querySelector('#pano');
	var panoBg = document.querySelector('#panoBg');
	var controlZ = document.querySelector('#controlZ');
	var startPoint = { x: 0, y: 0 };
	var panoBgAngle = { x: 0, y: 0 };
	var scale = { x: 129/18, y: 1170/80 } //px  deg转化
	var startZ = css(controlZ, 'translateZ');//拿到初始的translateZ
	var lastDeg = { x: 0, y: 0 };
	var lastDis = { x: 0, y: 0 };
	document.addEventListener(
		'touchstart', 
		function(e) {
			clearInterval(pano.timer);
			clearInterval(panoBg.timer);
			clearInterval(controlZ.timer);
			//拿到手指起始位置
			startPoint.x = e.changedTouches[0].pageX;
			startPoint.y = e.changedTouches[0].pageY;
			//背景的起始角度
			panoBgAngle.x = css(panoBg, 'rotateY');
			panoBgAngle.y = css(panoBg, 'rotateX');
		});
	document.addEventListener(
		'touchmove', 
		function(e) {
			var nowPoint = {}; //移动时候的手指位置
			var nowDeg = {}; //移动要旋转的角度
			var nowDeg2 = {}; //形成错落感
			var dis = {}; //移动的差值
			var disDeg = {}; //角度的变化
			//现在位置
			nowPoint.x = e.changedTouches[0].pageX;
			nowPoint.y = e.changedTouches[0].pageY;
			//移动的差值
			dis.x = nowPoint.x - startPoint.x;
			dis.y = nowPoint.y - startPoint.y;
			//px  deg的互转
			disDeg.x = -(dis.x/scale.x);
			disDeg.y = dis.y/scale.y;
			nowDeg.y = panoBgAngle.y + disDeg.y;
			nowDeg.x = panoBgAngle.x + disDeg.x;
			//console.log(nowDeg.x, nowDeg.y);
			//pano层的变化
			nowDeg2.x = panoBgAngle.x + (disDeg.x) * .85;
			nowDeg2.y = panoBgAngle.y + (disDeg.y) * .85;
			//上下旋转角度的限制
			if(nowDeg.y > 40){
				nowDeg.y = 40;
			}else if(nowDeg.y < -40) {
				nowDeg.y = -40;
			};
			if(nowDeg2.y > 40){
				nowDeg2.y = 40;
			}else if(nowDeg2.y < -40) {
				nowDeg2.y = -40;
			};
			lastDis.x =  nowDeg.x - lastDeg.x;
			lastDeg.x = nowDeg.x;
			lastDis.y =  nowDeg.y - lastDeg.y;
			lastDeg.y = nowDeg.y;
			//背景层漂浮曾的旋转
			css(panoBg, 'rotateX', nowDeg.y);
			css(panoBg, 'rotateY', nowDeg.x);
			css(pano, 'rotateX', nowDeg2.y);
			css(pano, 'rotateY', nowDeg2.x);
			var zMove = Math.abs(dis.x)//z方向的位移值
			if( zMove > 200){
				zMove = 200;
			};
			//移动的时候往后走一下
			css(controlZ, 'translateZ', startZ -zMove);
		}); 
	document.addEventListener(
		'touchend', 
		function(e) {
			//手指抬起拿到最新的旋转角度
			var nowDeg = { x: css(panoBg, 'rotateY'), y: css(panoBg, 'rotateX') };
			//console.log(lastDis.x, lastDis.y);
			//缓冲的角度
			var disDeg = { x: lastDis.x * 10, y: lastDis.y * 10 };
			var targetDeg = nowDeg.x + disDeg.x;//运动到的目标角度
			//手指抬起回到初始
			MTween({
				el: controlZ,
				target: { translateZ: startZ },
				time: 800,
				type: 'easeOut'
				}
			);
			//背景层的移动
			MTween({
				el: panoBg,
				target:{ rotateY: targetDeg },
				time: 800,
				type: 'easeOut'
			});
			//漂浮曾移动
			MTween({
				el: pano,
				target:{ rotateY: targetDeg },
				time: 800,
				type: 'easeOut'
			});
		}
	); 
}
