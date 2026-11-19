const destinations = [
    {
        name: "Miami, Florida",
        category: "Beach",
        image: "images/miami.jpg",
        alt: "Colorful buildings and a beach in Miami",
        tagline: "Sunny city life",
        description: "Enjoy bright beaches, delicious food, and a lively art scene.",
        activities: ["Relax at South Beach", "Visit Wynwood Walls", "Try local Cuban food"]
    },
    {
        name: "Santorini, Greece",
        category: "Beach",
        image: "images/santorini.jpg",
        alt: "White buildings and blue water in Santorini",
        tagline: "Island views",
        description: "See beautiful sunsets, white buildings, and blue Aegean water.",
        activities: ["Watch the sunset in Oia", "Explore the caldera", "Tour a local winery"]
    },
    {
        name: "Tokyo, Japan",
        category: "City",
        image: "images/tokyo.jpg",
        alt: "Tokyo city buildings at night",
        tagline: "Bright city nights",
        description: "Experience exciting neighborhoods, amazing food, and rich history.",
        activities: ["Visit Senso-ji Temple", "Explore Shibuya Crossing", "Eat fresh sushi"]
    },
    {
        name: "Orlando, Florida",
        category: "Family",
        image: "images/orlando.jpg",
        alt: "Sunny outdoor scenery in Florida",
        tagline: "Fun for everyone",
        description: "Find exciting attractions, relaxing parks, and plenty of family fun.",
        activities: ["Visit a theme park", "Explore Lake Eola", "Try a local food hall"]
    },
    {
        name: "Mykonos, Greece",
        category: "Beach",
        image: "images/mykonos.jpg",
        alt: "Bright island buildings beside blue water",
        tagline: "Relaxed island days",
        description: "Enjoy peaceful beaches, charming streets, and fresh Mediterranean food.",
        activities: ["Walk Little Venice", "Relax at Platis Gialos", "Explore the windmills"]
    },
    {
        name: "Kyoto, Japan",
        category: "Culture",
        image: "images/kyoto.jpg",
        alt: "Colorful city lights in Japan",
        tagline: "History and tradition",
        description: "Discover quiet temples, beautiful gardens, and unforgettable traditions.",
        activities: ["Visit Fushimi Inari", "Walk through Gion", "See Arashiyama Bamboo Grove"]
    }
];

const gallery = document.querySelector("#destination-grid");
const tools = document.querySelector("#gallery-tools");
let currentFilter = "All";
let sortAlphabetically = false;
let searchQuery = "";
let showSavedOnly = false;
const savedDestinations = new Set();
let resultCount;
let savedButton;
let surpriseButton;

function createControls() {
    const categories = ["All", ...new Set(destinations.map((destination) => destination.category))];

    const searchLabel = document.createElement("label");
    searchLabel.className = "search-label";
    searchLabel.htmlFor = "destination-search";
    searchLabel.textContent = "Search destinations";

    const searchInput = document.createElement("input");
    searchInput.className = "search-input";
    searchInput.id = "destination-search";
    searchInput.type = "search";
    searchInput.placeholder = "Try a city or activity";
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.trim().toLocaleLowerCase();
        displayDestinations();
    });
    tools.append(searchLabel, searchInput);

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.className = "filter-button" + (category === "All" ? " active" : "");
        button.textContent = category;
        button.type = "button";
        button.setAttribute("aria-pressed", String(category === "All"));
        button.addEventListener("click", () => {
            currentFilter = category;
            document.querySelectorAll(".filter-button").forEach((filterButton) => {
                filterButton.classList.toggle("active", filterButton === button);
                filterButton.setAttribute("aria-pressed", String(filterButton === button));
            });
            displayDestinations();
        });
        tools.append(button);
    });

    savedButton = document.createElement("button");
    savedButton.className = "filter-button saved-filter";
    savedButton.type = "button";
    savedButton.setAttribute("aria-pressed", "false");
    savedButton.addEventListener("click", () => {
        showSavedOnly = !showSavedOnly;
        savedButton.classList.toggle("active", showSavedOnly);
        savedButton.setAttribute("aria-pressed", String(showSavedOnly));
        displayDestinations();
    });
    tools.append(savedButton);

    const sortLabel = document.createElement("span");
    sortLabel.className = "sort-label";
    sortLabel.textContent = "Organize:";
    tools.append(sortLabel);

    const sortButton = document.createElement("button");
    sortButton.className = "sort-button";
    sortButton.textContent = "A-Z";
    sortButton.type = "button";
    sortButton.setAttribute("aria-pressed", "false");
    sortButton.addEventListener("click", () => {
        sortAlphabetically = !sortAlphabetically;
        sortButton.textContent = sortAlphabetically ? "Original order" : "A-Z";
        sortButton.setAttribute("aria-pressed", String(sortAlphabetically));
        displayDestinations();
    });
    tools.append(sortButton);

    surpriseButton = document.createElement("button");
    surpriseButton.className = "sort-button surprise-button";
    surpriseButton.textContent = "Surprise me";
    surpriseButton.type = "button";
    surpriseButton.addEventListener("click", () => {
        const visibleDestinations = getVisibleDestinations();
        if (visibleDestinations.length > 0) {
            showDetails(visibleDestinations[Math.floor(Math.random() * visibleDestinations.length)]);
        }
    });
    tools.append(surpriseButton);

    resultCount = document.createElement("p");
    resultCount.className = "result-count";
    resultCount.setAttribute("aria-live", "polite");
    resultCount.setAttribute("aria-atomic", "true");
    tools.append(resultCount);
}

