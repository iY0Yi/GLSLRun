import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/keymap/sublime'
import 'codemirror/mode/clike/clike'
export let Editor = {
    cm: null,
    init: function(){
        const divEditor = document.getElementById('glslEditor')
        this.cm = CodeMirror(divEditor, {
            lineNumbers: true,
            matchBrackets: true,
            mode: 'x-shader/x-fragment',
            theme: "glslrun-dark",
            fontSize: '26pt',
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
        })
        this.cm.setSize(null, '600px')
        this.cm.getDoc().setValue(`#define PI acos(-1.);
for(float i=0.; i<200.; i++){
    float a = i/200.*PI;
    vec2 v = vec2(sin(a), cos(a));
    print(v);
}`)

        // Adjust the editor's height
        function adjustEditorHeight(){
            const footerHeight = document.getElementById('footer').offsetHeight
            const windowHeight = window.innerHeight
            Editor.cm.setSize(null, `${windowHeight - footerHeight}px`)
        }

        // Initial adjustment
        adjustEditorHeight()
        // Adjust the editor's height whenever the window is resized
        window.addEventListener('resize', adjustEditorHeight)
    },
    getCode: function(){
        return this.cm.getValue()
    }
}
