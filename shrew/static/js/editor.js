import CodeMirror from "codemirror-minified";
import "codemirror-minified/mode/python/python";
import "codemirror-minified/addon/edit/closebrackets";
import "codemirror-minified/addon/lint/lint";
import "codemirror-minified/addon/hint/show-hint";


import replaceError from "./error-replacements.js";
import autocomplete from "./autocomplete.js";


const textarea = document.getElementById("editor-code");

if (textarea) {
    const iframe = document.getElementById("interpreter-sandbox");
    const output = document.getElementById("code-output");
    const sandbox = iframe.contentWindow;
    let editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        theme: "shrew",
        indentUnit: 4,
        autofocus: true,
        autoCloseBrackets: true,
        lint: {
            getAnnotations: runLint,
            async: true,
        },
        gutters: ["CodeMirror-lint-markers"],
        hintOptions: {
            hint: autocomplete,
            completeSingle: false,
            extraKeys: {
                Enter: (cm, menu) => {
                    menu.close();
                    CodeMirror.commands.newlineAndIndent();
                }, // don't accept on enter
            }
        },
    });
    editor.on('cursorActivity', () => {
        editor.showHint();
    });
    let lintCallback;
    let shrewInterpreterReady = false;

    function runCode() {
        sandbox.postMessage({code: editor.getValue()}, "*");
    }

    function runLint(text, callback) {
        if (shrewInterpreterReady) {
            runCode();
        }
        lintCallback = callback;
    }

    window.addEventListener("message", (event) => {
        if (event.data.type === "interpreter-ready") {
            shrewInterpreterReady = true;
            runCode();
        } else if(event.data.type === "run-result") {
            output.innerHTML = ''; // clear output
            for (let line of event.data.out) {
                let pre = document.createElement('pre');
                pre.innerText = line;
                output.appendChild(pre);
            }
            let errors = [];
            if (event.data.error) {
                let message = replaceError(event.data.error.message);
                let lineNumber = event.data.error.lineNumber;

                let pre = document.createElement('pre');
                pre.innerText = `${message} (line ${lineNumber})`;
                pre.classList.add("error");
                output.appendChild(pre);

                errors.push({
                    from: CodeMirror.Pos(lineNumber - 1),
                    to: CodeMirror.Pos(lineNumber - 1),
                    message: message,
                });
            }
            if (lintCallback) {
                lintCallback(errors);
            }
        }
    });
}
