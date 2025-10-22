// Transcription Editor Functionality
class TranscriptionEditor {
    constructor() {
        this.currentMode = 'rich';
        this.isRecording = false;
        this.recognition = null;
        this.sessionStartTime = null;
        this.timerInterval = null;
        this.autoSaveInterval = null;
        
        this.init();
    }

    init() {
        console.log('Initializing Transcription Editor...');
        
        this.setupEventListeners();
        this.startSessionTimer();
        this.setupAutoSave();
        this.loadSavedData();
        this.checkVoiceRecognitionSupport();
        this.updateWordCount();
    }

    checkVoiceRecognitionSupport() {
        const voiceControl = document.getElementById('voiceControl');
        
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported in this browser');
            voiceControl.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Voice Not Supported</span>';
            voiceControl.style.opacity = '0.6';
            voiceControl.title = 'Voice recognition not supported in your browser. Try Chrome or Edge.';
            return false;
        }
        
        // Check if we're on HTTP (not supported)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            console.warn('Speech recognition requires HTTPS');
            voiceControl.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Needs HTTPS</span>';
            voiceControl.style.opacity = '0.6';
            voiceControl.title = 'Voice recognition requires HTTPS connection';
            return false;
        }
        
        return true;
    }

    setupEventListeners() {
        // Editor mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchEditorMode(e.target.getAttribute('data-mode'));
            });
        });

        // Voice control
        document.getElementById('voiceControl').addEventListener('click', () => {
            this.toggleVoiceRecognition();
        });

        document.getElementById('voiceStop').addEventListener('click', () => {
            this.stopVoiceRecognition();
        });

        // Toolbar buttons
        document.querySelectorAll('.tool-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.executeCommand(
                    e.target.getAttribute('data-command'),
                    e.target.getAttribute('data-value')
                );
            });
        });

        // Special buttons
        document.getElementById('btn-speaker').addEventListener('click', () => {
            this.addSpeaker();
        });

        document.getElementById('btn-timestamp').addEventListener('click', () => {
            this.insertTimestamp();
        });

        document.getElementById('btn-objection').addEventListener('click', () => {
            this.insertObjection();
        });

        document.getElementById('btn-ai-assist').addEventListener('click', () => {
            this.showAIAssistant();
        });

        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            this.showExportModal();
        });

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.insertTemplate(e.target.getAttribute('data-template'));
            });
        });

        // Save buttons
        document.getElementById('btn-save-draft').addEventListener('click', () => {
            this.saveTranscript('draft');
        });

        document.getElementById('btn-save-final').addEventListener('click', () => {
            this.saveTranscript('final');
        });

        document.getElementById('btn-clear').addEventListener('click', () => {
            this.clearEditor();
        });

        // Editor content changes
        document.getElementById('richEditor').addEventListener('input', () => {
            this.updateWordCount();
            this.updateDocumentOutline();
        });

        document.getElementById('markdownEditor').addEventListener('input', () => {
            this.updateWordCount();
            this.updateDocumentOutline();
        });

        // Case panel toggle
        document.getElementById('casePanelToggle').addEventListener('click', () => {
            this.toggleCasePanel();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Language change
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.changeRecognitionLanguage(e.target.value);
        });
    }

    setupVoiceRecognition() {
        if (!this.checkVoiceRecognitionSupport()) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = document.getElementById('languageSelect').value;

        this.recognition.onstart = () => {
            console.log('Voice recognition started');
            this.isRecording = true;
            this.updateVoiceUI(true);
            this.showToast('Voice dictation started. Start speaking...', 'success');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.updateVoiceOutput(interimTranscript, finalTranscript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            let errorMessage = 'Voice recognition error';
            switch(event.error) {
                case 'not-allowed':
                case 'permission-denied':
                    errorMessage = 'Microphone access denied. Please allow microphone permissions.';
                    break;
                case 'network':
                    errorMessage = 'Network error occurred during voice recognition';
                    break;
                case 'audio-capture':
                    errorMessage = 'No microphone found or microphone not accessible';
                    break;
                default:
                    errorMessage = `Voice recognition error: ${event.error}`;
            }
            
            this.showToast(errorMessage, 'error');
            this.stopVoiceRecognition();
        };

        this.recognition.onend = () => {
            console.log('Voice recognition ended');
            this.isRecording = false;
            this.updateVoiceUI(false);
        };
    }

    toggleVoiceRecognition() {
        if (!this.checkVoiceRecognitionSupport()) {
            this.showToast('Voice recognition not supported in your browser. Try Chrome or Edge.', 'error');
            return;
        }

        if (this.isRecording) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }

    startVoiceRecognition() {
        if (!this.recognition) {
            this.setupVoiceRecognition();
        }

        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.showToast('Error starting voice recognition. Please try again.', 'error');
            }
        }
    }

    stopVoiceRecognition() {
        if (this.recognition) {
            this.recognition.stop();
            this.showToast('Voice dictation stopped', 'info');
        }
    }

    updateVoiceUI(isRecording) {
        const voiceControl = document.getElementById('voiceControl');
        const voicePanel = document.getElementById('voicePanel');
        const visualizer = document.getElementById('voiceVisualizer');

        if (isRecording) {
            voiceControl.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Stop Dictation</span>';
            voiceControl.classList.add('recording');
            voicePanel.style.display = 'block';
            visualizer.style.display = 'flex';
        } else {
            voiceControl.innerHTML = '<i class="fas fa-microphone"></i><span>Start Dictation</span>';
            voiceControl.classList.remove('recording');
            voicePanel.style.display = 'none';
            visualizer.style.display = 'none';
        }
    }

    updateVoiceOutput(interim, final) {
        const output = document.getElementById('voiceOutput');
        
        if (final) {
            this.insertTextAtCursor(final + ' ');
            output.innerHTML = '<p><em>Listening...</em></p>';
        } else if (interim) {
            output.innerHTML = `<p><em>${interim}</em></p>`;
        }
    }

    insertTextAtCursor(text) {
        if (this.currentMode === 'rich') {
            const editor = document.getElementById('richEditor');
            
            // Focus the editor first
            editor.focus();
            
            // Check if browser supports modern insert method
            if (document.execCommand && document.execCommand('insertText', false, text)) {
                // Successfully used execCommand
            } else {
                // Fallback method
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const textNode = document.createTextNode(text);
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    // Last resort - append to end
                    editor.innerHTML += text + ' ';
                }
            }
        } else if (this.currentMode === 'markdown') {
            const editor = document.getElementById('markdownEditor');
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const value = editor.value;
            
            editor.value = value.substring(0, start) + text + value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + text.length;
            
            // Trigger input event for word count update
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        this.updateWordCount();
    }

    // ... (rest of the methods remain the same as previous version)

    switchEditorMode(mode) {
        const richEditor = document.getElementById('richEditor');
        const markdownEditor = document.getElementById('markdownEditor');
        
        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
        });

        // Hide all editors
        richEditor.style.display = 'none';
        markdownEditor.style.display = 'none';

        // Show selected editor
        if (mode === 'rich') {
            richEditor.style.display = 'block';
            this.currentMode = 'rich';
        } else if (mode === 'markdown') {
            markdownEditor.style.display = 'block';
            this.currentMode = 'markdown';
        }
        
        this.updateWordCount();
    }

    executeCommand(command, value = null) {
        if (this.currentMode === 'rich') {
            document.execCommand(command, false, value);
            document.getElementById('richEditor').focus();
        }
    }

    addSpeaker() {
        const speakerName = prompt('Enter speaker name:');
        if (speakerName) {
            if (this.currentMode === 'rich') {
                this.insertTextAtCursor(`<p><strong class="speaker">${speakerName.toUpperCase()}:</strong> </p>`);
            } else if (this.currentMode === 'markdown') {
                this.insertTextAtCursor(`**${speakerName.toUpperCase()}:** `);
            }
        }
    }

    insertTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        if (this.currentMode === 'rich') {
            this.insertTextAtCursor(`<span class="timestamp">[${timeString}]</span> `);
        } else if (this.currentMode === 'markdown') {
            this.insertTextAtCursor(`*[${timeString}]* `);
        }
    }

    insertObjection() {
        if (this.currentMode === 'rich') {
            this.insertTextAtCursor('<p><strong class="speaker">OBJECTION!</strong> </p>');
        } else if (this.currentMode === 'markdown') {
            this.insertTextAtCursor('**OBJECTION!** ');
        }
    }

    insertTemplate(templateType) {
        const templates = {
            opening: `CLERK: All rise! The Court of Common Pleas is now in session. The Honorable Judge presiding.\n\nJUDGE: Please be seated. The clerk will call the first case.\n\n`,
            witness: `CLERK: Please raise your right hand. Do you swear to tell the truth, the whole truth, and nothing but the truth, so help you God?\n\nWITNESS: I do.\n\n`,
            objection: `ATTORNEY: Objection, Your Honor! \n\nJUDGE: On what grounds?\n\nATTORNEY: \n\n`,
            closing: `JUDGE: Court is adjourned. We will reconvene tomorrow at 9:00 AM.\n\nCLERK: All rise!\n\n`,
            jury: `JUDGE: Members of the jury, you are instructed that...\n\n`,
            exhibit: `CLERK: Marking this as Exhibit A for identification.\n\nATTORNEY: Your Honor, we offer Exhibit A into evidence.\n\n`
        };

        const template = templates[templateType];
        if (template) {
            this.insertTextAtCursor(template);
            this.showToast(`"${templateType}" template inserted`, 'success');
        }
    }

    startSessionTimer() {
        this.sessionStartTime = new Date();
        this.timerInterval = setInterval(() => {
            this.updateSessionTimer();
        }, 1000);
    }

    updateSessionTimer() {
        const now = new Date();
        const diff = now - this.sessionStartTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const timerElement = document.getElementById('sessionTimer');
        if (timerElement) {
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000); // Auto-save every 30 seconds
    }

    autoSave() {
        const content = this.getEditorContent();
        if (content && content.length > 10) { // Only save if there's substantial content
            localStorage.setItem('autoSaveTranscript', content);
            localStorage.setItem('autoSaveTime', new Date().toISOString());
            
            this.showAutoSaveStatus();
        }
    }

    showAutoSaveStatus() {
        const statusElement = document.getElementById('autoSaveStatus');
        if (statusElement) {
            statusElement.innerHTML = '<i class="fas fa-check"></i> All changes saved';
            statusElement.style.color = '#10b981';
            
            setTimeout(() => {
                statusElement.innerHTML = '<i class="fas fa-save"></i> All changes saved';
                statusElement.style.color = '#666';
            }, 2000);
        }
    }

    getEditorContent() {
        if (this.currentMode === 'rich') {
            return document.getElementById('richEditor').innerHTML;
        } else if (this.currentMode === 'markdown') {
            return document.getElementById('markdownEditor').value;
        }
        return '';
    }

    updateWordCount() {
        let text = '';
        
        if (this.currentMode === 'rich') {
            text = document.getElementById('richEditor').innerText || '';
        } else if (this.currentMode === 'markdown') {
            text = document.getElementById('markdownEditor').value;
        }
        
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const readingTime = Math.ceil(words / 200); // Average reading speed
        
        document.getElementById('wordCount').textContent = words;
        document.getElementById('wordCountDisplay').textContent = words;
        document.getElementById('charCountDisplay').textContent = characters;
        document.getElementById('readingTime').textContent = `${readingTime}min`;
    }

    updateDocumentOutline() {
        const wordCount = document.getElementById('wordCount').textContent;
        const outlineList = document.getElementById('outlineList');
        
        // Simple outline update
        outlineList.innerHTML = `
            <div class="outline-item">
                <i class="fas fa-hashtag"></i>
                <span>${document.getElementById('caseNumber').value || 'Untitled Case'}</span>
            </div>
            <div class="outline-item">
                <i class="fas fa-file-word"></i>
                <span>${wordCount} words</span>
            </div>
            <div class="outline-item">
                <i class="fas fa-clock"></i>
                <span>${document.getElementById('sessionTimer').textContent} session</span>
            </div>
        `;
    }

    saveTranscript(type) {
        const caseNumber = document.getElementById('caseNumber').value || 'Unknown Case';
        const content = this.getEditorContent();
        
        const transcriptData = {
            caseNumber,
            caseTitle: document.getElementById('caseTitle').value,
            content,
            type,
            wordCount: document.getElementById('wordCount').textContent,
            sessionDuration: document.getElementById('sessionTimer').textContent,
            savedAt: new Date().toISOString()
        };
        
        // Save to localStorage (in real app, send to server)
        localStorage.setItem(`transcript_${caseNumber}`, JSON.stringify(transcriptData));
        localStorage.setItem('currentTranscript', content);
        
        this.showToast(`${type === 'draft' ? 'Draft' : 'Final'} transcript saved for ${caseNumber}`, 'success');
        
        if (type === 'final') {
            // Clear auto-save data
            localStorage.removeItem('autoSaveTranscript');
            localStorage.removeItem('autoSaveTime');
        }
    }

    loadSavedData() {
        const autoSaved = localStorage.getItem('autoSaveTranscript');
        if (autoSaved && autoSaved.length > 10) {
            if (confirm('Found auto-saved transcript. Would you like to restore it?')) {
                if (this.currentMode === 'rich') {
                    document.getElementById('richEditor').innerHTML = autoSaved;
                } else if (this.currentMode === 'markdown') {
                    document.getElementById('markdownEditor').value = autoSaved;
                }
                this.updateWordCount();
                this.showToast('Auto-saved transcript restored', 'success');
            }
        }
    }

    clearEditor() {
        if (confirm('Are you sure you want to clear the entire transcript? This cannot be undone.')) {
            if (this.currentMode === 'rich') {
                document.getElementById('richEditor').innerHTML = '<p>Click here to start typing the court proceedings...</p>';
            } else if (this.currentMode === 'markdown') {
                document.getElementById('markdownEditor').value = '# Court Proceedings\n\nStart typing your transcript here...';
            }
            
            this.updateWordCount();
            localStorage.removeItem('autoSaveTranscript');
            this.showToast('Editor cleared', 'info');
        }
    }

    showAIAssistant() {
        const modal = document.getElementById('aiModal');
        modal.classList.add('show');
    }

    showExportModal() {
        const modal = document.getElementById('exportModal');
        modal.classList.add('show');
    }

    exportTranscript() {
        const format = document.querySelector('input[name="export-format"]:checked').value;
        const content = this.getEditorContent();
        const caseNumber = document.getElementById('caseNumber').value || 'transcript';
        
        // Simple export simulation
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${caseNumber}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast(`Transcript exported as ${format.toUpperCase()}`, 'success');
        this.closeModal('exportModal');
    }

    toggleFullscreen() {
        const editorSection = document.querySelector('.editor-section');
        
        if (!document.fullscreenElement) {
            editorSection.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleCasePanel() {
        const panelContent = document.querySelector('.case-panel .panel-content');
        const toggleIcon = document.querySelector('.panel-toggle i');
        
        if (panelContent.style.display === 'none') {
            panelContent.style.display = 'block';
            toggleIcon.className = 'fas fa-chevron-up';
        } else {
            panelContent.style.display = 'none';
            toggleIcon.className = 'fas fa-chevron-down';
        }
    }

    changeRecognitionLanguage(lang) {
        if (this.recognition) {
            this.recognition.lang = lang;
            this.showToast(`Voice recognition language set to ${lang}`, 'info');
        }
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    this.saveTranscript('draft');
                    break;
                case 'S':
                    e.preventDefault();
                    this.saveTranscript('final');
                    break;
                case 'b':
                    e.preventDefault();
                    this.executeCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.executeCommand('italic');
                    break;
                case ' ':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.toggleVoiceRecognition();
                    }
                    break;
            }
        }
    }

    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Fallback toast implementation
            const toast = document.getElementById('notificationToast');
            const toastMessage = document.getElementById('toastMessage');
            
            if (toast && toastMessage) {
                toastMessage.textContent = message;
                toast.className = `toast show ${type}`;
                setTimeout(() => toast.classList.remove('show'), 5000);
            } else {
                alert(message);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }
}

// Initialize the editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.transcriptionEditor = new TranscriptionEditor();
    
    // Global functions for modal closing
    window.closeModal = function(modalId) {
        window.transcriptionEditor.closeModal(modalId);
    };
    
    window.exportTranscript = function() {
        window.transcriptionEditor.exportTranscript();
    };
    
    window.hideToast = function() {
        const toast = document.getElementById('notificationToast');
        if (toast) toast.classList.remove('show');
    };
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Fullscreen change handler
document.addEventListener('fullscreenchange', function() {
    const fullscreenBtn = document.getElementById('btn-fullscreen');
    if (fullscreenBtn) {
        const icon = fullscreenBtn.querySelector('i');
        if (document.fullscreenElement) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }
});