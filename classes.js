class Sprite {
    // does not matter which order we pass things through
    constructor({position, image, frames = { max : 1, hold: 10 }, sprites, animate = false, rotation = 0}) { //whenever you create a new instance of a sprite, we call this code first!  
        this.position = position 
        this.image = new Image()
        this.frames = {...frames, val: 0, elasped: 0 }
         
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }

        this.image.src = image.src

        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        
        // this.rotation = rotation  // by radians
    }

    draw() {
        context.save()
        
        // for rotation
        // context.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        // context.rotation(this.rotation) 
        // context.translate(-this.position.x + this.width / 2, -this.position.y + this.height / 2) // translating back so canvas renders
        
        context.globalAlpha = this.opacity
        context.drawImage(
            this.image, 
            this.frames.val * this.width, // determine crop position 
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, 
            this.image.height
        )
        context.restore()

        if (!this.animate) return // we don't call the following code

        if (this.frames.max > 1) {
            this.frames.elasped++
        }
        if (this.frames.elasped % this.frames.hold == 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            
            else this.frames.val = 0
        }
    }    
}

class Monster extends Sprite {
    constructor ({position, image, frames = { max : 1, hold: 10 }, sprites, animate = false, rotation = 0, isEnemy = false, name, attacks}){
        super({position, image, frames, sprites, animate, rotation})

        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint() {
        document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'
        gsap.to(this.position, {y: this.position.y + 20})
        gsap.to(this, {opacity: 0})
        audio.Battle.stop()
        audio.Victory.play()

    }

    attack({attack, recipient, renderedSprites}) {
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name

        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) healthBar = '#playerHealthBar'

        recipient.health -= attack.damage

        switch (attack.name) {
            case 'Tackle':
                const timeline = gsap.timeline()

                let movementDistance = 20
                if (this.isEnemy) movementDistance = -20

                timeline.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2, 
                    duration: 0.1,
                    onComplete: () => {
                        // Enemy actually gets hit
                        audio.TackleHit.play()
                        gsap.to(healthBar, {width: recipient.health + '%'})
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        })
                        gsap.to(recipient, {opacity: 0, repeat: 5, yoyo: true, duration: 0.08})
                    }
                }).to(this.position, {
                    x: this.position.x
                })
            break;

            case 'Fireball':
                // too lazy to complete; not necessary for now
                gsap.to(healthBar, {width: recipient.health + '%'})
            break;
        }
        
    }
}


class Boundary {
    static fullWidth = 48
    static fullHeight = 48
    static halfWidth = this.fullWidth/2
    static halfHeight = this.fullHeight/2

    constructor({position, width, height}) {
        this.position = position
        this.width = width 
        this.height = height 
    }

    draw() {
        context.fillStyle = 'rgba(255, 0, 0, 0.5)' // blocks are in place, but 100% opacity
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}