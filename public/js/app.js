window.addEventListener('DOMContentLoaded', (event) => {
    function generateSwizzles(maxLength, current = '', swizzles = []) {
        const components = ['x', 'y', 'z'];

        if (current.length >= maxLength) {
            return swizzles;
        }

        for (let component of components) {
            let newSwizzle = current + component;
            swizzles.push(newSwizzle);
            generateSwizzles(maxLength, newSwizzle, swizzles);
        }

        return swizzles;
    }

    const swizzles = generateSwizzles(4);

    for (let swizzle of swizzles) {
        Object.defineProperty(Array.prototype, swizzle, {
            get: function() {
                return swizzle.split('').map(c => {
                    switch (c) {
                        case 'x': return this[0];
                        case 'y': return this[1];
                        case 'z': return this[2];
                        default: return undefined;
                    }
                });
            }
        });
    }

    const glslEditor = CodeMirror(document.getElementById('glslEditor'), {
        lineNumbers: true,
        matchBrackets: true,
        mode: "text/x-csrc",
        theme: "gruvbox-dark",
        indentUnit: 4,
        indentWithTabs: true,
        fontSize: '20pt'
    });
    glslEditor.setSize(null, '600px');

    const txtAnsw = document.getElementById('txtAnsw');
    const btnRun = document.getElementById('btnRun');

    // Define the print function
    var print = function (){
        let str = Array.prototype.join.call(arguments, " ");
        console.log(str);
        txtAnsw.value += str + "\n";
    };

    btnRun.addEventListener('click', () => {
        let glslCode = glslEditor.getValue();
        let glslLines = glslCode.split('\n');
        let printLines = {};

        // Replace print function calls in GLSL code
        for (let i = 0; i < glslLines.length; i++) {
            if (glslLines[i].includes('print')) {
                printLines['print' + i] = glslLines[i];
                glslLines[i] = 'float print' + i + ' = 0.;';
            }
        }
        glslCode = glslLines.join('\n');

        fetch('/transpile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: glslCode })
        })
        .then(response => response.json())
        .then(data => {
            let transpiledJsCode = data.result;
            let transpiledJsLines = transpiledJsCode.split('\n');

            // Replace print function calls in transpiled JavaScript code
            for (let i = 0; i < transpiledJsLines.length; i++) {
                if (transpiledJsLines[i].includes('print')) {
                    transpiledJsLines[i] = printLines[transpiledJsLines[i].split(' ')[1]];
                }
            }
            transpiledJsCode = transpiledJsLines.join('\n');

            // Try to evaluate the transpiled JavaScript code
            try {
                eval(transpiledJsCode);
            } catch (error) {
                console.error(error);
                txtAnsw.value = 'Error in evaluating JavaScript code: ' + error.message;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
