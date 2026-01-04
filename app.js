// Configurazione PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Stato dell'applicazione
const state = {
    pdfDoc: null,
    pdfBytes: null,
    currentPage: 1,
    totalPages: 0,
    zoom: 1,
    annotations: [],
    selectedAnnotation: null,
    signatureCanvas: null,
    signatureCtx: null,
    isDrawing: false,
    currentTool: null
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Event listeners per upload PDF
    const pdfInput = document.getElementById('pdfInput');
    pdfInput.addEventListener('change', handlePdfUpload);

    // Drag & Drop
    const uploadBox = document.querySelector('.upload-box');
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'var(--primary-color)';
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = '#ddd';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            loadPdf(file);
        }
    });

    // Toolbar buttons
    document.getElementById('addTextBtn').addEventListener('click', () => activateTool('text'));
    document.getElementById('addSignatureBtn').addEventListener('click', openSignatureModal);
    document.getElementById('addImageBtn').addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
    document.getElementById('deleteBtn').addEventListener('click', deleteSelectedAnnotation);
    document.getElementById('saveBtn').addEventListener('click', savePdf);
    document.getElementById('newPdfBtn').addEventListener('click', loadNewPdf);

    // Page navigation
    document.getElementById('prevPageBtn').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPageBtn').addEventListener('click', () => changePage(1));

    // Zoom controls
    document.getElementById('zoomInBtn').addEventListener('click', () => changeZoom(0.1));
    document.getElementById('zoomOutBtn').addEventListener('click', () => changeZoom(-0.1));

    // Image upload
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);

    // Canvas click for adding annotations
    const annotationLayer = document.getElementById('annotationLayer');
    annotationLayer.addEventListener('click', handleCanvasClick);

    // Signature canvas setup
    const signatureCanvas = document.getElementById('signatureCanvas');
    state.signatureCanvas = signatureCanvas;
    state.signatureCtx = signatureCanvas.getContext('2d');
    signatureCanvas.width = 560;
    signatureCanvas.height = 300;

    setupSignatureCanvas();

    // Signature controls
    document.getElementById('signatureWidth').addEventListener('input', (e) => {
        document.getElementById('widthValue').textContent = e.target.value;
    });

    // Click outside to deselect
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.annotation') && !e.target.closest('.toolbar')) {
            deselectAnnotation();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' && state.selectedAnnotation) {
            deleteSelectedAnnotation();
        }
    });
}

// Caricamento PDF
async function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (file) {
        await loadPdf(file);
    }
}

async function loadPdf(file) {
    showLoading(true);
    try {
        const arrayBuffer = await file.arrayBuffer();
        state.pdfBytes = new Uint8Array(arrayBuffer);

        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        state.pdfDoc = await loadingTask.promise;
        state.totalPages = state.pdfDoc.numPages;
        state.currentPage = 1;
        state.annotations = [];

        // Mostra editor, nascondi upload
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('editorSection').style.display = 'block';

        await renderPage(state.currentPage);
    } catch (error) {
        console.error('Errore nel caricamento del PDF:', error);
        alert('Errore nel caricamento del PDF. Assicurati che il file sia valido.');
    } finally {
        showLoading(false);
    }
}

