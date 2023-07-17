window.addEventListener('DOMContentLoaded', (event) => {
    OS = null;
    function detectOS() {
        // Detect your OS.
        OS = 'Android' // default
        const ua = navigator.userAgent;
        if (ua.indexOf('Windows') > -1) OS = 'Windows'
        else if (ua.indexOf('iPhone') > -1) OS = 'iOS'
        else if (ua.indexOf('iPad') > -1) OS = 'iPadOS'
        else if (ua.indexOf('Mac') > -1){
            if(!('ontouchend' in document)) OS = 'MacOS'
            else OS = 'iPadOS'
        }
        else if (ua.indexOf('X11') > -1) OS = 'UNIX'
        else if (ua.indexOf('Linux') > -1) OS = 'Linux'
        else if (ua.indexOf('Android') > -1) OS = 'Android'

        console.log('OS: ', OS)
    }


    function generateSwizzles(maxLength, current = '', swizzles = []) {
        const components = ['x', 'y', 'z', 'w'];

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
                        case 'w': return this[3];
                        default: return undefined;
                    }
                });
            }
        });
    }

    const glslEditor = CodeMirror(document.getElementById('glslEditor'), {
        lineNumbers: true,
        matchBrackets: true,
        mode: 'x-shader/x-fragment',
        theme: "gruvbox-dark",
        fontSize: '20pt',
        cursorBlinkRate: 530,
        smartIndent: true,
        indentWithTabs: false,
        indentUnit: 4,
        showInvisibles: true,
        maxInvisibles: 16,
        keyMap: 'sublime',
        styleActiveLine: true,
        styleSelectedText: true,
        styleCursor: true,
        autoCloseBrackets: false,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        selectionPointer: true,
        autofocus: true,
        continuousScanning: 500,
        foldGutter: true
    });
    glslEditor.setSize(null, '600px');

    // Adjust the editor's height
    const adjustEditorHeight = () => {
        const footerHeight = document.getElementById('footer').offsetHeight;
        const windowHeight = window.innerHeight;
        glslEditor.setSize(null, `${windowHeight - footerHeight}px`);
    };

    // Initial adjustment
    adjustEditorHeight();

    // Adjust the editor's height whenever the window is resized
    window.addEventListener('resize', adjustEditorHeight);

    const txtAnsw = document.getElementById('txtAnsw');
    const btnRun = document.getElementById('btnRun');

    // Define the print function
    var print = function (){
        let str = Array.prototype.join.call(arguments, " ");
        console.log(str);
        txtAnsw.value += str + "\n";
    };

    const run = () => {
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
    };

    btnRun.addEventListener('click', run);

    key.filter = function(event){return true;}
    key('⌥+enter', run)
    key.setScope('default');
});
