const express = require('express');
const bodyParser = require('body-parser');
const GLSL = require('glsl-transpiler');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/transpile', (req, res) => {
    const glslCode = req.body.code;
    const transpiler = GLSL({});
    let transpiledJsCode;

    try {
        transpiledJsCode = transpiler(glslCode);
    } catch (error) {
        console.error(error);
        transpiledJsCode = 'Error in transpiling GLSL to JavaScript: ' + error.message;
    }

    res.json({ result: transpiledJsCode });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