// Rendering della pagina
async function renderPage(pageNum) {
    showLoading(true);
    try {
        const page = await state.pdfDoc.getPage(pageNum);
        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');

        // Aumenta la scala per migliore qualità (2.0 invece di 1.5)
        const viewport = page.getViewport({ scale: state.zoom * 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        // Migliora la qualità del rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        await page.render(renderContext).promise;

        // Update annotation layer size
        const annotationLayer = document.getElementById('annotationLayer');
        annotationLayer.style.width = canvas.width + 'px';
        annotationLayer.style.height = canvas.height + 'px';

        updatePageInfo();
        renderAnnotations();
    } catch (error) {
        console.error('Errore nel rendering della pagina:', error);
    } finally {
        showLoading(false);
    }
}

function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Pagina ${state.currentPage} di ${state.totalPages}`;
    document.getElementById('prevPageBtn').disabled = state.currentPage === 1;
    document.getElementById('nextPageBtn').disabled = state.currentPage === state.totalPages;
}

// Navigazione pagine
function changePage(delta) {
    const newPage = state.currentPage + delta;
    if (newPage >= 1 && newPage <= state.totalPages) {
        state.currentPage = newPage;
        renderPage(state.currentPage);
    }
}

// Zoom
function changeZoom(delta) {
    const newZoom = Math.max(0.5, Math.min(3, state.zoom + delta));
    state.zoom = newZoom;
    document.getElementById('zoomLevel').textContent = Math.round(newZoom * 100) + '%';
    renderPage(state.currentPage);
}

// Gestione Tool
function activateTool(tool) {
    state.currentTool = tool;
    document.querySelectorAll('.btn-tool').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`add${tool.charAt(0).toUpperCase() + tool.slice(1)}Btn`).classList.add('active');
}

// Click sul canvas per aggiungere annotazioni
function handleCanvasClick(e) {
    if (!state.currentTool) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state.currentTool === 'text') {
        addTextAnnotation(x, y);
        state.currentTool = null;
        document.querySelectorAll('.btn-tool').forEach(btn => btn.classList.remove('active'));
    }
}

// Aggiunta annotazioni
function addTextAnnotation(x, y) {
    // Prendi i valori dai controlli della toolbar
    const fontSize = parseInt(document.getElementById('fontSizeSelect').value);
    const color = document.getElementById('textColorPicker').value;

    const annotation = {
        type: 'text',
        page: state.currentPage,
        x: x,
        y: y,
        width: 250,
        height: Math.max(50, fontSize * 3),
        text: 'Scrivi qui...',
        fontSize: fontSize,
        color: color
    };

    state.annotations.push(annotation);
    renderAnnotations();

    // Seleziona automaticamente il nuovo elemento e focalizza il textarea
    setTimeout(() => {
        const allAnnotations = state.annotations.filter(ann => ann.page === state.currentPage);
        const index = allAnnotations.length - 1;
        selectAnnotation(index);

        // Focalizza il textarea per iniziare a scrivere
        const textareas = document.querySelectorAll('.annotation-text textarea');
        if (textareas[index]) {
            textareas[index].focus();
            textareas[index].select();
        }
    }, 100);
}

function addSignatureAnnotation(imageData) {
    const canvas = document.getElementById('pdfCanvas');
    const annotation = {
        type: 'signature',
        page: state.currentPage,
        x: canvas.width / 2 - 100,
        y: canvas.height / 2 - 50,
        width: 200,
        height: 100,
        imageData: imageData
    };

    state.annotations.push(annotation);
    renderAnnotations();
}

function addImageAnnotation(imageData) {
    const canvas = document.getElementById('pdfCanvas');
    const annotation = {
        type: 'image',
        page: state.currentPage,
        x: canvas.width / 2 - 100,
        y: canvas.height / 2 - 100,
        width: 200,
        height: 200,
        imageData: imageData
    };

    state.annotations.push(annotation);
    renderAnnotations();
}

// Rendering annotazioni
function renderAnnotations() {
    const annotationLayer = document.getElementById('annotationLayer');
    annotationLayer.innerHTML = '';

    state.annotations
        .filter(ann => ann.page === state.currentPage)
        .forEach((ann, index) => {
            const element = createAnnotationElement(ann, index);
            annotationLayer.appendChild(element);
        });
}

function createAnnotationElement(annotation, index) {
    const div = document.createElement('div');
    div.className = 'annotation annotation-' + annotation.type;
    div.style.left = annotation.x + 'px';
    div.style.top = annotation.y + 'px';
    div.style.width = annotation.width + 'px';
    div.style.height = annotation.height + 'px';
    div.dataset.index = index;

    if (annotation.type === 'text') {
        // Usa textarea invece di input per supportare testo multi-linea
        const textarea = document.createElement('textarea');
        textarea.value = annotation.text;
        textarea.style.fontSize = annotation.fontSize + 'px';
        textarea.style.color = annotation.color;
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.background = 'rgba(255, 255, 255, 0.95)';
        textarea.style.padding = '5px';
        textarea.style.fontFamily = 'Arial, sans-serif';
        textarea.addEventListener('input', (e) => {
            annotation.text = e.target.value;
        });
        // Impedisci che il click sul textarea attivi il drag
        textarea.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        div.appendChild(textarea);
    } else if (annotation.type === 'signature' || annotation.type === 'image') {
        const img = document.createElement('img');
        img.src = annotation.imageData;
        div.appendChild(img);
    }

    // Pulsante cancellazione diretto sull'elemento
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'annotation-delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Elimina';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const allAnnotations = state.annotations.filter(ann => ann.page === state.currentPage);
        const annotationToDelete = allAnnotations[index];
        const globalIndex = state.annotations.indexOf(annotationToDelete);
        if (globalIndex > -1) {
            state.annotations.splice(globalIndex, 1);
            renderAnnotations();
        }
    });
    div.appendChild(deleteBtn);

    // Draggable
    makeDraggable(div, annotation);

    // Resizable
    makeResizable(div, annotation);

    // Click to select
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        selectAnnotation(index);
    });

    return div;
}

// Draggable
function makeDraggable(element, annotation) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = annotation.x;
        initialY = annotation.y;
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        annotation.x = initialX + dx;
        annotation.y = initialY + dy;
        element.style.left = annotation.x + 'px';
        element.style.top = annotation.y + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'move';
        }
    });
}

// Resizable
function makeResizable(element, annotation) {
    const handles = ['nw', 'ne', 'sw', 'se'];

    handles.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${position}`;
        element.appendChild(handle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = annotation.width;
            startHeight = annotation.height;
            startLeft = annotation.x;
            startTop = annotation.y;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (position.includes('e')) {
                annotation.width = Math.max(50, startWidth + dx);
            }
            if (position.includes('w')) {
                const newWidth = Math.max(50, startWidth - dx);
                annotation.x = startLeft + (startWidth - newWidth);
                annotation.width = newWidth;
            }
            if (position.includes('s')) {
                annotation.height = Math.max(30, startHeight + dy);
            }
            if (position.includes('n')) {
                const newHeight = Math.max(30, startHeight - dy);
                annotation.y = startTop + (startHeight - newHeight);
                annotation.height = newHeight;
            }

            element.style.width = annotation.width + 'px';
            element.style.height = annotation.height + 'px';
            element.style.left = annotation.x + 'px';
            element.style.top = annotation.y + 'px';
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    });
}

