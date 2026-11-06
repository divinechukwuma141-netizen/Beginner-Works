const favoriteButtons = document.querySelectorAll(".favorite-button");
const favoriteStatus = document.querySelector("#favorite-status");
const favoritesKey = "bookwise-favorites";

let favorites;

try {
    const savedFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");

    if (!Array.isArray(savedFavorites) || !savedFavorites.every((id) => typeof id === "string")) {
        throw new Error("Saved favorites have an invalid format.");
    }

    favorites = new Set(savedFavorites);
} catch (error) {
    favoriteStatus.textContent = "Favorites could not be loaded from this browser.";
    favoriteButtons.forEach((button) => {
        button.disabled = true;
    });
    console.error("Could not load saved favorites.", error);
}

if (favorites) {
    const updateButtons = () => {
        favoriteButtons.forEach((button) => {
            const isFavorite = favorites.has(button.dataset.bookId);
            button.setAttribute("aria-pressed", String(isFavorite));
            button.textContent = isFavorite ? "Remove from favorites" : "Add to favorites";
        });
    };

    updateButtons();

    favoriteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const updatedFavorites = new Set(favorites);
            const bookId = button.dataset.bookId;

            if (updatedFavorites.has(bookId)) {
                updatedFavorites.delete(bookId);
            } else {
                updatedFavorites.add(bookId);
            }

            try {
                localStorage.setItem(favoritesKey, JSON.stringify([...updatedFavorites]));
                favorites = updatedFavorites;
                favoriteStatus.textContent = "";
                updateButtons();
            } catch (error) {
                favoriteStatus.textContent = "Your favorite could not be saved in this browser.";
                console.error("Could not save favorites.", error);
            }
        });
    });
}
