const galleryRegistry = [
    {
        sourceFile: "JooniArt/index-jooni.html", 
        filename: "JooniArt/040124.png", 
        title: "May 02, 2025",
        label: "horizon" 
    },
    {
        sourceFile: "ChloeArt/index-chloe.html", 
        filename: "ChloeArt/CA_505.png", 
        title: "Starry Night",
        label: "cosmic"
    },
    {
        sourceFile: "URArt/index-ur.html", 
        filename: "URArt/120420.png", 
        title: "12-04-20",
        label: "still-life"
    }
];

function populateArtSlots() {
    const sectionMap = {
        'horizon': 'hrzn',
        'cosmic': 'cosm',
        'still-life': 'stllfe'
    };

    galleryRegistry.forEach(item => {
        const targetId = sectionMap[item.label];
        if (!targetId) return;

        const sectionElement = document.getElementById(targetId);
        if (!sectionElement) return;

        // Collect card boxes, skipping the first slot containing your section <h3> titles
        const emptySlots = Array.from(sectionElement.querySelectorAll('.box-content')).slice(1);
        
        // Find a slot that doesn't already have an image element inside it
        const nextAvailableSlot = emptySlots.find(slot => !slot.querySelector('img'));

        if (nextAvailableSlot) {
            nextAvailableSlot.innerHTML = `
                <a href="${item.sourceFile}" target="_blank">
                    <img src="${item.filename}" alt="${item.title}">
                </a>
                <div class="video-title">${item.title}</div>
            `;
        }
    });
}

// Fallback loader hook to ensure rendering triggers properly
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', populateArtSlots);
} else {
    populateArtSlots();
}