// Selezione annotazioni
function selectAnnotation(index) {
    deselectAnnotation();
    const allAnnotations = state.annotations.filter(ann => ann.page === state.currentPage);
    state.selectedAnnotation = allAnnotations[index];

    const elements = document.querySelectorAll('.annotation');
    elements[index].classList.add('selected');
}

function deselectAnnotation() {
    state.selectedAnnotation = null;
    document.querySelectorAll('.annotation').forEach(el => el.classList.remove('selected'));
}

function deleteSelectedAnnotation() {
    if (!state.selectedAnnotation) return;

    const index = state.annotations.indexOf(state.selectedAnnotation);
    if (index > -1) {
        state.annotations.splice(index, 1);
        state.selectedAnnotation = null;
        renderAnnotations();
    }
}

// Firma digitale
function openSignatureModal() {
    const modal = document.getElementById('signatureModal');
    modal.classList.add('active');
    clearSignature();
}

function closeSignatureModal() {
    const modal = document.getElementById('signatureModal');
    modal.classList.remove('active');
    state.isDrawing = false;
}

function setupSignatureCanvas() {
    const canvas = state.signatureCanvas;
    const ctx = state.signatureCtx;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = document.getElementById('signatureColor').value;
        ctx.lineWidth = document.getElementById('signatureWidth').value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

function clearSignature() {
    const ctx = state.signatureCtx;
    ctx.clearRect(0, 0, state.signatureCanvas.width, state.signatureCanvas.height);
}

function saveSignature() {
    const imageData = state.signatureCanvas.toDataURL('image/png');
    addSignatureAnnotation(imageData);
    closeSignatureModal();
}

// Caricamento immagine
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        addImageAnnotation(event.target.result);
    };
    reader.readAsDataURL(file);
}

