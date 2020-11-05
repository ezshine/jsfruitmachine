
var squares=[];
var curIndex=0;
var isrolling=false;
var isclearbets=false;
var squareItemConfigs=[
						{
							name:"王",
							coin:"*120"
						},
						{
							name:"小王",
							coin:"*50"
						},
						{
							name:"77",
							coin:"*40"
						},
						{
							name:"小77",
							coin:"*3"
						},
						{
							name:"星星",
							coin:"*30"
						},
						{
							name:"小星星",
							coin:"*3"
						},
						{
							name:"西瓜",
							coin:"*20"
						},
						{
							name:"小西瓜",
							coin:"*3"
						},
						{
							name:"铃铛",
							coin:"*20"
						},
						{
							name:"小铃铛",
							coin:"*3"
						},
						{
							name:"柠檬",
							coin:"*20"
						},
						{
							name:"小柠檬",
							coin:"*3"
						},
						{
							name:"橙子",
							coin:"*10"
						},
						{
							name:"小橙子",
							coin:"*3"
						},
						{
							name:"苹果",
							coin:"*5"
						},
						{
							name:"小苹果",
							coin:"*3"
						},
						{
							name:"幸运",
							type:"lucky1"
						},
						{
							name:"小幸运",
							type:"lucky2"
						}];

var bets=[
		{
			key:"01",
			value:0
		},
		{
			key:"03",
			value:0
		},
		{
			key:"05",
			value:0
		},
		{
			key:"07",
			value:0
		},
		{
			key:"09",
			value:0
		},
		{
			key:"11",
			value:0
		},
		{
			key:"13",
			value:0
		},
		{
			key:"15",
			value:0
		}];

