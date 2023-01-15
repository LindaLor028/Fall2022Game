const houseBackgroundImg = new Image()
houseBackgroundImg.src = './RPGAssets/Images/HYBEPrison.png'

const houseBackground = new Sprite({position: { x: 0,y: 0},image: houseBackgroundImg})

let houseAnimationId

function animateInterior() {
    houseAnimationId = window.requestAnimationFrame(animateInterior)
    houseBackground.draw()
}

function cancelIntScene(){
    document.querySelector('canvas').addEventListener('click', (e) => {
        gsap.to('#overlappingDiv', {
            opacity: 1, 
            onComplete: () => {
                cancelAnimationFrame(houseAnimationId) 
                animate()
                gsap.to('#overlappingDiv', {opacity: 0}),
                doorHit.initiated = false,
                audio.Map.play()
                }
            })

        })
}