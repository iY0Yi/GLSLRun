// Build swizzles on Array object
// ---------------------------------------------------------------
function buildSwizzleCombos(maxLength, components = ['x', 'y', 'z', 'w'], current = '', swizzles = []) {
    if (current.length >= maxLength) return swizzles
    for (let component of components) {
        let newSwizzle = current + component
        swizzles.push(newSwizzle)
        buildSwizzleCombos(maxLength, components, newSwizzle, swizzles)
    }
    return swizzles
}

const swXYZW = buildSwizzleCombos(4, ['x', 'y', 'z', 'w'])
const swRGBA = buildSwizzleCombos(4, ['r', 'g', 'b', 'a'])

export let Swizzles = {
    init: function(){
        for (let sw of swXYZW) {
            Object.defineProperty(Array.prototype, sw, {
                get: function() {
                    return sw.split('').map(c => {
                        switch (c) {
                            case 'x': return this[0]
                            case 'y': return this[1]
                            case 'z': return this[2]
                            case 'w': return this[3]
                            default: return undefined
                        }
                    })
                }
            })
        }

        for (let sw of swRGBA) {
            Object.defineProperty(Array.prototype, sw, {
                get: function() {
                    return sw.split('').map(c => {
                        switch (c) {
                            case 'r': return this[0]
                            case 'g': return this[1]
                            case 'b': return this[2]
                            case 'a': return this[3]
                            default: return undefined
                        }
                    })
                }
            })
        }
    }
}