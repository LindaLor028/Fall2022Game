/**
 * ====================================================================================================
 *                           INITIALIZE VARS, VALS, SPRITES, AND IMAGES
 * ====================================================================================================
 */

// backend stuff
 const canvas = document.querySelector('canvas')
 const context = canvas.getContext('2d') //2d API? 
    context.rect(-1360, -400, 10, 10)
    context.fillStyle = "red"
    context.fill()

// canvas size 
canvas.width =  1024 //resizing canvas
canvas.height = 576 

// canvas offset
const offset = {
    x: -1360,
    y: -450
}

// gameCalculator 
const gameCalculator = new GameCalculator()

// (keyboard) keys
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false 
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false 
    },
    f: {
        pressed: false 
    }
}

let dialogueShow = false

// battle
const battle = {
    initiated: false
}

// arrays
const collisionsMaps = []
const boundaries = []
const battleZonesMap = []
const battleZones = []

var movables = [] // ... spread operator so we don't have a 2d array stuff

// images
const backgroundImg = new Image()
backgroundImg.src = './RPGAssets/TestMap.png'

const foregroundImg = new Image()
foregroundImg.src = './RPGAssets/ForegroundTest.png'

const playerUpImg = new Image()
playerUpImg.src = './RPGAssets/Images/playerUp.png'

const playerDownImg = new Image()
playerDownImg.src = './RPGAssets/Images/playerDown.png'

const playerRightImg = new Image()
playerRightImg.src = './RPGAssets/Images/playerRight.png'

const playerLeftImg = new Image()
playerLeftImg.src = './RPGAssets/Images/playerLeft.png'

// Sprites
const player = new Sprite ({
    position: {
        x: canvas.width/2 - 192/4/2,
        y: canvas.height/2 - 64/2
    },
    image: playerDownImg,
    frames:{
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImg,
        down: playerDownImg,
        right: playerRightImg,
        left: playerLeftImg
    }
})

const foreground = new Sprite({position : {x: offset.x, y: offset.y}, image:foregroundImg})
const background = new Sprite({position : {x: offset.x, y: offset.y}, image:backgroundImg})


/**
 * ====================================================================================================
 *                                        SETTING UP THE MAP
 * ====================================================================================================
 */

// Map Generation Tasks

generateBattleZones()
generateCollisions()

drawBattleZones()
drawCollisions() 

movables = [background, ...boundaries, foreground, ...battleZones]

// Animations
animate()

/**
 * ====================================================================================================
 *                                       MAP-DRAWING METHODS
 *             Below contains all methods used to draw items on game map. 
 * drawCollisions() : collisions[]
 * drawBattleZones() : battleZones[]
 * TODO: Add a new zone for entering houses and more !
 * TODO: Add a zone for dialogue starters !
 * ====================================================================================================
 */

 function generateCollisions() {
    for (let i = 0; i < collisions.length; i +=70) { // in increments of 70 (width of map!)
        collisionsMaps.push(collisions.slice(i, 70 + i)) //i by default is = to 0 
    }
}

function drawCollisions() {
    collisionsMaps.forEach((row, i) =>{
        row.forEach((symbol, j) => {
            if (symbol === 1025) {  // 1025
                boundaries.push(
                    new Boundary ({ 
                        position : {
                            x: j * Boundary.fullWidth + offset.x, 
                            y: i * Boundary.fullHeight + offset.y
                        },
                        width : Boundary.halfWidth,
                        height: Boundary.fullHeight
                    })
                ) 
            }

            if (symbol === 1026) {  // 1026
                boundaries.push(
                    new Boundary ({ 
                        position : {
                            x: j * Boundary.fullWidth + offset.x, 
                            y: i * Boundary.fullHeight + offset.y
                        },
                        width : Boundary.fullWidth,
                        height: Boundary.fullHeight
                    })
                ) 
            }

            if (symbol === 1027) { // 1027
                boundaries.push(
                    new Boundary ({ 
                        position : {
                            x: j * Boundary.fullWidth + Boundary.halfWidth + offset.x, 
                            y: i * Boundary.fullHeight + offset.y
                        },
                        width : Boundary.halfWidth,
                        height: Boundary.fullHeight
                    })
                ) 
            }
        
            if (symbol === 1028) {  // 1028
                boundaries.push(
                    new Boundary ({ 
                        position : {
                            x: j * Boundary.fullWidth + offset.x, 
                            y: i * Boundary.fullHeight + offset.y
                        },
                        width : Boundary.fullWidth,
                        height: Boundary.halfHeight
                    })
                ) 
            }

            if (symbol === 1029) { // 1029
                boundaries.push(
                    new Boundary ({ 
                        position : {
                            x: j * Boundary.fullWidth + offset.x, 
                            y: i * Boundary.fullHeight + Boundary.halfHeight +  offset.y
                        },
                        width : Boundary.fullWidth,
                        height: Boundary.halfHeight
                    })
                ) 
            }
        })
    })
}


function generateBattleZones() {
    for (let i = 0; i < battleZonesData.length; i +=70) { // in increments of 70 (width of map!)
        battleZonesMap.push(battleZonesData.slice(i, 70 + i)) //i by default is = to 0 
    }
}

