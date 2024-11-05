// script.js

// Toggle settings menu visibility
function toggleSettingsMenu() {
    const menu = document.getElementById("settings-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Set the theme based on user selection
function setTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    toggleSettingsMenu(); // Close settings menu after selection
}

// Default theme setup
document.body.setAttribute("data-theme", "light");

async function fetchInformation(query) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.RelatedTopics || [];
    } catch (error) {
        console.error('Error fetching information:', error);
        return [];
    }
}

async function search() {
    const query = document.getElementById("search-input").value;
    const resultsContainer = document.getElementById("results");
    const mainInfoCard = document.getElementById("main-info-card");
    const additionalInfo = document.getElementById("additional-info");

    resultsContainer.innerHTML = ''; // Clear previous results
    mainInfoCard.innerHTML = ''; // Clear main info card
    additionalInfo.innerHTML = ''; // Clear additional info

    const results = await fetchInformation(query);

    if (results.length > 0) {
        // Display the first item in the main info card
        const mainItem = results[0];
        if (mainItem.Text && mainItem.FirstURL) {
            mainInfoCard.innerHTML = `
                <h2>${mainItem.Text}</h2>
                <p><a href="${mainItem.FirstURL}" target="_blank">${mainItem.FirstURL}</a></p>
                <p>Additional metadata, description, or author information can be shown here.</p>
            `;
        }

        // Additional content on the right side
        additionalInfo.innerHTML = `
            <h3>Related Information</h3>
            <p>Content related to the search query, such as categories, keywords, or suggested topics.</p>
        `;

        // Display additional items below
        results.slice(1).forEach(item => {
            if (item.Text && item.FirstURL) {
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");

                resultItem.innerHTML = `
                    <h2>${item.Text}</h2>
                    <p><a href="${item.FirstURL}" target="_blank">${item.FirstURL}</a></p>
                `;
                resultsContainer.appendChild(resultItem);
            }
        });
    } else {
        mainInfoCard.innerHTML = '<p class="no-results">No information found for this query.</p>';
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        search();
    }
}

