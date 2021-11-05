var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR; 

var trex, trex_correndo, trex_colidiu;
var solo, imagemdosolo, soloinvisivel, pontuacao;
var nuvem, imagemdanuvem;
var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var grupodenuvens, grupodeobstaculo;
var gameover, restart, gameoverImg, restartImg;
var checkpointS, jumpS, dieS;

function preload(){
  trex_correndo = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud2.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  checkpointS = loadSound("checkPoint.mp3");
  jumpS = loadSound("jump.mp3");
  dieS = loadSound("die.mp3");
  

}

function setup(){
  createCanvas(600,200);
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("colisao", trex_colidiu);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;
  
  solo = createSprite(300,180,600,20);
  solo.addImage("ground", imagemdosolo);
  solo.x = solo.width/2;
  
  gameover = createSprite(300,100);
  gameover.addImage(gameoverImg);
  gameover.scale = 0.5;
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  soloinvisivel = createSprite(300,190,600,10);
  soloinvisivel.visible = false;
  
  //criando os grupos
  grupodenuvens = new Group();
  grupodeobstaculos = new Group();
  
  pontuacao = 0;
  
  //var rand = Math.round(random(1,100));
  //console.log(rand);
  
  var mensagem = "Isto é uma mensagem";
  
  console.log(mensagem);
}

function draw(){
  background("white");
  
  text("SCORE: "+pontuacao,500,50);
  
 console.log("isto é ",estadoJogo);
  
//estado jogar
  if(estadoJogo === JOGAR){
    //MOVER O SOLO
     solo.velocityX = -(4 + pontuacao/250);
    
    gameover.visible = false;
    restart.visible = false;
    
    pontuacao = pontuacao+Math.round(frameRate()/60);
    
    if(solo.x<0){
     solo.x = solo.width/2;
  }
    
    if(keyDown("space") && trex.y>160){
    trex.velocityY = -12;
    jumpS.play();
  }
    
    if(pontuacao%800 === 0 && pontuacao > 0) {
      checkpointS.play();

    }
    
    trex.velocityY = trex.velocityY + 0.8;
    
    gerarNuvens();
  
  gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)) {
      estadoJogo = ENCERRAR;
      dieS.play();
    }
    
  }
  
  //estado encerrar
  else if(estadoJogo === ENCERRAR) {
    //PARAR O SOLO
    solo.velocityX = 0;
    
    gameover.visible = true;
    restart.visible = true;
    
    trex.velocityY = 0;
    
    trex.changeAnimation("colisao", trex_colidiu);
    
    grupodeobstaculos.setVelocityXEach(0);
    grupodenuvens.setVelocityXEach(0);
    
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
    reset();
  }
    
  }
  trex.collide(soloinvisivel);

  drawSprites();
}

function reset(){
  //código da função reiniciar
  estadoJogo = JOGAR;
  gameover.visible = false;
  restart.visible = false;
  grupodenuvens.destroyEach();
  grupodeobstaculos.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao = 0;
  
  
}

function gerarNuvens(){
  if(frameCount%60===0){
    nuvem = createSprite(600,100,40,10);
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.6;
    nuvem.y = Math.round(random(10,60));
    nuvem.velocityX = -2;
    nuvem.lifetime = 300;  
    
    //alterar profundidade da nuvem/trex
    nuvem.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    grupodenuvens.add(nuvem);
    
  }
}

function gerarObstaculos() {
  if(frameCount%100===0) {
    obstaculo = createSprite(600,165,10,40);
    obstaculo.velocityX = -(6 + pontuacao/250);
    
    
    var rand = Math.round(random(1,6));
    
    //criando um caso do sorteio de obstaculos
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
        break;
        case 2: obstaculo.addImage(obstaculo2);
        break;
        case 3: obstaculo.addImage(obstaculo3);
        break;
        case 4: obstaculo.addImage(obstaculo4);
        break;
        case 5: obstaculo.addImage(obstaculo5);
        break;
        case 6: obstaculo.addImage(obstaculo6);
        break;
        default:break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    
    //add ao grupo
    grupodeobstaculos.add(obstaculo);
  }
}