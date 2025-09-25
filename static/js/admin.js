
class AdminPanel {
    constructor() {
        this.registrations = [];
        this.init();
    }

    init() {
        this.bindEvents();
        
        this.loadRegistrations();
    }

    bindEvents() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        const downloadBtn = document.getElementById('downloadCsv');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCSV());
        }
    }

    async loadRegistrations() {
        try {
            this.showLoading();
            
            const response = await fetch('/api/registrations');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.registrations = await response.json();
            
            this.updateStatistics();
            this.populateTable();
            
        } catch (error) {
            console.error('Error loading registrations:', error);
            this.showError('Failed to load registrations. Please try again.');
        }
    }

    updateStatistics() {
        const totalCount = this.registrations.length;
        document.getElementById('totalCount').textContent = totalCount;

        const branchStats = this.calculateBranchStats();
        document.getElementById('branchStats').innerHTML = this.formatBranchStats(branchStats);

        const yearStats = this.calculateYearStats();
        document.getElementById('yearStats').innerHTML = this.formatYearStats(yearStats);
    }

    calculateBranchStats() {
        const branchCount = {};
        
        this.registrations.forEach(reg => {
            const branch = reg.branch || 'Unknown';
            branchCount[branch] = (branchCount[branch] || 0) + 1;
        });

        return branchCount;
    }

    calculateYearStats() {
        const yearCount = {};
        
        this.registrations.forEach(reg => {
            const year = reg.year || 'Unknown';
            yearCount[year] = (yearCount[year] || 0) + 1;
        });

        return yearCount;
    }

    formatBranchStats(branchStats) {
        if (Object.keys(branchStats).length === 0) {
            return 'No data';
        }

        return Object.entries(branchStats)
            .map(([branch, count]) => `${branch}: ${count}`)
            .join('<br>');
    }

    formatYearStats(yearStats) {
        if (Object.keys(yearStats).length === 0) {
            return 'No data';
        }

        return Object.entries(yearStats)
            .sort(([a], [b]) => {
                const yearA = parseInt(a) || 999;
                const yearB = parseInt(b) || 999;
                return yearA - yearB;
            })
            .map(([year, count]) => `Year ${year}: ${count}`)
            .join('<br>');
    }

    populateTable() {
        const tableBody = document.getElementById('tableBody');
        
        if (!tableBody) {
            console.error('Table body element not found');
            return;
        }

        tableBody.innerHTML = '';

        if (this.registrations.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">No registrations found</td>
                </tr>
            `;
            return;
        }

        const sortedRegistrations = [...this.registrations].sort((a, b) => {
            const dateA = new Date(a.timestamp || 0);
            const dateB = new Date(b.timestamp || 0);
            return dateB - dateA;
        });

        sortedRegistrations.forEach(registration => {
            const row = this.createTableRow(registration);
            tableBody.appendChild(row);
        });
    }

    createTableRow(registration) {
        const row = document.createElement('tr');
        
        const formattedDate = this.formatTimestamp(registration.timestamp);
        
        row.innerHTML = `
            <td>${this.escapeHtml(registration.name || 'N/A')}</td>
            <td>${this.escapeHtml(registration.email || 'N/A')}</td>
            <td>${this.escapeHtml(registration.phone || 'N/A')}</td>
            <td>${this.escapeHtml(registration.year || 'N/A')}</td>
            <td>${this.escapeHtml(registration.branch || 'N/A')}</td>
            <td>${formattedDate}</td>
        `;
        
        return row;
    }

    formatTimestamp(timestamp) {
        if (!timestamp) {
            return 'N/A';
        }

        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return 'Invalid Date';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        document.getElementById('totalCount').textContent = '...';
        document.getElementById('branchStats').textContent = 'Loading...';
        document.getElementById('yearStats').textContent = 'Loading...';

        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">Loading registrations...</td>
                </tr>
            `;
        }
    }

    showError(message) {
        document.getElementById('totalCount').textContent = 'Error';
        document.getElementById('branchStats').textContent = 'Error loading data';
        document.getElementById('yearStats').textContent = 'Error loading data';

        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading" style="color: #e74c3c;">
                        ${this.escapeHtml(message)}
                    </td>
                </tr>
            `;
        }

        alert(message);
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = 'Refreshing...';
        }

        try {
            await this.loadRegistrations();
            
            if (refreshBtn) {
                refreshBtn.textContent = 'Refreshed!';
                setTimeout(() => {
                    refreshBtn.textContent = 'Refresh Data';
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error refreshing data:', error);
            
            if (refreshBtn) {
                refreshBtn.textContent = 'Error!';
                setTimeout(() => {
                    refreshBtn.textContent = 'Refresh Data';
                }, 2000);
            }
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
            }
        }
    }

    async downloadCSV() {
        const downloadBtn = document.getElementById('downloadCsv');
        
        try {
            if (downloadBtn) {
                downloadBtn.disabled = true;
                downloadBtn.textContent = 'Downloading...';
            }

            const response = await fetch('/download-csv');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'gdg_registrations.csv';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            if (downloadBtn) {
                downloadBtn.textContent = 'Downloaded!';
                setTimeout(() => {
                    downloadBtn.textContent = 'Download CSV';
                }, 2000);
            }

        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert(`Failed to download CSV: ${error.message}`);
            
            if (downloadBtn) {
                downloadBtn.textContent = 'Download Failed';
                setTimeout(() => {
                    downloadBtn.textContent = 'Download CSV';
                }, 2000);
            }
        } finally {
            if (downloadBtn) {
                downloadBtn.disabled = false;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanel;
}
