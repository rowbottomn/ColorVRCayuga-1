//moving globals to here

var colorIndicator = true;


AFRAME.registerComponent('mute-vel', {

  init: function(){

    this.tick = AFRAME.utils.throttleTick(this.tick, 15./90., this);

  },

  click: function(){
    log("clicked on this" + this.el.className);
    this.el.sound.play();
    //log(this.el.parentNode.removeChild(entityEl));
  },

  tick: function (t, dt) {
  
    // `this.el` is the element.
    // `object3D` is the three.js object.
    var el = this.el;//for optimization
    var body = el.body;
    var velY = body.velocity.y;
    var prevX = body.previousPosition.x;
    var prevZ = body.previousPosition.z;
    var currentY = body.position.y;
    body.velocity.set(0, velY, 0);
    body.position.set(prevX, currentY, prevZ);

  }
 
});

var log = function (msg){
  console.log(msg);
}

var getColorArray = function(audioArray){
  var _colorArray = [];
  //make an array of color names from the file names
  for (var i = 0; i < audioArray.length; i ++){
    log( audioArray[i].src.split('.')[3].split('/')[3]);
    _colorArray.push(audioArray[i].src.split('.')[3].split('/')[3]);
    log(i+","+_colorArray[i]);
  }
  return _colorArray;
}

var randDbl = (max, min) => {
  const range = max - min;
  log("range is "+range);
  const value = Math.random() * range + min;
  log("value is "+value); 
  return value;
}

var randInt = (max, min) =>{
  return Math.floor(randDbl(max,min));
}

var spawnSingle = (primitive, _pos, _col, _index)=>{
    const newEntity = document.createElement(primitive);
    newEntity.setAttribute("position",_pos );
    newEntity.setAttribute("scale","0.999 0.999 0.999" );
    newEntity.classList.add("target");

    newEntity.setAttribute("dynamic-body", "mass:1;  linearDamping : 0.001; angularDamping : 0.001;");

    //registring a custom component
    newEntity.setAttribute("mute-vel", "el."+newEntity);
    //an event listener currently unused
    newEntity.addEventListener('click', function (evt) {
    //console.log('Myclass is : ', evt.detail.el, "and my color is: ", this);
    });
    var temp;
    //if (_index != null&&_index < colorArray.length){  
   // if (_index != null&&_index < maxIndex){
   //   temp = _index;
   // }
   // else{
      //temp =  randInt(colorArray.length-1, 0);
      temp =  randInt(maxIndex, 0);
   // }
    
    var tempCol = colorArray[temp];
    if (_col != null){
      tempCol = _col;
      temp = colorArray.indexOf(tempCol); 
    }
    // log(tempCol);
    newEntity.setAttribute("colorIndex", temp);
    newEntity.setAttribute("material", "color:"+tempCol);
    newEntity.setAttribute("sound", "src: #"+tempCol+"-cay; poolSize : 5; on: click");
    //messing around with physics
    
  entityArray.push(newEntity);
  scene.appendChild(newEntity);
}

var spawnGrid = (primitive)=>{
  var halfCol = Math.floor(numCol/2); 
  for (var y = 0; y < numRow; y++ ){
    for (var x = -halfCol; x < halfCol+1; x++){
      const pos = x+" "+(2*y+3.6)+" -5"; 
      spawnSingle(primitive, pos);
    }
  }
  changeIndicator();
};


//this handles firing the projectile and the teleport disk
var shoot = () => {
  //only one bullet, change to creating and destroying
  //creates a bullet object
  const bullet = document.createElement("a-sphere");
  // get the player position
  let pos = myCamera.getAttribute("position");
  //set the bullet position to the player position
  bullet.setAttribute("position", pos);
  bullet.setAttribute("scale", "0.3 0.3 0.3");
  var temp = indicator.getAttribute("colorIndex")
  var tempCol = colorArray[temp];
  bullet.setAttribute("colorIndex", temp);
  bullet.setAttribute("color", tempCol);

     // newEntity.setAttribute("material", "transparent : true; opacity : 0.9");
  //set the bullet velocity to the camera direction a

//  bullet.setAttribute("velocity", getDirection( bulletSpeed));
  
  myCamera.object3D.getWorldDirection ( shootDirection );
  console.log(shootDirection);
  shootDirection.multiplyScalar(bulletSpeed);
  //setting the physics properties of the bullet
  bullet.setAttribute("dynamic-body", "mass:1.0; shape : sphere; sphereRadius : 0.15");
  
  
 // bullet.setAttribute("radius", 0.5);

  //set the texture
  //bullet.setAttribute("src", "/assets/orb.png");
  //  bullet.setAttribute("material", "emissive = #EEFF11; emissiveIntensity = 1; color = #FFFF00");
  //actutally at the a-entitiy to the a-scene
  scene.appendChild(bullet);

  bullet.setAttribute("velocity", shootDirection);
  bullet.setAttribute("bounces", "0");
  //add addEventListener for the collision
  bullet.addEventListener('collide', shootCollided);
 // bullet.emit("play-sound",null, true);
};

