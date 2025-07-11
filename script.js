const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonSection = document.querySelector("#wheel-buttons");
const performanceBtn = document.querySelector("#performance-btn"); // Fixed typo "peroformanceBtn" -> "performanceBtn"

const totalPriceElement = document.querySelector("#total-price");
const basePrice = 52490;
let currentPrice = basePrice;

const downPaymentElement = document.querySelector("#down-payment");
const monthlyPaymmentElement = document.querySelector("#monthly-payment");

const fullSelfDrivingCheckbox = document.querySelector(
  "#full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
); // Fixed typo "accesoryCheckboxes" -> "accessoryCheckboxes"

let selectedColor = "Stealth Gray";
let currentWheelType = "Standard";

const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false, // Fixed typo "Perofrmance" -> "Performance"
  "Full Self-Driving": false,
};

const pricing = {
  "Performance Wheels": 2500, // Fixed typo "Perofrmance" -> "Performance"
  "Performance Package": 5000, // Fixed typo "Perofrmance" -> "Performance"
  "Full Self-Driving": 8500,
  Accessories: {
    // Fixed typo "Accesories" -> "Accessories"
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

const updatePaymenetBreakdown = () => {
  // calculate down payment
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // calculate monthly loan details (assuming 60-month loan and 3% interest rate)

  const loanTermMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly Payment formula : P* (r (1+r)^n )/ ((1+r)^ n -1)

  const monthlyInterestRate = interestRate / 12;
  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  monthlyPaymmentElement.textContent = `$${monthlyPayment.toFixed(2)}`;
};

const updateTotalPrice = () => {
  // Reset the current price to base price
  currentPrice = basePrice;

  // Performance wheels
  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }

  // Performance package option
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }

  // Full self-driving option
  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  // Accessory checkboxes
  accessoryCheckboxes.forEach((checkbox) => {
    // Extract the accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();
    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    // Add current price if accessory is selected
    if (checkbox.checked) {
      // Fixed typo "checkbox.checkbox" -> "checkbox.checked"
      currentPrice += accessoryPrice;
    }
  });

  // Update the total price in UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

  updatePaymenetBreakdown();
};

function handleScroll() {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
}

// Image mapping
const exteriorImages = {
  "Stealth Gray": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  "Quick Silver": "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

// Handle Color Selection
function handleColorButtonClick(event) {
  let button;

  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }
  if (!button) return;

  const section = event.currentTarget;
  const buttons = section.querySelectorAll("button");

  buttons.forEach((btn) => btn.classList.remove("btn-selected"));
  button.classList.add("btn-selected");

  const color = button.querySelector("img").alt; // Changed variable name to avoid conflict

  if (section === exteriorColorSection) {
    selectedColor = color; // Update the selectedColor variable
    updateExteriorImage();
  } else if (section === interiorColorSection) {
    interiorImage.src = interiorImages[color];
  }
}

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";

  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Gray";
  let imagePath = exteriorImages[colorKey]; // Fixed syntax (using [] instead of ())

  // Replace the extension if needed
  if (performanceSuffix) {
    imagePath = imagePath.replace(".jpg", `${performanceSuffix}.jpg`);
  }

  exteriorImage.src = imagePath;
};

function handleWheelButtonClick(event) {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => {
      btn.classList.remove("bg-gray-700", "text-white");
    });

    event.target.classList.add("bg-gray-700", "text-white");

    const selectedWheel = event.target.textContent.includes("Performance");
    selectedOptions["Performance Wheels"] = selectedWheel;

    updateExteriorImage();
    updateTotalPrice();
  }
}

function handlePerformanceButtonClick() {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");

  // Update selected options
  selectedOptions["Performance Package"] = isSelected;
  updateTotalPrice();
}

// Full self-driving selection
const fullSelfDrivingChange = () => {
  const isSelected = fullSelfDrivingCheckbox.checked;
  selectedOptions["Full Self-Driving"] = isSelected;
  updateTotalPrice();
};

// Handle accessory checkbox listeners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateTotalPrice();
  });
});

// update paymenet breakdown base on current price
updateTotalPrice();

// Event Listeners
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("change", fullSelfDrivingChange);
