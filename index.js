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
    j: {
        pressed : false
    },
    k: {
        pressed : false
    }
    
}

let dialogueShow = false

// battle
const battle = {
    initiated: false
}
const doorHit = {
    initiated: false
}

// arrays
const collisionsMaps = []
const boundaries = []
const battleZonesMap = []
const battleZones = []
const doorCollisionsMap = []
const doorCollisions = []

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

const strollerImg = new Image()
strollerImg.src = './RPGAssets/Images/stroller.png'

const npcImg = new Image()
npcImg.src = './RPGAssets/Images/playerUp.png'

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

const stroller = new Sprite({position : {x:canvas.width/2 - 192/4, y:canvas.height/2 + 50}, image:strollerImg})

const foreground = new Sprite({position : {x: offset.x, y: offset.y}, image:foregroundImg})
const background = new Sprite({position : {x: offset.x, y: offset.y}, image:backgroundImg})

const npc = new Sprite ({
    position: {
        x: canvas.width/2 + 200,
        y: canvas.height/2 - 100
    },
    image: playerDownImg,
    frames:{
        max: 4,
        hold: 10
    }
})


/**
 * ====================================================================================================
 *                                        SETTING UP THE MAP
 * ====================================================================================================
 */

// Map Generation Tasks

generateBattleZones()
generateCollisions()
generateDoorCollisions()

drawBattleZones()
drawCollisions() 
drawDoorCollisions()

movables = [background, ...boundaries, foreground, ...battleZones, stroller, npc, ...doorCollisions]

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
    doorCollisions.forEach(doorCollision => {
        doorCollision.draw()
    })
}
function generateDoorCollisions(){
    for (let i = 0; i < doorCollisionsData.length; i +=70) { // in increments of 70 (width of map!)
        doorCollisionsMap.push(doorCollisionsData.slice(i, 70 + i)) //i by default is = to 0 
    }
}
function drawDoorCollisions(){
    doorCollisionsMap.forEach((row, i) =>{
        row.forEach((symbol, j) => {
            if (symbol === 1026) { 
                doorCollisions.push(
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

/**
 * ====================================================================================================
 *                                       ANIMATION METHODS 
 * ====================================================================================================
 */


function animate() { 
    const animationId = window.requestAnimationFrame(animate) //call itself, being an infinite loop ! 
    
    // draw background, boundaries, zones, player, and foreground
    drawBackground()
    npc.draw()
    player.draw()
    stroller.draw()
    foreground.draw()
    

    let moving = true
    player.animate = false

    // activate battle
    if (battle.initiated) return // ensures that player cannot move anymore !


    //TODO: fjdsajfiow
    if (keys.j.pressed) { 
        animateStroller()
    }

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

    if (doorHit.initiated) return   

    if (keys.w.pressed || keys.a.pressed  || keys.s.pressed || keys.d.pressed) {
        doorInteraction()
    }

    // dialogue box
    if (keys.k.pressed) {
        console.log('k pressed method')
        npcInteraction()
    }

}

function doorInteraction() {
    if (collidedWithDoor()) {
        console.log('Activate DC')
        window.cancelAnimationFrame(houseAnimationId)
        doorHit.initiated = true 

        audio.Map.stop()
        mapMusicPlaying = false

        doorHitActivate()
        // break
    }
}

function npcInteraction() {
    console.log(collidedWithNpc())

    if (collidedWithNpc()){
        document.querySelector('#userInterface').style.display = 'block'
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 'hello nice to meet you'
    }

    document.querySelector('#dialogueBox').addEventListener('click', (e) => {
        e.currentTarget.style.display = 'none'
        dialogueShow = false
    })
}

function animatePlayer(bool) {
    if (keys.w.pressed && lastKey == 'w'){
        player.offset = {
            x: 0,
            y: +3
        }
        playerKeyDown(bool = bool, image = player.sprites.up)
    }
    else if (keys.a.pressed && lastKey == 'a') {
        player.offset = {
            x: +3,
            y: 0
        }
        playerKeyDown(bool = bool, image = player.sprites.left)
    }
    else if (keys.s.pressed && lastKey == 's') {
        player.offset = {
            x: 0,
            y: -3
        }
        playerKeyDown(bool = bool, image = player.sprites.down)
    }
    else if (keys.d.pressed && lastKey == 'd') {
        player.offset = {
            x: -3,
            y: 0
        }
        playerKeyDown(bool = bool, image = player.sprites.right)
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

function updateMovables(bool) {
    if (bool) {
        movables.forEach((movable) => {
            movable.position.x += player.offset.x
            movable.position.y += player.offset.y
        })
    }
}

function doorHitActivate() {
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
                    animateInterior()
                    cancelIntScene()
                    gsap.to('#overlappingDiv', {
                        opacity: 0,
                        duration: 0.4
                    })
                }
            })
        } 
    })
}

/**
 * ====================================================================================================
 *                                           GAME LOGIC METHODS 
 *                                 This includes any detection methods 
 * ====================================================================================================
 */

function playerKeyDown(bool, image ){
    player.animate = true

    player.image = image

    if (collided() || collidedWithStroller() || collidedWithNpc() || collidedWithDoor()) {
        bool = false
    }
 
    // //When j is held down, player is able to move the stroller 
    if (keys.j.pressed && collidedWithStroller() &&
        !strollerCollision()) {
        console.log("j is being held on")

        // update stroller position
        stroller.position = {
            x: stroller.position.x -= player.offset.x * 0.8, // TODO: Fix this hard-coded offsets
            y: stroller.position.y -= player.offset.y * 0.8
        }
    }
 
    updateMovables(bool = bool)
}


function collided() {
    for (let i = 0; i < boundaries.length; i++){
        const boundary = boundaries[i]
        // detect sides of the player 
        if (gameCalculator.rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary, 
                position:{
                    x: boundary.position.x + player.offset.x,
                    y: boundary.position.y + player.offset.y
                }
            }
        })
        ) {
            return true
        }
    }
}

