// Transcripts List Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Transcripts page loaded!');
    
    // Sample data - in real app, this would come from a server
    const sampleTranscripts = [
        {
            id: 1,
            caseNumber: 'CR-2024-001',
            caseTitle: 'State vs. Johnson',
            status: 'final',
            lastModified: '2024-01-15',
            wordCount: 1245
        },
        {
            id: 2,
            caseNumber: 'CR-2024-002',
            caseTitle: 'State vs. Smith',
            status: 'draft',
            lastModified: '2024-01-16',
            wordCount: 567
        },
        {
            id: 3,
            caseNumber: 'CR-2024-003',
            caseTitle: 'State vs. Williams',
            status: 'final',
            lastModified: '2024-01-14',
            wordCount: 1890
        }
    ];
    
    loadTranscripts(sampleTranscripts);
    
    // Search functionality
    document.getElementById('searchTranscripts').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTranscripts = sampleTranscripts.filter(transcript => 
            transcript.caseNumber.toLowerCase().includes(searchTerm) ||
            transcript.caseTitle.toLowerCase().includes(searchTerm)
        );
        loadTranscripts(filteredTranscripts);
    });
    
    // Status filter functionality
    document.getElementById('statusFilter').addEventListener('change', function(e) {
        const status = e.target.value;
        const filteredTranscripts = status === 'all' 
            ? sampleTranscripts 
            : sampleTranscripts.filter(transcript => transcript.status === status);
        loadTranscripts(filteredTranscripts);
    });
    
    function loadTranscripts(transcripts) {
        const transcriptsList = document.getElementById('transcriptsList');
        
        if (transcripts.length === 0) {
            transcriptsList.innerHTML = `
                <div class="no-transcripts">
                    <p>No transcripts match your search criteria.</p>
                </div>
            `;
            return;
        }
        
        transcriptsList.innerHTML = transcripts.map(transcript => `
            <div class="transcript-item">
                <div class="transcript-info">
                    <strong>${transcript.caseNumber}</strong>
                    <span>${transcript.caseTitle}</span>
                    <small>Last modified: ${transcript.lastModified} • Words: ${transcript.wordCount}</small>
                </div>
                <div class="transcript-actions">
                    <span class="transcript-status ${transcript.status}">
                        ${transcript.status === 'final' ? 'Final' : 'Draft'}
                    </span>
                    <button class="btn-view" onclick="viewTranscript(${transcript.id})">View</button>
                    <button class="btn-edit" onclick="editTranscript(${transcript.id})">Edit</button>
                </div>
            </div>
        `).join('');
    }
});

// These would connect to actual transcript viewing/editing
function viewTranscript(id) {
    alert(`Viewing transcript #${id} - This would open a read-only view`);
}

function editTranscript(id) {
    alert(`Editing transcript #${id} - This would open the editor with the transcript`);
}