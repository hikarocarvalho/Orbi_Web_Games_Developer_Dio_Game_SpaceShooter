const yourShip = document.querySelector("#player-shooter");
const playArea = document.querySelector("#main-play-area");
const alienImg = ['./assets/imgs/firstEnemy.png','./assets/imgs/secondEnemy.png','./assets/imgs/thirdEnemy.png']
const instructionsText = document.querySelector('#game-instructions');
const startButton = document.querySelector('#start-button');
let alienInterval;

function flyShip(event){
    event.preventDefault();
    if(event.key === 'ArrowUp'){
        moveUp();
    }else if(event.key === 'ArrowDown'){
        moveDown();
    }else if(event.key === " "){
        fireLaser();
    }
}

function moveUp(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "0px"){
        return 
    } else {
        let position = parseInt(topPosition);
        position -=10;
        yourShip.style.top = `${position}px`;
    }
}

function moveDown(){
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "470px"){
        return 
    } else {
        let position = parseInt(topPosition);
        position +=10;
        yourShip.style.top = `${position}px`;
    }
}

function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser =  document.createElement('img');
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition -10}px`;
    return newLaser;
}

function moveLaser(laser){
    let laserInterval = setInterval(()=>{
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien)=>{
            if(checkLaserCollision(laser,alien)){
                alien.src = './assets/imgs/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if(xPosition === 380){
            window.clearInterval(laserInterval);
            laserInterval = null;
            laser.remove();
        }else{
            laser.style.left = `${xPosition + 8}px`
        }
    },20)
}

function createAliens(){
    let newAlien = document.createElement('img');
    let alienSprite = alienImg[Math.floor(Math.random() * alienImg.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.style.left = '370px';
    newAlien.style.top =  `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien){
    let moveAlienInterval = setInterval(()=>{
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50){
            if(Array.from(alien.classList).includes('dead-alien')){
                alien.remove();
            } else {
                gameOver();
            } 
            window.clearInterval(moveAlienInterval);
            moveAlienInterval = null;
        } else {
            alien.style.left = `${xPosition -4}px`;
        }
    },30);
}

function checkLaserCollision(laser,alien){
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft){
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function playGame(){
    startButton.style.display = "none";
    instructionsText.style.display = "none";
    window.addEventListener('keydown',flyShip);
    alienInterval = setInterval(()=>{
        createAliens();
    },2000);
}

function gameOver(){
    window.removeEventListener('keydown', flyShip);

    window.clearInterval(alienInterval);
    alienInterval = null;

    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien)=>alien.remove());

    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser)=>laser.remove());

    setTimeout(()=>{
        alert('game over');
        yourShip.style.top = "250px";
        startButton.style.display = "flex";
        instructionsText.style.display = "flex";
    })
}

startButton.addEventListener('click',(event)=>{
    event.preventDefault();
    playGame();
})