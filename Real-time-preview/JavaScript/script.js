        // 必要な要素を取得
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-editor');
        const previewFrame = document.getElementById('preview-frame');
        const htmlLoadBtn = document.getElementById('html-load-btn');
        const htmlSaveBtn = document.getElementById('html-save-btn');
        const cssLoadBtn = document.getElementById('css-load-btn');
        const cssSaveBtn = document.getElementById('css-save-btn');
        const htmlColorPickerBtn = document.getElementById('html-color-picker-btn');
        const cssColorPickerBtn = document.getElementById('css-color-picker-btn');
        const htmlColorPicker = document.getElementById('html-color-picker');
        const cssColorPicker = document.getElementById('css-color-picker');
        const htmlColorInput = document.getElementById('html-color-input');
        const htmlHexInput = document.getElementById('html-hex-input');
        const cssColorInput = document.getElementById('css-color-input');
        const cssHexInput = document.getElementById('css-hex-input');
        const htmlColorPreview = htmlColorPicker.querySelector('.color-preview');
        const cssColorPreview = document.querySelector('.color-preview'); //修正箇所
        const htmlApplyBtn = htmlColorPicker.querySelector('.apply-button');
        const cssApplyBtn = cssColorPicker.querySelector('.apply-button');
        const htmlCloseBtn = htmlColorPicker.querySelector('.close-button');
        const cssCloseBtn = cssColorPicker.querySelector('.close-button'); //修正箇所
        const htmlColorPresets = htmlColorPicker.querySelectorAll('.color-preset');
        const cssColorPresets = cssColorPicker.querySelectorAll('.color-preset');
        
        let htmlSelectionStart = 0;
        let htmlSelectionEnd = 0;
        let cssSelectionStart = 0;
        let cssSelectionEnd = 0;
        
        // プレビューを更新する関数
        function updatePreview() {
            try {
                const html = htmlEditor.value;
                const css = cssEditor.value;
                const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                frameDoc.open();
                frameDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>${css}</style>
                    </head>
                    <body>${html}</body>
                    </html>
                `);
                frameDoc.close();
                const existingError = document.querySelector('.error');
                if (existingError) {
                    existingError.remove();
                }
            } catch (error) {
                showError(error.message);
            }
        }
        
        function showError(message) {
            const existingError = document.querySelector('.error');
            if (existingError) {
                existingError.remove();
            }
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = `エラー: ${message}`;
            document.querySelector('.preview-container').appendChild(errorDiv);
        }
        
        // ファイルを保存する関数
        function saveFile(content, filename) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        // ファイルをロードする関数
        function loadFile(callback) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.html,.css';
            input.onchange = function (event) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function (event) {
                    callback(event.target.result);
                };
                reader.readAsText(file);
            };
            input.click();
        }
        
        // イベントリスナー
        htmlLoadBtn.addEventListener('click', () => {
            loadFile((content) => {
                htmlEditor.value = content;
                updatePreview();
            });
        });
        
        htmlSaveBtn.addEventListener('click', () => {
            saveFile(htmlEditor.value, 'index.html');
        });
        
        cssLoadBtn.addEventListener('click', () => {
            loadFile((content) => {
                cssEditor.value = content;
                updatePreview();
            });
        });
        
        cssSaveBtn.addEventListener('click', () => {
            saveFile(cssEditor.value, 'styles.css');
        });
        
        htmlColorPickerBtn.addEventListener('click', () => {
            htmlSelectionStart = htmlEditor.selectionStart;
            htmlSelectionEnd = htmlEditor.selectionEnd;
            const selectedText = htmlEditor.value.substring(htmlSelectionStart, htmlSelectionEnd);
            const colorRegex = /#([0-9A-Fa-f]{3}){1,2}\b/;
            const colorMatch = selectedText.match(colorRegex);
            if (colorMatch) {
                const color = colorMatch[0];
                htmlColorInput.value = color;
                htmlHexInput.value = color;
                htmlColorPreview.style.backgroundColor = color;
            }
            htmlColorPicker.style.top = '50px';
            htmlColorPicker.style.left = '50px';
            htmlColorPicker.classList.add('visible');
        });
        
        cssColorPickerBtn.addEventListener('click', () => {
            cssSelectionStart = cssEditor.selectionStart;
            cssSelectionEnd = cssEditor.selectionEnd;
            const selectedText = cssEditor.value.substring(cssSelectionStart, cssSelectionEnd);
            const colorRegex = /#([0-9A-Fa-f]{3}){1,2}\b/;
            const colorMatch = selectedText.match(colorRegex);
            if (colorMatch) {
                const color = colorMatch[0];
                cssColorInput.value = color;
                cssHexInput.value = color;
                cssColorPreview.style.backgroundColor = color;
            }
            cssColorPicker.style.top = '50px';
            cssColorPicker.style.left = '50px';
            cssColorPicker.classList.add('visible');
        });
        
        htmlColorInput.addEventListener('input', function () {
            const color = this.value;
            htmlHexInput.value = color;
            htmlColorPreview.style.backgroundColor = color;
        });
        
        cssColorInput.addEventListener('input', function () {
            const color = this.value;
            cssHexInput.value = color;
            cssColorPreview.style.backgroundColor = color;
        });
        
        htmlHexInput.addEventListener('input', function () {
            const color = this.value;
            if (color.match(/#([0-9A-Fa-f]{3}){1,2}\b/)) {
                htmlColorInput.value = color;
                htmlColorPreview.style.backgroundColor = color;
            }
        });
        
        cssHexInput.addEventListener('input', function () {
            const color = this.value;
            if (color.match(/#([0-9A-Fa-f]{3}){1,2}\b/)) {
                cssColorInput.value = color;
                cssColorPreview.style.backgroundColor = color;
            }
        });
        
        htmlColorPresets.forEach(preset => {
            preset.addEventListener('click', function () {
                const color = this.getAttribute('data-color');
                htmlColorInput.value = color;
                htmlHexInput.value = color;
                htmlColorPreview.style.backgroundColor = color;
            });
        });
        
        cssColorPresets.forEach(preset => {
            preset.addEventListener('click', function () {
                const color = this.getAttribute('data-color');
                cssColorInput.value = color;
                cssHexInput.value = color;
                cssColorPreview.style.backgroundColor = color;
            });
        });
        
        htmlApplyBtn.addEventListener('click', function () {
            const color = htmlHexInput.value;
            const text = htmlEditor.value;
            if (htmlSelectionEnd > htmlSelectionStart) {
                const newText = text.substring(0, htmlSelectionStart) + color + text.substring(htmlSelectionEnd);
                htmlEditor.value = newText;
                htmlEditor.selectionStart = htmlSelectionStart;
                htmlEditor.selectionEnd = htmlSelectionStart + color.length;
            } else {
                const newText = text.substring(0, htmlSelectionStart) + color + text.substring(htmlSelectionStart);
                htmlEditor.value = newText;
                htmlEditor.selectionStart = htmlSelectionStart + color.length;
                htmlEditor.selectionEnd = htmlSelectionStart + color.length;
            }
            updatePreview();
            htmlColorPicker.classList.remove('visible');
            htmlEditor.focus();
        });
        
        cssApplyBtn.addEventListener('click', function () {
            const color = cssHexInput.value;
            const text = cssEditor.value;
            if (cssSelectionEnd > cssSelectionStart) {
                const newText = text.substring(0, cssSelectionStart) + color + text.substring(cssSelectionEnd);
                cssEditor.value = newText;
                cssEditor.selectionStart = cssSelectionStart;
                cssEditor.selectionEnd = cssSelectionStart + color.length;
            } else {
                const newText = text.substring(0, cssSelectionStart) + color + text.substring(cssSelectionStart);
                cssEditor.value = newText;
                cssEditor.selectionStart = cssSelectionStart + color.length;
                cssEditor.selectionEnd = cssSelectionStart + color.length;
            }
            updatePreview();
            cssColorPicker.classList.remove('visible');
            cssEditor.focus();
        });
        
        htmlCloseBtn.addEventListener('click', function () {
            htmlColorPicker.classList.remove('visible');
        });
        
        cssCloseBtn.addEventListener('click', function () {
            cssColorPicker.classList.remove('visible');
        });
        
        document.addEventListener('click', function (e) {
            if (!htmlColorPicker.contains(e.target) && e.target !== htmlColorPickerBtn) {
                htmlColorPicker.classList.remove('visible');
            }
            if (!cssColorPicker.contains(e.target) && e.target !== cssColorPickerBtn) {
                cssColorPicker.classList.remove('visible');
            }
        });
        
        htmlEditor.addEventListener('input', updatePreview);
        cssEditor.addEventListener('input', updatePreview);
        
        window.addEventListener('load', updatePreview);