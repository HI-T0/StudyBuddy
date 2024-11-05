export function initNotes() {
    const noteSubject = document.getElementById('note-subject');
    const noteContent = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note');
    const notesList = document.getElementById('notes-list');

    let notes = JSON.parse(localStorage.getItem('notes')) || {};

    function renderNotes() {
        notesList.innerHTML = '';
        for (const subject in notes) {
            const noteElement = document.createElement('div');
            noteElement.innerHTML = `
                <h3>${subject}</h3>
                <p>${notes[subject]}</p>
            `;
            notesList.appendChild(noteElement);
        }
    }

    saveNoteBtn.addEventListener('click', () => {
        const subject = noteSubject.value;
        const content = noteContent.value;
        if (subject && content) {
            notes[subject] = content;
            localStorage.setItem('notes', JSON.stringify(notes));
            noteSubject.value = '';
            noteContent.value = '';
            renderNotes();
        }
    });

    renderNotes();
}