// Salvataggio PDF
async function savePdf() {
    showLoading(true);
    try {
        const pdfDoc = await PDFLib.PDFDocument.load(state.pdfBytes);
        const pages = pdfDoc.getPages();

        // Raggruppa annotazioni per pagina
        for (let pageNum = 1; pageNum <= state.totalPages; pageNum++) {
            const pageAnnotations = state.annotations.filter(ann => ann.page === pageNum);
            if (pageAnnotations.length === 0) continue;

            const page = pages[pageNum - 1];
            const { width, height } = page.getSize();

            // Scala per convertire coordinate canvas a PDF (2.0 per qualità migliorata)
            const scale = 2.0 * state.zoom;

            for (const ann of pageAnnotations) {
                if (ann.type === 'text') {
                    // Converti colore hex in RGB
                    const hexColor = ann.color || '#000000';
                    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
                    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
                    const b = parseInt(hexColor.substr(5, 2), 16) / 255;

                    // Dividi il testo in righe per supportare testo multi-linea
                    const lines = ann.text.split('\n');
                    lines.forEach((line, lineIndex) => {
                        if (line.trim()) {
                            page.drawText(line, {
                                x: ann.x / scale,
                                y: height - (ann.y / scale) - (ann.fontSize / scale) - (lineIndex * ann.fontSize / scale * 1.2),
                                size: ann.fontSize / scale,
                                color: PDFLib.rgb(r, g, b)
                            });
                        }
                    });
                } else if (ann.type === 'signature' || ann.type === 'image') {
                    try {
                        const imageBytes = await fetch(ann.imageData).then(res => res.arrayBuffer());
                        const image = ann.imageData.startsWith('data:image/png')
                            ? await pdfDoc.embedPng(imageBytes)
                            : await pdfDoc.embedJpg(imageBytes);

                        page.drawImage(image, {
                            x: ann.x / scale,
                            y: height - (ann.y / scale) - (ann.height / scale),
                            width: ann.width / scale,
                            height: ann.height / scale
                        });
                    } catch (error) {
                        console.error('Errore nell\'inserimento immagine:', error);
                    }
                }
            }
        }

        const pdfBytes = await pdfDoc.save();
        downloadPdf(pdfBytes, 'documento-modificato.pdf');

        alert('PDF salvato con successo!');
    } catch (error) {
        console.error('Errore nel salvataggio del PDF:', error);
        alert('Errore nel salvataggio del PDF. Riprova.');
    } finally {
        showLoading(false);
    }
}

function downloadPdf(pdfBytes, filename) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// Nuovo PDF
function loadNewPdf() {
    if (confirm('Vuoi caricare un nuovo PDF? Le modifiche non salvate andranno perse.')) {
        state.pdfDoc = null;
        state.pdfBytes = null;
        state.annotations = [];
        state.currentPage = 1;
        state.zoom = 1;

        document.getElementById('editorSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'flex';
        document.getElementById('pdfInput').value = '';
    }
}

// Loading spinner
function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
}

// Utility functions
window.closeSignatureModal = closeSignatureModal;
window.clearSignature = clearSignature;
window.saveSignature = saveSignature;
