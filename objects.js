/**
 * ====================================================================================================
 *                                    GameCalculator Object
 *                    This object is responsible for calculating all game-logic related things.
 * 
 * NOTE: The GameCalculator Object can only be instantiated ONCE and is used globally 
 * ====================================================================================================
 */

class GameCalculator {
    constructor() {
        if (GameCalculator.instance instanceof GameCalculator) {
            return GameCalculator.instance
        }
        
        GameCalculator.instance = this
    }

    // mathematical formula that returns the overlapping area between two rectangles 
    calculateOverlap({rectangle1, rectangle2}) {
        return (Math.min(
            rectangle1.position.x + rectangle1.width,
            rectangle2.position.x + rectangle2.width
        ) - 
        Math.max(rectangle1.position.x, rectangle2.position.x)
        ) * 
        (Math.min(
            rectangle1.position.y + rectangle1.height, 
            rectangle2.position.y + rectangle2.height
        ) - 
        Math.max(rectangle1.position.y, rectangle2.position.y))
    }

    //  mathematical formula that detects rectangular collision between two rectangles  
    rectangularCollision({rectangle1, rectangle2}) {
        return (
            rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
            rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
            rectangle1.position.y + rectangle1.height >= rectangle2.position.y 
        )
    }
}

