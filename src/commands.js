import GLSL from 'glsl-transpiler'
import {Editor} from './editor'
export let Commands = {
    run: function(){
        let glslCode = Editor.getCode()
        const glslLines = glslCode.split('\n')
        const printLines = {}

        // Hack: Replace print function calls in GLSL code
        for (let i = 0; i < glslLines.length; i++) {
            if (glslLines[i].includes('print')) {
                printLines['print' + i] = glslLines[i]
                glslLines[i] = 'float print' + i + ' = 0.;'
            }
        }
        glslCode = glslLines.join('\n')
        const transpiler = GLSL({})
        let transpiledJsCode

        try {
            transpiledJsCode = transpiler(glslCode)
        } catch (error) {
            console.error(error)
            transpiledJsCode = 'Error in transpiling GLSL to JavaScript: ' + error.message
        }

        let transpiledJsLines = transpiledJsCode.split('\n')

        // Hack: Replace print function calls in transpiled JavaScript code
        for (let i = 0; i < transpiledJsLines.length; i++) {
            if (transpiledJsLines[i].includes('print')) {
                transpiledJsLines[i] = printLines[transpiledJsLines[i].split(' ')[1]]
            }
        }
        transpiledJsCode = transpiledJsLines.join('\n')

        // Try to evaluate the transpiled JavaScript code
        let span = document.createElement('span')
        try {
            eval(transpiledJsCode)
            span.textContent = '\n'
        } catch (error) {
            let str = 'Error in transpiling GLSL to JavaScript:\n  ' + error.message + '\n'
            str += '  '+transpiledJsCode.replace('Error in transpiling GLSL to JavaScript: ', '') + '\n\n'
            console.error(str)
            span.id = 'errorText'
            span.textContent = str
        }
        txtAnsw.appendChild(span)
        Commands.autoScroll()
    },

    autoScroll: function(){
        const txtAnsw = document.getElementById('txtAnsw')
        txtAnsw.scrollTop = txtAnsw.scrollHeight
    }
}
