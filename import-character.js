// import-character.js

function setElementValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
}

function setDotValue(id, value) {
    const dotsElement = document.querySelector(`#${id} .dots`);
    if (dotsElement) {
        dotsElement.dataset.value = value;
        Array.from(dotsElement.children).forEach((dot, index) => 
            dot.classList.toggle('filled', index < value)
        );
    }
}

function populateBasicInfo(data) {
    ['name', 'player', 'chronicle', 'nature', 'demeanor', 'concept', 'clan', 'generation', 'sire']
        .forEach(field => setElementValue(field, data[field] || ''));
}

function populateAttributes({ attributes }) {
    Object.entries(attributes).forEach(([category, attrs]) => {
        attrs.forEach(({ name, value }) => setDotValue(name, value));
    });
}

function populateAbilities({ abilities }) {
    Object.entries(abilities).forEach(([category, abilitiesList]) => {
        abilitiesList.forEach(({ name, value }) => {
            const lowercaseName = name.toLowerCase();
            const isCustom = !document.getElementById(lowercaseName);
            
            if (isCustom) {
                // Handle custom ability
                const customType = category.slice(0, -1); // Remove 's' from end (talents -> talent)
                setElementValue(`custom-${customType}-name`, name);
                setDotValue(`custom-${customType}`, value);
            } else {
                // Handle regular ability
                setDotValue(lowercaseName, value);
            }
        });
    });
}

function populateAdvantages({ advantages }) {
    populateNamedDotValues(advantages.disciplines, 'discipline', 6);
    populateNamedDotValues(advantages.backgrounds, 'background', 6);
    
    // Populate virtues
    setDotValue('conscience', advantages.virtues.conscience);
    setDotValue('selfcontrol', advantages.virtues.selfcontrol);
    setDotValue('courage', advantages.virtues.courage);
}

function populateNamedDotValues(data, prefix, count) {
    // Clear all existing values first
    for (let i = 1; i <= count; i++) {
        setElementValue(`${prefix}-${i}-name`, '');
        setDotValue(`${prefix}-${i}`, 0);
    }
    
    // Set new values
    data.forEach((item, index) => {
        if (index < count) {
            setElementValue(`${prefix}-${index + 1}-name`, item.name);
            setDotValue(`${prefix}-${index + 1}`, item.value);
        }
    });
}

function populateOtherTraits(otherTraits) {
    populateNamedDotValues(otherTraits, 'trait', 14); // Assuming there are 14 trait rows
}

function populateNamedDotValues(data, prefix, count) {
    // Clear all existing values first
    for (let i = 1; i <= count; i++) {
        setElementValue(`${prefix}-${i}-name`, '');
        setDotValue(`${prefix}-${i}`, 0);
    }
    
    // Set new values
    data.forEach((item, index) => {
        if (index < count) {
            setElementValue(`${prefix}-${index + 1}-name`, item.name);
            setDotValue(`${prefix}-${index + 1}`, item.value);
        }
    });
}

function populateHumanityPath(humanityPath) {
    if (humanityPath) {
        setElementValue('path-name', humanityPath.name);
        setDotValue('humanity', humanityPath.value);
    }
}

function setDotValue(ability, value) {
    const dotsElement = document.querySelector(`[data-ability="${ability}"]`);
    if (dotsElement) {
        dotsElement.dataset.value = value;
        updateDotDisplay(dotsElement);
    }
}

function updateDotDisplay(dotsElement) {
    const value = parseInt(dotsElement.dataset.value);
    const dots = dotsElement.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('filled', index < value);
    });
}

function populateWillpower(willpower) {
    if (willpower) {
        setDotValue('willpower-total', willpower.total);
        setDotValue('willpower-current', willpower.current);
    }
}

function populateBloodpool(bloodpool) {
    if (bloodpool) {
        setDotValue('bloodpool', bloodpool.value);
        setElementValue('bloodpool-points-per-turn', bloodpool.pointsPerTurn);
    }
}

function populateHealth(health) {
    if (health) {
        Object.entries(health).forEach(([level, value]) => {
            setDotValue(`health-${level}`, value);
        });
    }
}

function populateWeaknessAndExperience(characterData) {
    if (characterData.weakness) {
        setElementValue('weakness', characterData.weakness);
    }
    if (characterData.experience) {
        setElementValue('experience', characterData.experience);
    }
}

function importCharacter() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = event => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const characterData = JSON.parse(e.target.result);
                populateBasicInfo(characterData);
                populateAttributes(characterData);
                populateAbilities(characterData);
                populateAdvantages(characterData);
                populateOtherTraits(characterData.otherTraits);
                populateHumanityPath(characterData.humanityPath);
                populateWillpower(characterData.willpower);
                populateBloodpool(characterData.bloodpool);
                populateHealth(characterData.health);
                populateWeaknessAndExperience(characterData);
                console.log("Character imported successfully");
            } catch (error) {
                console.error("Import error:", error);
                alert("Failed to import character data. Please ensure the file is valid JSON.");
            }
        };
        reader.readAsText(event.target.files[0]);
    };
    input.click();
}

// Make importCharacter available globally
window.importCharacter = importCharacter;
