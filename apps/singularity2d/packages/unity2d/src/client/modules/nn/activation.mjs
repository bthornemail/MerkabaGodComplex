/**
 * Returns tanh(x). Output Range: (-1,1).
 * 
 * @param  {Number} x 
* @return {Number}   [description]
*/
const hyperbolic = {
    activate: function (x) {
        var eTwoX = Math.exp(2 * x)
        var output = (eTwoX - 1) / (eTwoX + 1)

        return output
    },
    differentiate: function (x) {
        var activateX = hyperbolic.activate(x)

        return 1 - activateX * activateX
    }
}

/**
* Returns 1 / (1 + e^(-x)). Output Range: (0,1)
* @param  {Number} x
* @return {Number}   
*/
const logistic = {
    activate: function (x) {
        var output = 1 / (1 + Math.exp(-1 * x))

        return output
    },
    differentiate: function (x) {
        var activateX = logistic.activate(x)

        return activateX * (1 - activateX)
    }
}
export { logistic, hyperbolic }