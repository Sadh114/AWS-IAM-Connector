let permissionsData = [];
let currentData = [];

// Function to parse CSV
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const data = [];
    for (let i = 1; i < lines.length; i++) { // Skip header
        const [user, policyType, policyName] = lines[i].split(',');
        if (user && policyType && policyName) {
            data.push({ user, policyType, policyName });
        }
    }
    return data;
}

// Function to populate table
function populateTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.user}</td>
            <td>${row.policyType}</td>
            <td>${row.policyName}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to download CSV
function downloadCSV() {
    if (currentData.length === 0) {
        alert('No data available to download.');
        return;
    }

    const headers = ['User', 'Policy Type', 'Policy Name'];
    const csvContent = [
        headers.join(','),
        ...currentData.map(row => [row.user, row.policyType, row.policyName].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'iam_permissions_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('CSV downloaded successfully');
}

// Load CSV on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('iam_permissions.csv');
        const csvText = await response.text();
        permissionsData = parseCSV(csvText);
        currentData = permissionsData;
        populateTable(currentData);

        // Add search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.placeholder = 'Search by user or policy name...';
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredData = permissionsData.filter(row => 
                row.user.toLowerCase().includes(searchTerm) ||
                row.policyName.toLowerCase().includes(searchTerm)
            );
            currentData = filteredData;
            populateTable(currentData);
        });

        // Add CSV download functionality
        const downloadCsvBtn = document.getElementById('downloadCsv');
        if (downloadCsvBtn) {
            downloadCsvBtn.addEventListener('click', () => {
                console.log('CSV download button clicked');
                downloadCSV();
            });
        }
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="3">Error loading data. Please ensure iam_permissions.csv is in the same directory.</td></tr>';
    }
});
