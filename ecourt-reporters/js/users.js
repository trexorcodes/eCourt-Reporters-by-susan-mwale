// User Management Functionality
class UserManager {
    constructor() {
        this.users = [];
        this.currentPage = 1;
        this.usersPerPage = 5;
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        console.log('Initializing User Manager...');
        
        this.setupEventListeners();
        this.loadUsers();
        this.setupSearch();
    }

    setupEventListeners() {
        // Select all checkbox
        document.getElementById('selectAllUsers').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // User checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('user-checkbox')) {
                this.updateSelectedCount();
            }
        });

        // Add user form
        document.getElementById('addUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewUser();
        });

        // Role change in form
        document.getElementById('role').addEventListener('change', (e) => {
            this.updateRolePermissions(e.target.value);
        });

        // Pagination
        document.querySelectorAll('.pagination-page').forEach(page => {
            page.addEventListener('click', (e) => {
                this.goToPage(parseInt(e.target.textContent));
            });
        });

        document.querySelector('.pagination-btn:not(:disabled)').addEventListener('click', () => {
            this.nextPage();
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('usersSearch');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterUsers();
            }, 300);
        });
    }

    loadUsers() {
        // Simulate loading users from API
        this.showLoadingState();
        
        setTimeout(() => {
            // Sample user data
            this.users = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@courtreporter.com',
                    role: 'admin',
                    status: 'active',
                    lastActive: '2 minutes ago',
                    avatarColor: '#667eea'
                },
                {
                    id: 2,
                    firstName: 'Sarah',
                    lastName: 'Chen',
                    email: 'sarah.chen@courtreporter.com',
                    role: 'editor',
                    status: 'active',
                    lastActive: '15 minutes ago',
                    avatarColor: '#10b981'
                },
                {
                    id: 3,
                    firstName: 'Mike',
                    lastName: 'Rodriguez',
                    email: 'mike.rodriguez@courtreporter.com',
                    role: 'reviewer',
                    status: 'active',
                    lastActive: '1 hour ago',
                    avatarColor: '#f59e0b'
                },
                {
                    id: 4,
                    firstName: 'Lisa',
                    lastName: 'Park',
                    email: 'lisa.park@courtreporter.com',
                    role: 'viewer',
                    status: 'inactive',
                    lastActive: '2 days ago',
                    avatarColor: '#3b82f6'
                },
                {
                    id: 5,
                    firstName: 'Alex',
                    lastName: 'Wong',
                    email: 'alex.wong@courtreporter.com',
                    role: 'pending',
                    status: 'pending',
                    lastActive: 'Invitation sent',
                    avatarColor: '#8b5cf6'
                }
            ];
            
            this.displayUsers();
            this.hideLoadingState();
        }, 1000);
    }

    displayUsers() {
        const filteredUsers = this.filterUsersBySearch();
        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + this.usersPerPage);
        
        this.updatePagination(filteredUsers.length);
        
        if (paginatedUsers.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
        }
    }

    filterUsersBySearch() {
        if (!this.searchQuery) {
            return this.users;
        }
        
        const query = this.searchQuery.toLowerCase();
        return this.users.filter(user => 
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
        );
    }

    filterUsers() {
        this.currentPage = 1;
        this.displayUsers();
    }

    updatePagination(totalUsers) {
        const totalPages = Math.ceil(totalUsers / this.usersPerPage);
        const paginationInfo = document.querySelector('.pagination-info');
        const startUser = ((this.currentPage - 1) * this.usersPerPage) + 1;
        const endUser = Math.min(this.currentPage * this.usersPerPage, totalUsers);
        
        paginationInfo.textContent = `Showing ${startUser}-${endUser} of ${totalUsers} users`;
        
        // Update pagination buttons
        const pagesContainer = document.querySelector('.pagination-pages');
        pagesContainer.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageElement = document.createElement('span');
            pageElement.className = `pagination-page ${i === this.currentPage ? 'active' : ''}`;
            pageElement.textContent = i;
            pageElement.addEventListener('click', () => this.goToPage(i));
            pagesContainer.appendChild(pageElement);
        }
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.pagination-btn:first-child');
        const nextBtn = document.querySelector('.pagination-btn:last-child');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
    }

    goToPage(page) {
        this.currentPage = page;
        this.displayUsers();
    }

    nextPage() {
        this.currentPage++;
        this.displayUsers();
    }

    prevPage() {
        this.currentPage--;
        this.displayUsers();
    }

    toggleSelectAll(selectAll) {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll;
        });
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const selectedCount = document.querySelectorAll('.user-checkbox:checked').length;
        // Could update a counter display if needed
    }

    addNewUser() {
        const formData = new FormData(document.getElementById('addUserForm'));
        const userData = {
            firstName: formData.get('firstName') || document.getElementById('firstName').value,
            lastName: formData.get('lastName') || document.getElementById('lastName').value,
            email: formData.get('email') || document.getElementById('email').value,
            role: formData.get('role') || document.getElementById('role').value,
            team: document.getElementById('team').value,
            welcomeMessage: document.getElementById('welcomeMessage').value
        };
        
        // Validate form
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.role) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate API call
        this.showLoadingState();
        
        setTimeout(() => {
            // Add new user to the list
            const newUser = {
                id: this.users.length + 1,
                ...userData,
                status: 'pending',
                lastActive: 'Invitation sent',
                avatarColor: this.getRandomColor()
            };
            
            this.users.unshift(newUser);
            this.displayUsers();
            this.hideLoadingState();
            this.closeModal('addUserModal');
            this.resetAddUserForm();
            
            this.showToast(`Invitation sent to ${userData.email}`, 'success');
        }, 1500);
    }

    getRandomColor() {
        const colors = ['#667eea', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    resetAddUserForm() {
        document.getElementById('addUserForm').reset();
    }

    updateRolePermissions(role) {
        const permissions = {
            viewer: ['View Transcripts'],
            reviewer: ['View Transcripts', 'Create Transcripts', 'Edit Transcripts'],
            editor: ['View Transcripts', 'Create Transcripts', 'Edit Transcripts', 'Delete Transcripts'],
            admin: ['View Transcripts', 'Create Transcripts', 'Edit Transcripts', 'Delete Transcripts', 'Manage Users', 'System Settings']
        };
        
        const permissionTags = document.querySelectorAll('.permission-tag');
        const rolePermissions = permissions[role] || [];
        
        permissionTags.forEach(tag => {
            const permission = tag.querySelector('span').textContent;
            const icon = tag.querySelector('i');
            
            if (rolePermissions.includes(permission)) {
                icon.className = 'fas fa-check';
                icon.style.color = '#10b981';
            } else {
                icon.className = 'fas fa-times';
                icon.style.color = '#ef4444';
            }
        });
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.showToast(`Editing user: ${user.firstName} ${user.lastName}`, 'info');
            // In real app, populate and show edit modal
        }
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.showToast(`Viewing profile: ${user.firstName} ${user.lastName}`, 'info');
            // In real app, show user profile modal
        }
    }

    messageUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.showToast(`Opening message composer for ${user.firstName}`, 'info');
            // In real app, open message composer
        }
    }

    resendInvite(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.showToast(`Invitation resent to ${user.email}`, 'success');
        }
    }

    cancelInvite(userId) {
        if (confirm('Are you sure you want to cancel this invitation?')) {
            this.users = this.users.filter(u => u.id !== userId);
            this.displayUsers();
            this.showToast('Invitation cancelled', 'success');
        }
    }

    showLoadingState() {
        document.getElementById('usersLoading').classList.add('show');
    }

    hideLoadingState() {
        document.getElementById('usersLoading').classList.remove('show');
    }

    showEmptyState() {
        document.getElementById('usersEmpty').style.display = 'block';
        document.querySelector('.users-table').style.display = 'none';
        document.querySelector('.users-pagination').style.display = 'none';
    }

    hideEmptyState() {
        document.getElementById('usersEmpty').style.display = 'none';
        document.querySelector('.users-table').style.display = 'table';
        document.querySelector('.users-pagination').style.display = 'flex';
    }

    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Global user management functions
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.classList.add('show');
}

