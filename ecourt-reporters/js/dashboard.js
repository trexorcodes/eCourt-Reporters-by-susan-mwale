// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded successfully!');
    
    initializeDashboard();
    setupEventListeners();
    startRealTimeUpdates();
});

function initializeDashboard() {
    updateCurrentTime();
    setupOfflineDetection();
    loadUserPreferences();
}

function setupEventListeners() {
    // User menu
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });
    }
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('show');
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDarkMode();
        });
    }
    
    // Click handlers for transcript items
    const editButtons = document.querySelectorAll('.btn-edit');
    const viewButtons = document.querySelectorAll('.btn-view');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const caseInfo = this.closest('.transcript-item').querySelector('strong').textContent;
            showToast(`Opening editor for: ${caseInfo}`, 'info');
        });
    });
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const caseInfo = this.closest('.transcript-item').querySelector('strong').textContent;
            showToast(`Viewing transcript: ${caseInfo}`, 'info');
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        handleKeyboardShortcuts(e);
    });
}

function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        timeElement.textContent = timeString;
    }
    
    // Update every second
    setTimeout(updateCurrentTime, 1000);
}

function setupOfflineDetection() {
    const statusElement = document.getElementById('connectionStatus');
    
    function updateConnectionStatus() {
        if (navigator.onLine) {
            statusElement.textContent = 'Online';
            statusElement.style.color = '#10b981';
        } else {
            statusElement.textContent = 'Offline';
            statusElement.style.color = '#ef4444';
            showToast('You are currently offline. Some features may be limited.', 'warning');
        }
    }
    
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    updateConnectionStatus();
}

function loadUserPreferences() {
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'false');
        showToast('Light mode activated', 'success');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
        showToast('Dark mode activated', 'success');
    }
}

function handleKeyboardShortcuts(e) {
    // Only trigger if not in input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'n':
                e.preventDefault();
                startNewTranscription();
                break;
            case 's':
                e.preventDefault();
                showToast('Use Ctrl+Shift+S for final save', 'info');
                break;
            case '?':
                e.preventDefault();
                showKeyboardShortcuts();
                break;
        }
    }
}

function showKeyboardShortcuts() {
    const modal = document.getElementById('shortcutsModal');
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Auto hide after 5 seconds
    setTimeout(hideToast, 5000);
}

function hideToast() {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.classList.remove('show');
    }
}

function startNewTranscription() {
    localStorage.removeItem('currentTranscript');
    window.location.href = 'transcription.html';
}

function startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        // Update random stats occasionally
        if (Math.random() > 0.7) {
            updateRandomStats();
        }
    }, 30000);
}

function updateRandomStats() {
    // This would typically update from server data
    console.log('Updating real-time stats...');
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Global functions
window.startNewTranscription = startNewTranscription;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.closeModal = closeModal;
window.hideToast = hideToast;
window.showToast = showToast;