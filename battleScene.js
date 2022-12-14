const battleBackgroundImg = new Image()
battleBackgroundImg.src = './RPGAssets/Images/battleBackground.png'

const battleBackground = new Sprite({position: { x: 0,y: 0},image: battleBackgroundImg})

let draggle
let emby
let renderedSprites 

let battleAnimationId

let queue

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#enemyBar').style.display = 'block'
    document.querySelector('#playerBar').style.display = 'block'
    document.querySelector('#bottomBar').style.display = 'flex'
    document.querySelector('#attackBox').style.display = 'grid'
    document.querySelector('#attackTypeBox').style.display = 'flex'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attackBox').replaceChildren()

    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderedSprites = [draggle, emby]  // help render and draw additional sprites for attacks, etc.

    emby.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attackBox').append(button)
    })

    queue = [] // attacks

    // event listener for buttons (attacks)
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            emby.attack({attack: selectedAttack, recipient: draggle, renderedSprites})

            if (draggle.health <= 0) {
                queue.push(() => {draggle.faint()})
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1, 
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId), 
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {opacity: 0})
                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                })
                return
            }

            //enemy attacks
            queue.push(() => {
                draggle.attack({attack: attacks.Tackle, recipient: emby, renderedSprites})
            })

            if (emby.health <= 0) {
                queue.push(() => {emby.faint()})
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1, 
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId), 
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {opacity: 0})
                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                })
                return
            }
        })

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } 
    else e.currentTarget.style.display = 'none'
})