function showBulkInviteModal() {
    window.userManager.showToast('Bulk invite feature coming soon', 'info');
}

function showRoleManager() {
    window.userManager.showToast('Role manager feature coming soon', 'info');
}

function showPermissions() {
    window.userManager.showToast('Permission settings feature coming soon', 'info');
}

function exportUsers() {
    window.userManager.showToast('Exporting user list...', 'info');
    
    // Simulate export
    setTimeout(() => {
        window.userManager.showToast('User list exported successfully', 'success');
    }, 2000);
}

function editUser(userId) {
    window.userManager.editUser(userId);
}

function viewUser(userId) {
    window.userManager.viewUser(userId);
}

function messageUser(userId) {
    window.userManager.messageUser(userId);
}

function resendInvite(userId) {
    window.userManager.resendInvite(userId);
}

function cancelInvite(userId) {
    window.userManager.cancelInvite(userId);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Initialize user management
document.addEventListener('DOMContentLoaded', function() {
    window.userManager = new UserManager();
    
    // Global functions
    window.showAddUserModal = showAddUserModal;
    window.showBulkInviteModal = showBulkInviteModal;
    window.showRoleManager = showRoleManager;
    window.showPermissions = showPermissions;
    window.exportUsers = exportUsers;
    window.editUser = editUser;
    window.viewUser = viewUser;
    window.messageUser = messageUser;
    window.resendInvite = resendInvite;
    window.cancelInvite = cancelInvite;
    window.closeModal = closeModal;
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});