/**
 * Checks if stroller collides with player ! 
 * @returns 
 */
function collidedWithStroller() { 
    if (gameCalculator.rectangularCollision({
        rectangle1: player,
        rectangle2: {  
            ...stroller, 
            position: {
                x: stroller.position.x + player.offset.x,
                y: stroller.position.y + player.offset.y
            }
        }
        }))
    {
        console.log("Player collided w/ the stroller")
        return true
    }
}

function strollerCollision(){ 
    for (let i = 0; i < boundaries.length; i++){
        const boundary = boundaries[i]
        // detect sides of the player 
        if (gameCalculator.rectangularCollision({
            rectangle1: stroller,
            rectangle2: {
                ...boundary, 
                position:{
                    x: boundary.position.x + player.offset.x,
                    y: boundary.position.y + player.offset.y
                }
            }
        })
        ) {
            return true
        }
    }
}

function collidedWithNpc() {
    if (gameCalculator.rectangularCollision({
        rectangle1: player,
        rectangle2: {
            ...npc, 
            position:{
                x: npc.position.x + player.offset.x,
                y: npc.position.y + player.offset.y
            }
        }
    })) 
    {
        return true
    }
}

function collidedWithDoor() {
    for (let i = 0; i < doorCollisions.length; i++){
        const doorCollision = doorCollisions[i]

        if (gameCalculator.rectangularCollision({
            rectangle1: player, 
            rectangle2: {  
                ...doorCollision, 
                position: {
                    x: doorCollision.position.x + player.offset.x,
                    y: doorCollision.position.y + player.offset.y
                }
            }})   
        )
        {
            return true
        }
    }
}

/**
 * ==========================================================================================
 *                                STROLLER MOVING LISTENERS 
 * ==========================================================================================
 */

function animateStroller() { 
    if (keys.w.pressed){ 
        strollerTop()
    }

    else if (keys.s.pressed) {
        strollerBottom()
    }

    else if (keys.d.pressed) {
        strollerRight()
    }

    else if (keys.a.pressed) {
        strollerLeft()
    }
}

function strollerTop() { 
    if (collidedWithStroller()) {
        if (!gameCalculator.calculateTop({user: player, item: stroller})) {
            stroller.position = {
                x: player.position.x,
                y: player.position.y - stroller.height
            }
        }
    }
}

function strollerBottom() {
    if (collidedWithStroller()) {
        if (gameCalculator.calculateTop({user: player, item: stroller})) {
            stroller.position = {
                x: player.position.x,
                y: player.position.y + player.height
            }
        }
    }
}

function strollerRight() {
    if (collidedWithStroller()) {
        if (!gameCalculator.calculateRight({user: player, item: stroller})) { 
            stroller.position = {
                x: player.position.x + player.width,
                y: player.position.y
            }
        }
    }
}

function strollerLeft() {
    if (collidedWithStroller()) {
        if (gameCalculator.calculateRight({user: player, item: stroller})) {
            stroller.position = {
                x: player.position.x - player.width,
                y: player.position.y
            } 
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
        case 'j':
            keys.j.pressed = true
            keys.k.pressed = false
            break
        case 'k':
            keys.k.pressed = true
            keys.j.pressed = false
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
        case 'j':
            keys.j.pressed = false
            break
        case 'k':
            keys.k.pressed = false
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

