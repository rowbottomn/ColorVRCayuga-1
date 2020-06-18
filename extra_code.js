
var spawnEntities = (primitive)=>{
  while(entityArray.length< maxEntities){
    var tempX = randInt(5,-5);
    var tempY = randInt(20,1);
    var tempZ = randInt(-4,-4);
    log("X = "+tempX.toString()+", Y = "+tempY.toString())
    const newEntity = document.createElement(primitive);
    newEntity.setAttribute("position",tempX.toString()+" "+(entityArray.length+2)+" "+tempZ );
    newEntity.setAttribute("scale","0.9 0.9 0.9" );
    temp =  randInt(colorArray.length, 0);
    log(temp.toString());
    const tempCol = colorArray[temp];
    log(tempCol);
    
    newEntity.setAttribute("material", "color:"+tempCol);
    newEntity.setAttribute("sound", "src: #"+tempCol+"-cay; poolSize : 5; on: click");
    newEntity.setAttribute("dynamic-body", "mass:1; rotation-constraint:y; position-constraint:y");
    
    entityArray.push(newEntity);
    scene.appendChild(newEntity);
  }
}
