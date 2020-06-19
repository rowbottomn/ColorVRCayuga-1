
AFRAME.registerComponent('mute-vel', {

  init: function(){

    this.tick = AFRAME.utils.throttleTick(this.tick, 15./90., this);
    
  },

  click: function(){
    log("clicked on this" + this.el.className);
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
    _colorArray.push(audioArray[i].src.split('.')[2].split('/')[3]);
    log(_colorArray[i]);
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


var spawnGrid = (primitive)=>{
  var halfCol = Math.floor(numCol/2); 
  for (var y = 0; y < numRow; y++ ){
    for (var x = -halfCol; x < halfCol+1; x++){
      const newEntity = document.createElement(primitive);
      newEntity.setAttribute("position",x+" "+(2*y+3.6)+" -5" );
      newEntity.setAttribute("scale","0.999 0.999 0.999" );
      temp =  randInt(colorArray.length, 0);
      
      const tempCol = colorArray[temp];
     // log(tempCol);
      newEntity.classList.add("target");
      //newEntity.setAttribute("class", "target");
      newEntity.setAttribute("colorIndex", temp);
      newEntity.setAttribute("material", "color:"+tempCol);
     // newEntity.setAttribute("material", "transparent : true; opacity : 0.9");
      newEntity.setAttribute("sound", "src: #"+tempCol+"-cay; poolSize : 5; on: click");
      //messing around with physics
      newEntity.setAttribute("dynamic-body", "mass:1;  linearDamping : 0.001; angularDamping : 0.001;");

      //registring a custom component
      newEntity.setAttribute("mute-vel", "el."+newEntity);
      newEntity.addEventListener('click', function (evt) {
      //console.log('Myclass is : ', evt.detail.el, "and my color is: ", this);
    });
      gridArray[x,y] = newEntity;
      scene.appendChild(newEntity);
    }
  }

 // var vel = body.get_velocity();
 // log(vel);
 // var val = vel.value;
 // log(val);
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
  var temp = indicator.getAttribute("colorIndex");
  var tempCol = indicator.getAttribute("color");
  bullet.setAttribute("colorIndex", temp);
  bullet.setAttribute("material", "color:"+tempCol);
     // newEntity.setAttribute("material", "transparent : true; opacity : 0.9");
  //set the bullet velocity to the camera direction a

//  bullet.setAttribute("velocity", getDirection( bulletSpeed));
  
  myCamera.object3D.getWorldDirection ( shootDirection );
  console.log(shootDirection);
  shootDirection.multiplyScalar(bulletSpeed);
  //setting the physics properties of the bullet
  bullet.setAttribute("dynamic-body", "mass:1.0; shape : sphere; sphereRadius : 0.15");
  
  
 // bullet.setAttribute("radius", 0.5);
  bullet.setAttribute("emissive", tempCol);
  //set the texture
  //bullet.setAttribute("src", "/assets/orb.png");
  //  bullet.setAttribute("material", "emissive = #EEFF11; emissiveIntensity = 1; color = #FFFF00");
  //actutally at the a-entitiy to the a-scene
  scene.appendChild(bullet);
 changeIndicator();
  bullet.setAttribute("velocity", shootDirection);
  bullet.setAttribute("bounces", "0");
  //add addEventListener for the collision
  bullet.addEventListener('collide', shootCollided);
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
    console.log('Hit the target!');
    event.detail.target.el.removeEventListener('collide', shootCollided);
    scene.removeChild(event.detail.target.el);//
    scene.removeChild(event.detail.body.el);
  }
  if (document.querySelectorAll('.target').length === 0) {
    console.log('You win!');
    location.href = nextLevel;
  }
};

document.onkeyup = event => {
  if (event.which == 32) {
    shoot();
  } else if (event.which == 67) {
    //spawnEntities();
  }
};

var changeIndicator = ()=>{
  var temp =  randInt(colorArray.length, 0);
  indicator.setAttribute("colorIndex", temp);
  var tempCol = colorArray[temp];
  indicator.setAttribute("colorIndex", temp );
  indicator.setAttribute("color", tempCol);
  indicator.setAttribute("sound", "src: #"+tempCol+"-cay; poolSize : 5; on: click");

}

var indicator = document.getElementById("indicator");

var scene = document.getElementById("scene");

var sounds = scene.getElementsByTagName("audio");

//log(sounds.length);

var colorArray = getColorArray(sounds);

var entityArray = [];

const maxEntities = 10;

//var myScene = document.getElementById('scene');
var myCamera = document.getElementById('camera');
var cursor;

var numRow = 3;
var numCol = 6;
var gridArray = [,];

//set the intial level
let nextLevel = 'index.html';
var shootDirection = new THREE.Vector3();
const bulletSpeed = -20;

spawnGrid("a-box");
changeIndicator();