var curcoin=1000;
var bonuscoin=0;
window.onload=init();
function init(){
	var app = new PIXI.Application({width: 750, height: 1270});

	document.body.appendChild(app.view);
	scaleToWindow(app.view, "#f2f2f2");
	window.app=app;
	window.stage=app.stage;

	gameInit();
}
function gameInit(){
	var arr=[
				[13,09,02,01,15,16,11],
				[10,00,00,00,00,00,07],
				[15,00,00,00,00,00,08],
				[17,00,00,00,00,00,18],
				[05,00,00,00,00,00,15],
				[06,00,00,00,00,00,14],
				[11,12,15,03,04,09,13]
			];
	
	
	var tsquares=[];
	for(var i=0;i<arr.length;i++){
		for(var j=0;j<arr[i].length;j++){
			var itemKey=parseInt(arr[i][j]);
			var citem={};
			if(itemKey>0){
				
				citem=createItemSquare(itemKey-1);
				citem.x = 25+100*j;
				citem.y = 25+100*i;
				citem.key=itemKey-1;

				stage.addChild(citem);

				
			}
			tsquares.push(citem);
		}
	}

	squares.push(tsquares[0],tsquares[1],tsquares[2],tsquares[3],tsquares[4],tsquares[5],tsquares[6]);
	squares.push(tsquares[13]);
	squares.push(tsquares[20]);
	squares.push(tsquares[27]);
	squares.push(tsquares[34]);
	squares.push(tsquares[41]);
	squares.push(tsquares[48],tsquares[47],tsquares[46],tsquares[45],tsquares[44],tsquares[43],tsquares[42]);
	squares.push(tsquares[35]);
	squares.push(tsquares[28]);
	squares.push(tsquares[21]);
	squares.push(tsquares[14]);
	squares.push(tsquares[7]);

	window.coinField=new PIXI.Text("0000000",{fontSize:30,fill:"white"});
	coinField.text="coin:"+curcoin;
	coinField.x=150;
	coinField.y=150;
	stage.addChild(coinField);

	window.bonusField=new PIXI.Text("0000000",{fontSize:30,fill:"white"});
	bonusField.text="bonus:"+bonuscoin;
	bonusField.x=150;
	bonusField.y=250;
	stage.addChild(bonusField);

	for(var i=0;i<bets.length;i++){
		var betitem=createBetItem(parseInt(bets[i].key)-1,function(item){
			betIn(item.index);
		});
		betitem.index=i;
		bets[i].target=betitem;

		betitem.x=25+i*88;
		betitem.y=750;

		stage.addChild(betitem);
	}

	createStartButton();

	selectItem(0);
}
function clearBets(){
	for(var i=0;i<bets.length;i++){
		bets[i].value=0;
		bets[i].target.numtext.text="0";
	}
}
function betIn(index){
	if(isrolling||curcoin<=0)return;

	if(!isclearbets){
		resetBonus();

		isclearbets=true;
		clearBets();
	}

	var item=bets[index].target;

	item.bet();

	bets[index].value=parseInt(item.numtext.text);

	curcoin-=1;
	coinField.text="coin:"+curcoin;
}
function resetBonus(){
	curcoin+=bonuscoin;
	bonuscoin=0;
	coinField.text="coin:"+curcoin;
	bonusField.text="bonus:"+bonuscoin;
}
function calcBonus(item){
	if(squareItemConfigs[item.key].type=="lucky1"){
		startRoll();
		return;
	}
	if(squareItemConfigs[item.key].type=="lucky2"){
		startRoll();
		return;
	}
	var isGetBonus=false;
	var betsitem;
	for(var i=0;i<bets.length;i++){
		var rk=parseInt(item.key);//当前停在的项目
		var tk=parseInt(bets[i].key)-1;//下注的目标项目
		// console.log(rk,squareItemConfigs[rk].name,tk,squareItemConfigs[tk].name);
		// console.log("tk-v:",bets[i].value);
		if(bets[i].value>0){//当下注大于0时才进入判断
			if((rk==tk||rk-1==tk)){
				betsitem=bets[i];
				isGetBonus=true;
				break;
			}
		}
	}

	if(!isGetBonus)console.log("没中");
	else{
		console.log("中了",squareItemConfigs[item.key].name);
		bonuscoin=eval(betsitem.value+squareItemConfigs[item.key].coin);
		bonusField.text="bonus:"+bonuscoin;
	}
}
function selectItem(index){
	curIndex=index;
	var item=squares[index];
	item.frame.alpha=1;
	item.bg.alpha=1;
	item.parent.setChildIndex(item,item.parent.children.length-1);
	return item;
}
function deselectItem(index){
	var item=squares[index];
	item.frame.alpha=0;
	item.bg.alpha=.8;
}
function isInteger(obj){
	// console.log(obj);
    return typeof obj === 'number' && obj%1 === 0;   //是整数，则返回true，否则返回false
 }
 function getBetCoin(){
 	var num=0;
 	for(var i=0;i<bets.length;i++){
		num+=bets[i].value;
	}
	return num;
 }
 function getMinEarningKey(){

 }
 function isInBetWithKey(key){
 	var isGetBonus=false;

 	for(var i=0;i<bets.length;i++){
		var rk=parseInt(key);//当前停在的项目
		var tk=parseInt(bets[i].key)-1;//下注的目标项目
		if(bets[i].value>0){//当下注大于0时才进入判断
			if((rk==tk||rk-1==tk)){
				isGetBonus=true;
				break;
			}
		}
	}

	return isGetBonus;
 }
 //概率算法
 function getStopPosition(){
 	var pos=Math.round(squares.length*Math.random());

 	function getTPos(){
 		var tpos=pos+curIndex;
	 	if(tpos>=squares.length){
	 		tpos-=squares.length;
	 	}
	 	return tpos;
 	}

 	var tpos=getTPos();
 	

 	//必须和上一次的位置不一样
 	// if(tpos==curIndex)return getStopPosition();
 	// console.log(squares.length,curIndex,pos,tpos);
 	var titem=squares[tpos];

 	/*
 	下注者最小收益模型
 	如果可能中奖，则破坏本次选定值
 	如果无法破坏，则强行变为最小奖
 	*/
 	var betResult=isInBetWithKey(titem.key);
 	if(betResult!=false && Math.random()>.5){
 		console.log("本次转动将停止到：",squareItemConfigs[parseInt(titem.key)].name);

 		console.log(squareItemConfigs[parseInt(titem.key)].name,"可中奖,重新改变位置");
 		return getStopPosition();
 	}

 	console.log("本次转动将停止到：",squareItemConfigs[parseInt(titem.key)].name);
 	return squares.length*(Math.floor(Math.random()*4)+3)+pos;
 }
