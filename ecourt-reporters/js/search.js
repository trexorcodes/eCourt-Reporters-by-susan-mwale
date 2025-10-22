// Advanced Search Functionality
class AdvancedSearch {
    constructor() {
        this.currentQuery = '';
        this.activeFilters = {};
        this.currentView = 'grid';
        this.selectedResults = new Set();
        
        this.init();
    }

    init() {
        console.log('Initializing Advanced Search...');
        
        this.setupEventListeners();
        this.loadSearchHistory();
        this.updateFilterCount();
    }

    setupEventListeners() {
        // Search input events
        const searchInput = document.getElementById('searchQuery');
        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e);
        });
        
        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Filter events
        document.querySelectorAll('.filter-group select, .filter-group input').forEach(element => {
            element.addEventListener('change', () => {
                this.updateFilterCount();
            });
        });

        // View options
        document.querySelectorAll('.view-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.switchView(e.target.getAttribute('data-view'));
            });
        });

        // Sort options
        document.getElementById('sortBy').addEventListener('change', () => {
            this.sortResults();
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Result card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.result-card')) {
                this.handleResultClick(e);
            }
        });

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input')) {
                this.hideSearchSuggestions();
            }
        });
    }

    handleSearchInput(e) {
        this.currentQuery = e.target.value;
        
        if (this.currentQuery.length > 2) {
            this.showSearchSuggestions();
        } else {
            this.hideSearchSuggestions();
        }
    }

    showSearchSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        suggestions.classList.add('show');
    }

    hideSearchSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        suggestions.classList.remove('show');
    }

    performSearch() {
        const searchInput = document.getElementById('searchQuery');
        this.currentQuery = searchInput.value.trim();
        
        if (!this.currentQuery) {
            this.showToast('Please enter a search term', 'warning');
            return;
        }

        this.showLoadingState();
        this.saveToSearchHistory(this.currentQuery);
        
        // Simulate API call
        setTimeout(() => {
            this.displaySearchResults();
            this.hideLoadingState();
            this.updateResultsCount();
            this.showToast(`Found 24 results for "${this.currentQuery}"`, 'success');
        }, 1500);
    }

    showLoadingState() {
        document.getElementById('searchLoading').classList.add('show');
        document.getElementById('resultsGrid').style.opacity = '0.5';
    }

    hideLoadingState() {
        document.getElementById('searchLoading').classList.remove('show');
        document.getElementById('resultsGrid').style.opacity = '1';
    }

    displaySearchResults() {
        const searchTerm = document.getElementById('searchTerm');
        searchTerm.textContent = this.currentQuery;
        
        // Highlight search terms in results
        this.highlightSearchTerms();
        
        // Show results
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('resultsGrid').style.display = 'grid';
    }

    highlightSearchTerms() {
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            highlight.innerHTML = highlight.textContent;
        });

        if (this.currentQuery) {
            const terms = this.currentQuery.toLowerCase().split(' ');
            const previews = document.querySelectorAll('.result-preview');
            
            previews.forEach(preview => {
                let text = preview.textContent;
                terms.forEach(term => {
                    if (term.length > 2) {
                        const regex = new RegExp(term, 'gi');
                        text = text.replace(regex, match => 
                            `<span class="highlight">${match}</span>`
                        );
                    }
                });
                preview.innerHTML = text;
            });
        }
    }

    updateResultsCount() {
        const count = document.querySelectorAll('.result-card').length;
        document.getElementById('resultsCount').textContent = count;
    }

    toggleFilters() {
        const filters = document.getElementById('advancedFilters');
        const isVisible = filters.classList.toggle('show');
        
        const toggleBtn = document.querySelector('.search-filters-toggle');
        if (isVisible) {
            toggleBtn.innerHTML = '<i class="fas fa-filter"></i><span>Filters</span><span class="filter-count">3</span>';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-filter"></i><span>Filters</span><span class="filter-count">3</span>';
        }
    }

    updateFilterCount() {
        let count = 0;
        const filters = document.querySelectorAll('.filter-group select, .filter-group input');
        
        filters.forEach(filter => {
            if (filter.value && filter.value !== '') {
                count++;
            }
        });
        
        document.querySelector('.filter-count').textContent = count;
        document.getElementById('activeFilters').textContent = `${count} active filters`;
    }

    applyFilters() {
        this.activeFilters = {
            caseType: document.getElementById('caseType').value,
            status: document.getElementById('status').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value,
            judge: document.getElementById('judge').value,
            wordCount: document.getElementById('wordCount').value,
            assignedTo: document.getElementById('assignedTo').value
        };
        
        this.performSearch();
        this.toggleFilters();
    }

    clearFilters() {
        document.querySelectorAll('.filter-group select, .filter-group input').forEach(element => {
            if (element.type === 'text' || element.type === 'date') {
                element.value = '';
            } else {
                element.selectedIndex = 0;
            }
        });
        
        this.activeFilters = {};
        this.updateFilterCount();
        this.performSearch();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active view button
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-view') === view);
        });
        
        // Update results grid
        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.className = `results-grid ${view}-view`;
        
        this.showToast(`Switched to ${view} view`, 'info');
    }

    sortResults() {
        const sortBy = document.getElementById('sortBy').value;
        const resultsGrid = document.getElementById('resultsGrid');
        const results = Array.from(resultsGrid.querySelectorAll('.result-card'));
        
        results.sort((a, b) => {
            switch(sortBy) {
                case 'date-desc':
                    return this.compareDates(b, a);
                case 'date-asc':
                    return this.compareDates(a, b);
                case 'title':
                    return a.querySelector('.result-title').textContent.localeCompare(
                        b.querySelector('.result-title').textContent
                    );
                case 'wordcount':
                    return this.compareWordCount(b, a);
                default:
                    return 0;
            }
        });
        
        // Reappend sorted results
        results.forEach(result => resultsGrid.appendChild(result));
        
        this.showToast(`Sorted by ${this.getSortLabel(sortBy)}`, 'info');
    }

    compareDates(a, b) {
        // Simplified date comparison - in real app, use actual dates
        return Math.random() - 0.5;
    }

    compareWordCount(a, b) {
        const aWords = parseInt(a.querySelector('.result-meta-item:last-child').textContent);
        const bWords = parseInt(b.querySelector('.result-meta-item:last-child').textContent);
        return aWords - bWords;
    }

    getSortLabel(sortValue) {
        const labels = {
            'relevance': 'Relevance',
            'date-desc': 'Newest First',
            'date-asc': 'Oldest First',
            'title': 'Title',
            'wordcount': 'Word Count'
        };
        return labels[sortValue] || sortValue;
    }

    toggleSelectAll(selectAll) {
        const checkboxes = document.querySelectorAll('.result-card input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll;
        });
        
        this.updateSelectedResults();
    }

    handleResultClick(e) {
        const resultCard = e.target.closest('.result-card');
        if (e.target.type === 'checkbox' || e.target.closest('button')) {
            return; // Don't navigate for checkbox clicks or button clicks
        }
        
        // Navigate to transcript
        const title = resultCard.querySelector('.result-title').textContent;
        this.showToast(`Opening ${title}`, 'info');
        // In real app: window.location.href = `transcription.html?case=${encodeURIComponent(title)}`;
    }

    updateSelectedResults() {
        const selected = document.querySelectorAll('.result-card input[type="checkbox"]:checked').length;
        document.querySelector('.bulk-select label').textContent = `Select all ${selected} results`;
    }

    saveToSearchHistory(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        // Remove if already exists
        history = history.filter(item => item.query !== query);
        
        // Add to beginning
        history.unshift({
            query: query,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 searches
        history = history.slice(0, 10);
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
        this.updateSearchHistoryUI();
    }

    loadSearchHistory() {
        this.updateSearchHistoryUI();
    }

    updateSearchHistoryUI() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const recentList = document.querySelector('.recent-search-list');
        
        recentList.innerHTML = history.map(item => `
            <div class="recent-search-item">
                <span class="recent-search-query">${item.query}</span>
                <span class="recent-search-time">${this.formatTimeAgo(item.timestamp)}</span>
            </div>
        `).join('');
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return time.toLocaleDateString();
    }

    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Global search functions
function toggleFilters() {
    window.advancedSearch.toggleFilters();
}

function performSearch() {
    window.advancedSearch.performSearch();
}

function applyFilters() {
    window.advancedSearch.applyFilters();
}

function clearFilters() {
    window.advancedSearch.clearFilters();
}

function saveSearch() {
    const modal = document.getElementById('saveSearchModal');
    modal.classList.add('show');
}

function confirmSaveSearch() {
    const name = document.getElementById('searchName').value;
    const description = document.getElementById('searchDescription').value;
    
    if (!name) {
        window.advancedSearch.showToast('Please enter a search name', 'warning');
        return;
    }
    
    // Save to localStorage (in real app, save to server)
    let savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    savedSearches.push({
        name: name,
        description: description,
        query: window.advancedSearch.currentQuery,
        filters: window.advancedSearch.activeFilters,
        created: new Date().toISOString()
    });
    
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    
    window.advancedSearch.showToast(`Search "${name}" saved successfully`, 'success');
    closeModal('saveSearchModal');
}

function exportResults() {
    window.advancedSearch.showToast('Exporting search results...', 'info');
    
    // Simulate export
    setTimeout(() => {
        window.advancedSearch.showToast('Search results exported successfully', 'success');
    }, 2000);
}

function bulkExport() {
    const selected = document.querySelectorAll('.result-card input[type="checkbox"]:checked').length;
    if (selected === 0) {
        window.advancedSearch.showToast('Please select transcripts to export', 'warning');
        return;
    }
    
    window.advancedSearch.showToast(`Exporting ${selected} selected transcripts...`, 'info');
}

function bulkArchive() {
    const selected = document.querySelectorAll('.result-card input[type="checkbox"]:checked').length;
    if (selected === 0) {
        window.advancedSearch.showToast('Please select transcripts to archive', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to archive ${selected} transcripts?`)) {
        window.advancedSearch.showToast(`${selected} transcripts archived successfully`, 'success');
    }
}

function bulkDelete() {
    const selected = document.querySelectorAll('.result-card input[type="checkbox"]:checked').length;
    if (selected === 0) {
        window.advancedSearch.showToast('Please select transcripts to delete', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to permanently delete ${selected} transcripts? This action cannot be undone.`)) {
        window.advancedSearch.showToast(`${selected} transcripts deleted successfully`, 'success');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    window.advancedSearch = new AdvancedSearch();
    
    // Global functions
    window.toggleFilters = toggleFilters;
    window.performSearch = performSearch;
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;
    window.saveSearch = saveSearch;
    window.confirmSaveSearch = confirmSaveSearch;
    window.exportResults = exportResults;
    window.bulkExport = bulkExport;
    window.bulkArchive = bulkArchive;
    window.bulkDelete = bulkDelete;
    window.closeModal = closeModal;
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});