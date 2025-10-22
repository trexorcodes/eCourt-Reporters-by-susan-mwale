// Analytics Dashboard Functionality
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.currentTimeRange = '30d';
        
        this.init();
    }

    init() {
        console.log('Initializing Analytics Dashboard...');
        
        this.setupEventListeners();
        this.initializeCharts();
        this.loadAnalyticsData();
    }

    setupEventListeners() {
        // Time range filter
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.currentTimeRange = e.target.value;
            this.updateCharts();
        });

        // Comparison period toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.switchComparisonPeriod(period);
            });
        });

        // Export button
        document.querySelector('.btn-primary[onclick="exportAnalytics()"]')
            .addEventListener('click', () => {
                this.showExportModal();
            });
    }

    initializeCharts() {
        this.createTranscriptsChart();
        this.createCaseTypeChart();
        this.createProductivityChart();
        this.createWordCountChart();
    }

    createTranscriptsChart() {
        const ctx = document.getElementById('transcriptsChart').getContext('2d');
        
        this.charts.transcripts = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Completed Transcripts',
                        data: [18, 22, 25, 28, 32, 35, 38],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Draft Transcripts',
                        data: [12, 15, 18, 14, 16, 20, 22],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createCaseTypeChart() {
        const ctx = document.getElementById('caseTypeChart').getContext('2d');
        
        this.charts.caseType = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Criminal', 'Civil', 'Family', 'Probate', 'Other'],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: [
                        '#667eea',
                        '#10b981',
                        '#f59e0b',
                        '#3b82f6',
                        '#6b7280'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    createProductivityChart() {
        const ctx = document.getElementById('productivityChart').getContext('2d');
        
        this.charts.productivity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Productivity Score',
                    data: [85, 92, 78, 95, 87, 65, 88],
                    backgroundColor: '#667eea',
                    borderColor: '#5a6fd8',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createWordCountChart() {
        const ctx = document.getElementById('wordCountChart').getContext('2d');
        
        this.charts.wordCount = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-500', '501-1000', '1001-2000', '2001-5000', '5000+'],
                datasets: [{
                    label: 'Number of Transcripts',
                    data: [8, 22, 45, 60, 12],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(102, 126, 234, 0.8)'
                    ],
                    borderColor: [
                        '#667eea',
                        '#667eea',
                        '#667eea',
                        '#667eea',
                        '#667eea'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        // Simulate data update based on time range
        const timeRangeData = {
            '7d': {
                transcripts: [30, 32, 28, 35, 38, 36, 34],
                productivity: [88, 92, 85, 90, 87, 82, 89]
            },
            '30d': {
                transcripts: [18, 22, 25, 28, 32, 35, 38],
                productivity: [85, 92, 78, 95, 87, 65, 88]
            },
            '90d': {
                transcripts: [15, 18, 22, 25, 28, 32, 35],
                productivity: [80, 85, 88, 82, 90, 78, 85]
            }
        };

        const data = timeRangeData[this.currentTimeRange] || timeRangeData['30d'];

        // Update transcripts chart
        this.charts.transcripts.data.datasets[0].data = data.transcripts;
        this.charts.transcripts.update();

        // Update productivity chart
        this.charts.productivity.data.datasets[0].data = data.productivity;
        this.charts.productivity.update();

        this.showToast(`Updated view for ${this.getTimeRangeLabel(this.currentTimeRange)}`, 'success');
    }

    getTimeRangeLabel(range) {
        const labels = {
            '7d': 'Last 7 Days',
            '30d': 'Last 30 Days',
            '90d': 'Last 90 Days',
            '1y': 'Last Year',
            'custom': 'Custom Range'
        };
        return labels[range] || range;
    }

    switchComparisonPeriod(period) {
        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-period') === period);
        });

        // Update comparison data based on period
        const comparisonData = {
            monthly: {
                user: { transcripts: 147, completion: 94, time: '2h 18m' },
                team: { transcripts: 132, completion: 89, time: '2h 45m' },
                top: { transcripts: 168, completion: 96, time: '2h 05m' }
            },
            quarterly: {
                user: { transcripts: 432, completion: 92, time: '2h 22m' },
                team: { transcripts: 396, completion: 87, time: '2h 51m' },
                top: { transcripts: 504, completion: 95, time: '2h 08m' }
            },
            yearly: {
                user: { transcripts: 1728, completion: 91, time: '2h 25m' },
                team: { transcripts: 1584, completion: 86, time: '2h 55m' },
                top: { transcripts: 2016, completion: 94, time: '2h 12m' }
            }
        };

        const data = comparisonData[period] || comparisonData.monthly;

        // Update comparison cards
        this.updateComparisonCard(0, data.user);
        this.updateComparisonCard(1, data.team);
        this.updateComparisonCard(2, data.top);

        this.showToast(`Switched to ${period} comparison`, 'info');
    }

    updateComparisonCard(cardIndex, data) {
        const cards = document.querySelectorAll('.comparison-card');
        const card = cards[cardIndex];
        
        const stats = card.querySelectorAll('.stat');
        stats[0].querySelector('.stat-value').textContent = data.transcripts;
        stats[1].querySelector('.stat-value').textContent = data.completion + '%';
        stats[2].querySelector('.stat-value').textContent = data.time;
    }

    showExportModal() {
        const modal = document.getElementById('exportAnalyticsModal');
        modal.classList.add('show');
    }

    generateReport() {
        const format = document.querySelector('input[name="export-report"]:checked').value;
        
        // Simulate report generation
        this.showToast(`Generating ${format.toUpperCase()} report...`, 'info');
        
        setTimeout(() => {
            this.showToast(`Analytics report exported as ${format.toUpperCase()}`, 'success');
            this.closeModal('exportAnalyticsModal');
            
            // Simulate download
            const blob = new Blob(['Analytics Report Data'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 2000);
    }

    loadAnalyticsData() {
        // Simulate loading data
        setTimeout(() => {
            this.showToast('Analytics data loaded successfully', 'success');
        }, 1000);
    }

    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Fallback
            alert(message);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }
}

// Initialize analytics dashboard
document.addEventListener('DOMContentLoaded', function() {
    window.analyticsDashboard = new AnalyticsDashboard();
    
    // Global functions
    window.exportAnalytics = function() {
        window.analyticsDashboard.showExportModal();
    };
    
    window.generateReport = function() {
        window.analyticsDashboard.generateReport();
    };
    
    window.closeModal = function(modalId) {
        window.analyticsDashboard.closeModal(modalId);
    };
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});