const shootCollided = event => {

  //check the id of whatever you hit
  if (event.detail.body.el.id === 'floor') {
    
    var numBounces = parseInt(event.detail.target.el.getAttribute("bounces"))+1;
    console.log('Hit the floor', event.detail.target.el.getAttribute("bounces"));
    if (numBounces <3  ){
        event.detail.target.el.setAttribute("bounces", ""+numBounces);
    }
    else {
    event.detail.target.el.removeEventListener('collide', shootCollided);
    scene.removeChild(event.detail.target.el);}
  } else if (event.detail.body.el.className === 'target') {
    if (event.detail.target.el.getAttribute("colorIndex")==event.detail.body.el.getAttribute("colorIndex")){
      log("removing "+ entityArray.indexOf(event.detail.body.el)+ " from the list");
      var index = entityArray.indexOf(event.detail.body.el);
      if (index !== -1) entityArray.splice(index, 1);
      logArray(entityArray, "colorIndex");
      console.log('Hit the target! '+ entityArray.length+" more remaining!");
      event.detail.target.el.removeEventListener('collide', shootCollided);
      scene.removeChild(event.detail.target.el);//
      scene.removeChild(event.detail.body.el);

      if (entityArray.length === 0) {
        console.log('You win!');
        level = advanceLevel(level);
        
        spawnGrid("a-box");
        //location.href = nextLevel;
      }
      else{
        changeIndicator();
      }
    }
    else {
      log("nope");
    }
    
  }

};

document.onkeyup = event => {
  if (event.which == 32) {
    shoot();
  } else if (event.which == 67) {
    spawnGrid(a-box);
  }
   else if (event.which == 71) {
    colorIndicator = !colorIndicator; 
    changeIndicator();
   }
};

const logArray = (_array, _attribute)=>{
  for (var i = 0; i < _array.length; i++){
    //log("log array");
    log(_array[i].getAttribute(_attribute));
  }
}

var changeIndicator = ()=>{
  
  var rand =  randInt(entityArray.length, 0);
  var temp = entityArray[rand].getAttribute("colorIndex");
  log("rand is "+ rand+" temp is "+ temp);
  
  var tempCol = colorArray[temp];
  if (colorIndicator){
    indicator.setAttribute("color", tempCol);
  }
  else {
    indicator.setAttribute("color", "grey");
  }
  //indicator.setAttribute("text", "value = "+tempCol);
  //indicator.setAttribute("emissive", tempCol);
  indicator.setAttribute("colorIndex",temp);
  log("tempCol is "+ tempCol);
  indicator.setAttribute("sound", "src: #"+tempCol+"-cay;");
   // var audio = ;
  
  //log(audio);
  sounds[temp].play();
}

var advanceLevel = (_level) =>{
  _level ++;
  numRow = Math.floor(_level/4)+2;
  numCol = _level+2;
  maxIndex = Math.min(Math.floor(2*_level)+3, colorArray.length);
  log("advanceLevel:"+_level+", "+numRow+", "+numCol+", "+maxIndex);
  return _level;
}

var indicator = document.getElementById("indicator");

var scene = document.getElementById("scene");

var sounds = scene.getElementsByTagName("audio");

logArray(sounds, "src");

var colorArray = getColorArray(sounds);

var entityArray = [];

//const maxEntities = 10;

//var myScene = document.getElementById('scene');
var myCamera = document.getElementById('camera');
var cursor;
var level = 0;
var numRow = Math.floor(level/4)+2;
var numCol = level+2;
//var gridArray = [,];
var maxIndex = Math.min(Math.floor(2*level)+3, colorArray.length);
//set the intial level
let nextLevel = 'index.html';
var shootDirection = new THREE.Vector3();
const bulletSpeed = -20;

spawnGrid("a-box");

//this.el.emit('dataready', {value: 2, el: this.el})
changeIndicator();
/*indicator.addEventListener("play-sound", ()=>{
  var el = this.el;
  log(el);
  var audio = el.getAttribute(color);
  log(audio);
  var audio2play = document.getElementById("#"+audio+"-cay");
  audio2play.play();
});*/
indicator.addEventListener("click", shoot);