function drawBattleZones() {
    battleZonesMap.forEach((row, i) =>{
        row.forEach((symbol, j) => {
            if (symbol === 1025) { 
                battleZones.push(
                    new Boundary ({ 
                        position : {
                            x: j * Boundary.fullWidth + offset.x, 
                            y: i * Boundary.fullHeight + offset.y
                        },
                        width : Boundary.fullWidth,
                        height: Boundary.fullHeight
                    })
                ) 
            }
        })
    })
}

function drawBackground() {
    background.draw()

    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
}

/**
 * ====================================================================================================
 *                                       ANIMATION METHODS 
 * ====================================================================================================
 */
function animate() { 
    const animationId = window.requestAnimationFrame(animate) //call itself, being an infinite loop ! 
    
    // draw background, boundaries, zones, player, and foreground
    drawBackground()
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    // activate battle
    if (battle.initiated) return // ensures that player cannot move anymore !

    if (keys.w.pressed || keys.a.pressed  || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++){
            const battleZone = battleZones[i]
            const overlappingArea = gameCalculator.calculateOverlap({rectangle1:player, rectangle2:battleZone})

            // detect sides of the player
            if (gameCalculator.rectangularCollision({rectangle1: player, rectangle2: battleZone}) && 
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.1 // 10 % chance to activate the battle !
            ) 
            {
                // deactivate current animation loop 
                window.cancelAnimationFrame(animationId)
                battle.initiated = true

                // adjust audio
                audio.Map.stop()
                mapMusicPlaying = false
                audio.InitBattle.play()
                audio.Battle.play()
                
                // TODO: If you have a moving sprite, this would stop them from moving as well !
                animateBattleStart()
                break
            }
        }
    }

    // animate Player sprite based on key detection
    animatePlayer(bool = moving)

    // dialogue box
    if (keys.f.pressed){
        console.log('f pressed method')
        document.querySelector('#userInterface').style.display = 'block'
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 'hello nice to meet you'
    }

    document.querySelector('#dialogueBox').addEventListener('click', (e) => {
        e.currentTarget.style.display = 'none'
    })
    
}

function animatePlayer(bool) {
    if (keys.w.pressed && lastKey == 'w'){
        playerKeyDown(bool = bool, image = player.sprites.up,
            xChange = 0, yChange = +3 )
    }
    else if (keys.a.pressed && lastKey == 'a') {
        playerKeyDown(bool = bool, image = player.sprites.left,
            xChange = 3, yChange = 0 )
    }
    else if (keys.s.pressed && lastKey == 's') {
        playerKeyDown(bool = bool, image = player.sprites.down,
            xChange = 0, yChange = -3 )
    }
    else if (keys.d.pressed && lastKey == 'd') {
        playerKeyDown(bool = bool, image = player.sprites.right,
            xChange = -3, yChange = 0 )
    }
}

function animateBattleStart() {
    gsap.to('#overlappingDiv', {
        opacity: 1, 
        repeat: 3,
        yoyo: true,
        duration: 0.4,
        onComplete() {
            gsap.to('#overlappingDiv', {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                    initBattle()
                    animateBattle()
                    gsap.to('#overlappingDiv', {
                        opacity: 0,
                        duration: 0.4
                    })
                }
            })
        } 
    })
}

function updateMovables(bool, xOffset, yOffset) {
    if (bool) {
        movables.forEach((movable) => {
            movable.position.x += xOffset
            movable.position.y += yOffset
        })
    }
}

/**
 * ====================================================================================================
 *                                           GAME LOGIC METHODS 
 *                                 This includes any detection methods 
 * ====================================================================================================
 */

function playerKeyDown(bool, image, xChange, yChange ){
    player.animate = true
    player.image = image

    if (collided(xOffset = xChange, yOffset = yChange)) {
        bool = false
    }
    updateMovables(bool = bool, xOffset = xChange, yOffset = yChange)
}

function collided(xOffset,  yOffset) {
    for (let i = 0; i < boundaries.length; i++){
        const boundary = boundaries[i]
        // detect sides of the player 
        if (gameCalculator.rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary, 
                position:{
                    x: boundary.position.x + xOffset,
                    y: boundary.position.y + yOffset
                }
            }
        })
        ) {
            return true
        }
    }
}


/**
 * ==========================================================================================
 *                                     KEY LISTENERS
 * ==========================================================================================
 */

let lastKey = ''
// detecting key down
window.addEventListener('keydown', (e) => {
     switch (e.key) { 
        case 'w': //whenever e.key is w
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a': 
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's': 
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'f':
            keys.f.pressed = true
            dialogueShow = true
            break
    }
})

// detecting key up
window.addEventListener('keyup', (e) => {
    switch (e.key) { 
        case 'w': //whenever e.key is w
            keys.w.pressed = false
            break
        case 'a': 
            keys.a.pressed = false
            break
        case 's': 
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'f':
            keys.f.pressed = false
            break
    }
})

/**
 * ==========================================================================================
 *                                     AUDIO LISTENER
 * ==========================================================================================
 */

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})
