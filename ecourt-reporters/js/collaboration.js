// Real-time Collaboration Functionality
class CollaborationManager {
    constructor() {
        this.currentTab = 'participants';
        this.isLive = false;
        this.users = [];
        this.cursors = {};
        
        this.init();
    }

    init() {
        console.log('Initializing Collaboration Manager...');
        
        this.setupEventListeners();
        this.loadCollaborationData();
        this.setupRealTimeUpdates();
        this.initializeUserPresence();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Collaboration buttons
        document.getElementById('btn-comment').addEventListener('click', () => {
            this.addComment();
        });

        document.getElementById('btn-suggestions').addEventListener('click', () => {
            this.toggleSuggestionsMode();
        });

        document.getElementById('btn-track-changes').addEventListener('click', () => {
            this.toggleTrackChanges();
        });

        document.getElementById('btn-version-history').addEventListener('click', () => {
            this.showVersionHistory();
        });

        // Editor events for real-time collaboration
        const editor = document.getElementById('collabEditor');
        editor.addEventListener('input', (e) => {
            this.broadcastChange(e);
        });

        editor.addEventListener('click', (e) => {
            this.broadcastCursorPosition(e);
        });

        // Keyboard shortcuts for collaboration
        document.addEventListener('keydown', (e) => {
            this.handleCollaborationShortcuts(e);
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        this.currentTab = tabName;
    }

    loadCollaborationData() {
        // Simulate loading collaboration data
        this.users = [
            { id: 1, name: 'You', role: 'Owner', status: 'online', activity: 'Editing', color: '#667eea' },
            { id: 2, name: 'Sarah Chen', role: 'Reviewer', status: 'online', activity: 'Reviewing', color: '#10b981' },
            { id: 3, name: 'Mike Rodriguez', role: 'Editor', status: 'online', activity: 'Suggesting', color: '#f59e0b' },
            { id: 4, name: 'Lisa Park', role: 'Viewer', status: 'offline', activity: 'Last seen 2h ago', color: '#3b82f6' }
        ];

        this.updateUsersList();
    }

    updateUsersList() {
        const usersList = document.querySelector('.users-list');
        // This would be dynamically populated from server data
        console.log('Users list updated:', this.users);
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.simulateUserActivity();
        }, 10000); // Every 10 seconds

        // Simulate incoming changes
        setInterval(() => {
            this.simulateIncomingChange();
        }, 15000); // Every 15 seconds
    }

    simulateUserActivity() {
        const activities = ['editing', 'reviewing', 'suggesting', 'viewing'];
        const randomUser = this.users[Math.floor(Math.random() * (this.users.length - 1)) + 1]; // Exclude yourself
        
        if (randomUser && Math.random() > 0.3) { // 70% chance of activity
            randomUser.activity = activities[Math.floor(Math.random() * activities.length)];
            this.showLiveChanges(`${randomUser.name} is ${randomUser.activity}...`);
        }
    }

    simulateIncomingChange() {
        if (Math.random() > 0.5) { // 50% chance of incoming change
            const suggestions = [
                "PROSECUTOR: The people are ready, Your Honor.",
                "DEFENSE: The defense is prepared, Your Honor.",
                "JUDGE: Let the record reflect the time as 10:15 AM.",
                "CLERK: All parties are present and accounted for."
            ];
            
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            this.showIncomingSuggestion(randomSuggestion);
        }
    }

    showLiveChanges(message) {
        const liveChanges = document.getElementById('liveChanges');
        const messageElement = liveChanges.querySelector('span');
        
        messageElement.textContent = message;
        liveChanges.classList.add('show');
        
        setTimeout(() => {
            liveChanges.classList.remove('show');
        }, 3000);
    }

    showIncomingSuggestion(suggestion) {
        const editor = document.getElementById('collabEditor');
        const suggestionElement = document.createElement('p');
        suggestionElement.className = 'speaker-entry suggested';
        suggestionElement.innerHTML = `
            <span class="suggestion-marker">Suggested by Sarah Chen:</span>
            <span class="speaker">${suggestion}</span>
        `;
        
        editor.appendChild(suggestionElement);
        suggestionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Highlight the new suggestion
        suggestionElement.style.animation = 'highlightChange 2s ease';
        
        this.showToast('New suggestion received', 'info');
    }

    broadcastChange(event) {
        if (!this.isLive) return;
        
        // In a real application, this would send the change to other collaborators
        console.log('Broadcasting change:', event);
        
        // Update last save time
        this.updateLastSaveTime();
    }