function startRoll(){
	if(isrolling)return;
	var bcoin=getBetCoin();
	if(bcoin<=0)return;
	if(!isclearbets&&curcoin<bcoin){
		resetBonus();
		return;
	}

	curcoin+=bonuscoin;
	bonuscoin=0;

	if(!isclearbets){
		curcoin-=bcoin;
	}

	coinField.text="coin:"+curcoin;
	bonusField.text="bonus:"+bonuscoin;
	isclearbets=false;

	isrolling=true;
	deselectItem(curIndex);
	var count=0;
	var totalCount=getStopPosition();

	function rollloop(){

		var easeval=0.1;

		if(count>=totalCount-5)easeval=0.05;
		else if(count>=totalCount-10)easeval=0.1;
		else if(count>=totalCount-15)easeval=0.2;
		else if(count>=10)easeval=1;
		else if(count>=5)easeval=0.2;

		count=count+easeval;
		count=parseFloat(count.toFixed(2));

		if(isInteger(count)){
			curIndex+=1;
			if(curIndex>=squares.length){
				curIndex=0;
			}

			var item=selectItem(curIndex);
			soundplay();

			if(count>=totalCount){
				rollstop();
				calcBonus(item);
			}else{
				item.fadeout();
			}
		}
	}
	function rollstop(){
		app.ticker.remove(rollloop);
		isrolling=false;
	}
	app.ticker.add(rollloop);
}
function soundplay(){
	soundEffect(1587.33, 0, 0.2, "square", 1, 0, 0);
	//A
	soundEffect(880, 0, 0.2, "square", 1, 0, 0.1);
	// //High D
	soundEffect(1174.66, 0, 0.3, "square", 1, 0, 0.2);
}
function createStartButton(){
	var container=new PIXI.Container();
	container.interactive=true;

	var rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x1ab34f);
	rectangle.drawRect(0, 0, 700, 88);
	rectangle.endFill();
	
	container.addChild(rectangle);

	var text=new PIXI.Text("开始");
	text.x=(700-text.width)/2;
	text.y=(88-text.height)/2;
	container.addChild(text);

	container.x=25;
	container.y=900;

	stage.addChild(container);

	container.on("touchend",startRoll);
	container.on("click",startRoll);
}
function createBetItem(key,callback){
	var container=new PIXI.Container();
	container.interactive=true;
	container.on('touchend',function(){
		if(callback)callback(this);
	});
	container.on("click",function(){
		if(callback)callback(this);
	});

	var rectangle = new PIXI.Graphics();
	rectangle.beginFill(0xf2f2f2);
	rectangle.drawRect(0, 0, 86, 100);
	rectangle.endFill();
	
	container.addChild(rectangle);

	var text=new PIXI.Text(squareItemConfigs[key].name);
	text.x=(86-text.width)/2;
	text.y=100-text.height;
	container.addChild(text);

	container.text=squareItemConfigs[key].name;
	container.key=key;

	var numtext=new PIXI.Text("0");
	numtext.x=(86-numtext.width)/2;
	numtext.y=0;
	container.addChild(numtext);

	container.numtext=numtext;
	container.bet=function(){
		container.numtext.text=parseInt(container.numtext.text)+1;
		soundplay();
	}

	return container;
}
function createItemSquare(key){
	var container=new PIXI.Container();

	var rectangle = new PIXI.Graphics();
	rectangle.beginFill(0xffffff);
	rectangle.drawRect(0, 0, 100, 100);
	rectangle.endFill();
	rectangle.alpha=.8;
	container.bg=rectangle;
	
	container.addChild(rectangle);

	var frectangle = new PIXI.Graphics();
	frectangle.lineStyle(5,0xff0000);
	frectangle.beginFill(0xf2f2f2);
	frectangle.drawRect(0, 0, 100, 100);
	frectangle.endFill();
	
	container.addChild(frectangle);
	container.frame=frectangle;
	container.frame.alpha=0;

	var text=new PIXI.Text(squareItemConfigs[key].name);
	text.x=(100-text.width)/2;
	text.y=(100-text.height)/2;
	container.addChild(text);

	container.fadeout=function(){
		Tween(container.frame).to({alpha:0},400);
		Tween(container.bg).to({alpha:.8},400);
	};

	return container;
}