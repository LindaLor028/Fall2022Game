class Sprite {
    // does not matter which order we pass things through
    constructor({position, image, frames = { max : 1}, sprites }) { //whenever you create a new instance of a sprite, we call this code first!  
        this.position = position 
        this.image = image
        this.frames = {...frames, val: 0, elasped: 0 }
         
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
        
    }

    draw() {
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

        if (!this.moving) return // we don't call the following code

        if (this.frames.max > 1) {
            this.frames.elasped++
        }
        if (this.frames.elasped % 10 == 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            
            else this.frames.val = 0
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