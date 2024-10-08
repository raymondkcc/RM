document.addEventListener("DOMContentLoaded", function() {
    const billsArea = document.getElementById("bills-area");
    const coinsArea = document.getElementById("coins-area");
    const totalMoneyDisplay = document.getElementById("totalMoney");
    const resetButton = document.getElementById("resetButton");

    const coinAppearSound = document.getElementById("coinAppearSound");
    const coinDisappearSound = document.getElementById("coinDisappearSound");

    let totalMoney = 0;

    // Function to play a sound
    function playSound(sound) {
        sound.currentTime = 0; // Reset the sound to start
        sound.play();
    }

    // Function to add an item to the work area
    function addItem(value, src, alt, isBill) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.classList.add(isBill ? "dropped-bill" : "dropped-coin");
        img.style.width = isBill ? "120px" : "60px"; // Adjust size
        img.style.height = "auto";

        img.addEventListener("click", () => {
            // Remove the item and update total money
            totalMoney -= value;
            updateTotals();
            img.remove();
            playSound(coinDisappearSound);
        });

        if (isBill) {
            billsArea.appendChild(img);
        } else {
            coinsArea.appendChild(img);
        }

        // Play sound effect when item appears
        playSound(coinAppearSound);

        // Update the total money value
        totalMoney += value;
        updateTotals();
    }

    // Handle drag over for both areas
    [billsArea, coinsArea].forEach(area => {
        area.addEventListener("dragover", (e) => {
            e.preventDefault();
            area.classList.add("dragging");
        });

        area.addEventListener("dragleave", () => {
            area.classList.remove("dragging");
        });

        area.addEventListener("drop", (e) => {
            e.preventDefault();
            area.classList.remove("dragging");

            const value = parseFloat(e.dataTransfer.getData("value"));
            const src = e.dataTransfer.getData("src");
            const alt = e.dataTransfer.getData("alt");

            // Determine if the dropped item is a bill or a coin
            const isBill = value >= 1;
            const isCoin = value < 1;

            // Determine the target area
            const targetIsBillArea = area.id === "bills-area";
            const targetIsCoinArea = area.id === "coins-area";

            // Check for incorrect placement
            if ((isBill && !targetIsBillArea) || (isCoin && !targetIsCoinArea)) {
                alert("Incorrect placement! Bills and coins must be placed in their respective areas.");
                return;
            }

            // Add the item
            addItem(value, src, alt, isBill);
        });
    });

    // Handle touch/click on sidebar items
    document.querySelectorAll(".sidebar .money-item img").forEach(img => {
        img.addEventListener("click", () => {
            const value = parseFloat(img.dataset.value);
            const src = img.src;
            const alt = img.alt;

            // Determine if the clicked item is a bill or a coin
            const isBill = value >= 1;

            // Add the item to the appropriate work area
            addItem(value, src, alt, isBill);
        });
    });

    // Update total money calculation
    function updateTotals() {
        totalMoneyDisplay.textContent = `RM ${totalMoney.toFixed(2)}`;
    }

    // Handle reset button
    resetButton.addEventListener("click", () => {
        billsArea.innerHTML = "";
        coinsArea.innerHTML = "";
        totalMoney = 0;
        updateTotals();
    });

    // Handle dragstart for draggable items
    document.querySelectorAll(".sidebar .money-item img").forEach(img => {
        img.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("value", e.target.dataset.value);
            e.dataTransfer.setData("src", e.target.src);
            e.dataTransfer.setData("alt", e.target.alt);
        });
    });
});
