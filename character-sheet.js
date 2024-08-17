// character-sheet.js

document.addEventListener('DOMContentLoaded', initializeCharacterSheet);

function initializeCharacterSheet() {
    generateDots();
    addEventListeners();

    document.getElementById('export-character').addEventListener('click', exportCharacter);
    document.getElementById('import-character').addEventListener('click', importCharacter);
}

function generateDots() {
    document.querySelectorAll('.dots').forEach(dotGroup => {
        const max = parseInt(dotGroup.dataset.max);
        dotGroup.dataset.value = "0";
        
        const dotFragment = document.createDocumentFragment();
        for (let i = 1; i <= max; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.value = i;
            dotFragment.appendChild(dot);
        }
        dotGroup.appendChild(dotFragment);
    });
}

function addEventListeners() {
    document.body.addEventListener('click', handleDotClick);
    document.body.addEventListener('input', handleInputChange);
}

function handleDotClick(event) {
    const dot = event.target.closest('.dot');
    if (!dot) return;

    const dotGroup = dot.parentElement;
    const clickedValue = parseInt(dot.dataset.value);
    const currentValue = parseInt(dotGroup.dataset.value);

    dotGroup.dataset.value = clickedValue === currentValue ? "0" : clickedValue.toString();
    updateDotDisplay(dotGroup);
}

function handleInputChange(event) {
    const input = event.target;
    if (input.type === 'text' || input.type === 'textarea') {
        console.log(`${input.name || input.id} changed to: ${input.value}`);
    } else if (input.type === 'number') {
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        input.value = Math.max(min, Math.min(max, value));
        console.log(`${input.name || input.id} changed to: ${input.value}`);
    }
}

function updateDotDisplay(dotGroup) {
    const currentValue = parseInt(dotGroup.dataset.value);
    dotGroup.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('filled', index < currentValue);
    });
}

// Utility functions for getting and setting dot values
function getDotValue(elementId) {
    const dotsElement = document.querySelector(`#${elementId} .dots`);
    return dotsElement ? parseInt(dotsElement.dataset.value) : 0;
}

function setDotValue(elementId, value) {
    const dotsElement = document.querySelector(`#${elementId} .dots`);
    if (dotsElement) {
        dotsElement.dataset.value = value;
        updateDotDisplay(dotsElement);
    }
}

// Make utility functions globally available
window.getDotValue = getDotValue;
window.setDotValue = setDotValue;