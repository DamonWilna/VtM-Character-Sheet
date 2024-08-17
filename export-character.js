// export-character.js

function getElementValue(id) {
    return document.getElementById(id)?.value || '';
}

function getDotValue(id) {
    return parseInt(document.querySelector(`#${id} .dots`)?.dataset.value) || 0;
}

function getBasicInfo() {
    const fields = ['name', 'player', 'chronicle', 'nature', 'demeanor', 'concept', 'clan', 'generation', 'sire'];
    return Object.fromEntries(fields.map(field => [field, getElementValue(field)]));
}

function getAttributesData() {
    const categories = {
        physical: ['strength', 'dexterity', 'stamina'],
        social: ['charisma', 'manipulation', 'appearance'],
        mental: ['perception', 'intelligence', 'wits']
    };

    return Object.entries(categories).reduce((acc, [category, attributes]) => {
        acc[category] = attributes.map(attr => ({ name: attr, value: getDotValue(attr) }));
        return acc;
    }, {});
}

function getAbilitiesData() {
    const categories = {
        talents: ['alertness', 'athletics', 'brawl', 'dodge', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge'],
        skills: ['animal-ken', 'crafts', 'drive', 'etiquette', 'firearms', 'melee', 'performance', 'security', 'stealth', 'survival'],
        knowledges: ['academics', 'computer', 'finance', 'investigation', 'law', 'linguistics', 'medicine', 'occult', 'politics', 'science']
    };

    return Object.entries(categories).reduce((acc, [category, abilities]) => {
        acc[category] = [
            ...abilities.map(ability => ({ name: ability, value: getDotValue(ability) })),
            {
                name: getElementValue(`custom-${category.slice(0, -1)}-name`) || `Custom ${category.slice(0, -1)}`,
                value: getDotValue(`custom-${category.slice(0, -1)}`)
            }
        ].filter(ability => ability.value > 0 || (ability.name && ability.name !== `Custom ${category.slice(0, -1)}`));
        return acc;
    }, {});
}

function getAdvantagesData() {
    return {
        disciplines: getNamedDotValues('discipline', 6),
        backgrounds: getNamedDotValues('background', 6),
        virtues: {
            conscience: getDotValue('conscience'),
            selfcontrol: getDotValue('selfcontrol'),
            courage: getDotValue('courage')
        }
    };
}

function getNamedDotValues(prefix, count) {
    return Array.from({ length: count }, (_, i) => i + 1)
        .map(i => ({
            name: getElementValue(`${prefix}-${i}-name`),
            value: getDotValue(`${prefix}-${i}`)
        }))
        .filter(item => item.name && item.value > 0);
}

function getOtherTraitsData() {
    return getNamedDotValues('trait', 14); // Assuming there are 14 trait rows based on the image
}

function getNamedDotValues(prefix, count) {
    return Array.from({ length: count }, (_, i) => i + 1)
        .map(i => ({
            name: getElementValue(`${prefix}-${i}-name`),
            value: getDotValue(`${prefix}-${i}`)
        }))
        .filter(item => item.name || item.value > 0); // Include if name is set or value is greater than 0
}

function getHumanityPathData() {
    return {
        name: getElementValue('path-name'),
        value: getDotValue('humanity')
    };
}

function getDotValue(ability) {
    const dotElement = document.querySelector(`[data-ability="${ability}"]`);
    return dotElement ? parseInt(dotElement.dataset.value) || 0 : 0;
}

function getWillpowerData() {
    return {
        total: getDotValue('willpower-total'),
        current: getDotValue('willpower-current')
    };
}

function getBloodpoolData() {
    return {
        value: getDotValue('bloodpool'),
        pointsPerTurn: getElementValue('bloodpool-points-per-turn') || 0
    };
}

function getHealthData() {
    const healthLevels = [
        'bruised', 'hurt', 'injured', 'wounded', 'mauled', 'crippled', 'incapacitated'
    ];
    
    return healthLevels.reduce((acc, level) => {
        acc[level] = getDotValue(`health-${level}`);
        return acc;
    }, {});
}

function getWeaknessAndExperienceData() {
    return {
        weakness: getElementValue('weakness'),
        experience: getElementValue('experience')
    };
}

function exportCharacter() {
    try {
        const characterData = {
            ...getBasicInfo(),
            attributes: getAttributesData(),
            abilities: getAbilitiesData(),
            advantages: getAdvantagesData(),
            otherTraits: getOtherTraitsData(),
            humanityPath: getHumanityPathData(),
            willpower: getWillpowerData(),
            bloodpool: getBloodpoolData(),
            health: getHealthData(),
            weakness: getElementValue('weakness'),
            experience: getElementValue('experience')
        };

        const blob = new Blob([JSON.stringify(characterData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${characterData.name || 'character'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Export error:", error);
        alert("An error occurred while exporting the character.");
    }
}

// Make exportCharacter available globally
window.exportCharacter = exportCharacter;