function getVisibleDestinations() {
    let visibleDestinations = destinations.filter((destination) =>
        (currentFilter === "All" || destination.category === currentFilter) &&
        (!showSavedOnly || savedDestinations.has(destination.name)) &&
        (!searchQuery || [
            destination.name,
            destination.category,
            destination.tagline,
            destination.description,
            ...destination.activities
        ].some((value) => value.toLocaleLowerCase().includes(searchQuery)))
    );

    if (sortAlphabetically) {
        visibleDestinations = [...visibleDestinations].sort((first, second) =>
            first.name.localeCompare(second.name)
        );
    }

    return visibleDestinations;
}

function displayDestinations() {
    const visibleDestinations = getVisibleDestinations();
    resultCount.textContent = `Showing ${visibleDestinations.length} of ${destinations.length} destinations`;
    savedButton.textContent = `Saved (${savedDestinations.size})`;
    surpriseButton.disabled = visibleDestinations.length === 0;

    gallery.innerHTML = "";

    if (visibleDestinations.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = showSavedOnly && savedDestinations.size === 0
            ? "You haven't saved any destinations yet. Save a place to find it here."
            : "No destinations match your search and filters. Try changing them.";
        gallery.append(emptyMessage);
        return;
    }

    visibleDestinations.forEach((destination) => {
        const card = document.createElement("article");
        card.className = "destination-card";
        card.innerHTML = `
            <div class="image-wrap">
                <img src="${destination.image}" alt="${destination.alt}">
                <span class="image-overlay">${destination.tagline}</span>
            </div>
            <div class="card-content">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                <h4>Things to do</h4>
                <ul>${destination.activities.map((activity) => `<li>${activity}</li>`).join("")}</ul>
                <button class="save-button" type="button"></button>
                <button class="details-button" type="button">View more details</button>
            </div>
        `;

        const saveButton = card.querySelector(".save-button");
        const isSaved = savedDestinations.has(destination.name);
        saveButton.textContent = isSaved ? "Saved" : "Save destination";
        saveButton.setAttribute("aria-pressed", String(isSaved));
        saveButton.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${destination.name}`);
        saveButton.addEventListener("click", () => {
            if (savedDestinations.has(destination.name)) {
                savedDestinations.delete(destination.name);
            } else {
                savedDestinations.add(destination.name);
            }
            displayDestinations();
        });

        card.querySelector(".details-button").addEventListener("click", () => {
            showDetails(destination);
        });
        gallery.append(card);
    });
}

function showDetails(destination) {
    const dialog = document.createElement("dialog");
    dialog.className = "destination-dialog";
    dialog.innerHTML = `
        <h3>${destination.name}</h3>
        <p><strong>Why visit?</strong> ${destination.description}</p>
        <p><strong>Best for:</strong> ${destination.category} trips</p>
        <button class="dialog-close" type="button">Close</button>
    `;
    document.body.append(dialog);
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
    dialog.addEventListener("close", () => dialog.remove());
    dialog.showModal();
}

createControls();
displayDestinations();