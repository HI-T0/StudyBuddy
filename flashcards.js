export function initFlashcards() {
    const flashcardContainer = document.querySelector('.flashcard');
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    const flipButton = document.getElementById('flip-card');
    const addFlashcardForm = document.getElementById('add-flashcard-form');

    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    let currentCardIndex = 0;

    function updateFlashcard() {
        if (flashcards.length > 0) {
            const card = flashcards[currentCardIndex];
            document.querySelector('.flashcard-front p').textContent = card.front;
            document.querySelector('.flashcard-back p').textContent = card.back;
        } else {
            document.querySelector('.flashcard-front p').textContent = 'Add a flashcard to get started!';
            document.querySelector('.flashcard-back p').textContent = '';
        }
        flashcardContainer.classList.remove('flipped');
    }

    flipButton.addEventListener('click', () => {
        flashcardContainer.classList.toggle('flipped');
    });

    prevButton.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateFlashcard();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentCardIndex < flashcards.length - 1) {
            currentCardIndex++;
            updateFlashcard();
        }
    });

    addFlashcardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const front = e.target.elements.cardFront.value;
        const back = e.target.elements.cardBack.value;
        
        flashcards.push({ front, back });
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        
        addFlashcardForm.reset();
        updateFlashcard();
    });

    updateFlashcard();
}