    broadcastCursorPosition(event) {
        if (!this.isLive) return;
        
        // In a real application, this would send cursor position to other collaborators
        console.log('Broadcasting cursor position:', event);
    }

    updateLastSaveTime() {
        const lastSaveElement = document.querySelector('.status-right span:last-child strong');
        if (lastSaveElement) {
            lastSaveElement.textContent = 'Just now';
        }
    }

    initializeUserPresence() {
        // Initialize user cursors
        this.users.forEach(user => {
            if (user.id !== 1) { // Don't create cursor for yourself
                this.createUserCursor(user);
            }
        });
    }

    createUserCursor(user) {
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'cursor-container';
        cursorContainer.id = `cursor-${user.id}`;
        cursorContainer.style.setProperty('--user-color', user.color);
        
        const cursor = document.createElement('div');
        cursor.className = 'user-cursor';
        
        const label = document.createElement('div');
        label.className = 'cursor-label';
        label.textContent = user.name;
        
        cursorContainer.appendChild(cursor);
        cursorContainer.appendChild(label);
        
        document.getElementById('collabEditor').appendChild(cursorContainer);
        
        this.cursors[user.id] = cursorContainer;
    }

    addComment() {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            // In a real app, this would open a comment dialog
            this.showToast('Comment added to selected text', 'success');
            this.switchTab('comments');
        } else {
            this.showToast('Select text to add a comment', 'warning');
        }
    }

    toggleSuggestionsMode() {
        const btn = document.getElementById('btn-suggestions');
        const isActive = btn.classList.toggle('active');
        
        if (isActive) {
            btn.innerHTML = '<i class="fas fa-lightbulb"></i> Suggesting';
            this.showToast('Suggestions mode activated - your changes will be suggestions', 'info');
        } else {
            btn.innerHTML = '<i class="fas fa-lightbulb"></i> Suggest';
            this.showToast('Suggestions mode deactivated', 'info');
        }
    }

    toggleTrackChanges() {
        const btn = document.getElementById('btn-track-changes');
        const isActive = btn.classList.toggle('active');
        
        if (isActive) {
            btn.innerHTML = '<i class="fas fa-code-branch"></i> Tracking';
            this.showToast('Track changes activated', 'info');
        } else {
            btn.innerHTML = '<i class="fas fa-code-branch"></i> Track';
            this.showToast('Track changes deactivated', 'info');
        }
    }

    showVersionHistory() {
        this.switchTab('versions');
    }

    handleCollaborationShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '/':
                    e.preventDefault();
                    this.addComment();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleSuggestionsMode();
                    break;
                case 't':
                    e.preventDefault();
                    this.toggleTrackChanges();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showVersionHistory();
                    break;
            }
        }
    }

    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Global collaboration functions
function showInviteModal() {
    const modal = document.getElementById('inviteModal');
    modal.classList.add('show');
}

function startLiveSession() {
    const btn = document.querySelector('.btn-primary[onclick="startLiveSession()"]');
    const collaborationManager = window.collaborationManager;
    
    if (!collaborationManager.isLive) {
        collaborationManager.isLive = true;
        btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Live Session Active';
        btn.style.background = '#10b981';
        collaborationManager.showToast('Live collaboration session started', 'success');
    } else {
        collaborationManager.isLive = false;
        btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Start Live Session';
        btn.style.background = '';
        collaborationManager.showToast('Live collaboration session ended', 'info');
    }
}

function saveVersion() {
    const collaborationManager = window.collaborationManager;
    collaborationManager.showToast('New version saved successfully', 'success');
}

function submitForReview() {
    const collaborationManager = window.collaborationManager;
    collaborationManager.showToast('Document submitted for review', 'success');
}

function compareVersions() {
    const modal = document.getElementById('compareModal');
    modal.classList.add('show');
}

function restoreVersion() {
    const collaborationManager = window.collaborationManager;
    collaborationManager.showToast('Version restored successfully', 'success');
    closeModal('compareModal');
}

function exitCollaboration() {
    if (confirm('Are you sure you want to exit collaboration? Your changes will be saved.')) {
        window.location.href = 'transcription.html';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Initialize collaboration manager
document.addEventListener('DOMContentLoaded', function() {
    window.collaborationManager = new CollaborationManager();
    
    // Global functions
    window.showInviteModal = showInviteModal;
    window.startLiveSession = startLiveSession;
    window.saveVersion = saveVersion;
    window.submitForReview = submitForReview;
    window.compareVersions = compareVersions;
    window.restoreVersion = restoreVersion;
    window.exitCollaboration = exitCollaboration;
    window.closeModal = closeModal;
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});