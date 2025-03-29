// Function to handle the Fractional Knapsack logic
function fractionalKnapsack(cargoItems, capacity) {
    // Sort items by value-to-weight ratio (adjusted for additional factors)
    cargoItems.sort((a, b) => b.ratio - a.ratio);
  
    let totalValue = 0;
    let totalWeight = 0;
    const selectedItems = [];
  
    for (let i = 0; i < cargoItems.length && capacity > 0; i++) {
      const item = cargoItems[i];
      if (item.weight <= capacity) {
        // Take the whole item
        totalValue += item.value;
        totalWeight += item.weight;
        selectedItems.push({ name: item.name, weight: item.weight, fraction: 1.0 });
        capacity -= item.weight;
      } else {
        // Take a fraction of the item
        const fraction = capacity / item.weight;
        totalValue += item.value * fraction;
        totalWeight += item.weight * fraction;
        selectedItems.push({ name: item.name, weight: capacity, fraction });
        capacity = 0;
      }
    }
  
    return { selectedItems, totalWeight, totalValue };
  }
  
  // Function to calculate adjusted value considering priority, time sensitivity, and temperature sensitivity
  function calculateAdjustedValue(value, priority, timeSensitive, temperatureSensitive) {
    return value + (priority * 10) + (timeSensitive * 5) + (temperatureSensitive * 5); // Higher priority value
  }
  
  // Function to calculate the cargo load based on user input
  function calculateCargoLoad(items, capacity) {
    // Adjust values for each item based on priority, time sensitivity, and temperature sensitivity
    const adjustedItems = items.map(item => {
      const adjustedValue = calculateAdjustedValue(item.value, item.priority, item.timeSensitive, item.temperatureSensitive);
      return {
        name: item.name,
        weight: item.weight,
        value: adjustedValue,
        priority: item.priority,
        timeSensitive: item.timeSensitive,
        temperatureSensitive: item.temperatureSensitive,
        ratio: adjustedValue / item.weight // Adjusted value-to-weight ratio
      };
    });
  
    // Call the Fractional Knapsack function with adjusted items
    return fractionalKnapsack(adjustedItems, capacity);
  }
  
  // DOM Manipulation and Form Handling
  document.getElementById("cargoForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    // Get the number of items and capacity
    const numItems = parseInt(document.getElementById("numItems").value, 10);
    const capacity = parseFloat(document.getElementById("capacity").value);
  
    // Collect item details
    const cargoItems = [];
    for (let i = 0; i < numItems; i++) {
      const name = document.getElementById(`name${i}`).value;
      const weight = parseFloat(document.getElementById(`weight${i}`).value);
      const value = parseFloat(document.getElementById(`value${i}`).value);
      const priority = parseFloat(document.getElementById(`priority${i}`).value);
      const timeSensitive = parseFloat(document.getElementById(`timeSensitive${i}`).value);
      const temperatureSensitive = parseFloat(document.getElementById(`temperatureSensitive${i}`).value);
      cargoItems.push({
        name,
        weight,
        value,
        priority,
        timeSensitive,
        temperatureSensitive
      });
    }
  
    // Call the Fractional Knapsack function with adjusted items
    const result = calculateCargoLoad(cargoItems, capacity);
  
    // Display the results
    const resultsDiv = document.getElementById("results");
    const resultItemsDiv = document.getElementById("resultItems");
    const totalsDiv = document.getElementById("totals");
    resultsDiv.style.display = "block";
    resultItemsDiv.innerHTML = "";
    totalsDiv.innerHTML = "";
  
    result.selectedItems.forEach((item) => {
      resultItemsDiv.innerHTML += 
        `<div class="result-item">
          Name: ${item.name}, Weight: ${item.weight.toFixed(2)}, Fraction Loaded: ${item.fraction.toFixed(2)}
        </div>`;
    });
  
    totalsDiv.innerHTML = 
      `<p><strong>Total Weight Loaded:</strong> ${result.totalWeight.toFixed(2)}</p>
      <p><strong>Total Value Loaded:</strong> ${result.totalValue.toFixed(2)}</p>`;
  });
  
  // Dynamically generate input fields for items
  document.getElementById("numItems").addEventListener("change", function () {
    const numItems = parseInt(this.value, 10);
    const itemInputsDiv = document.getElementById("itemInputs");
    itemInputsDiv.innerHTML = "";
  
    for (let i = 0; i < numItems; i++) {
      itemInputsDiv.innerHTML += 
        `<h4>Item ${i + 1}</h4>
        <label for="name${i}">Item Name:</label>
        <input type="text" id="name${i}" required>
        <label for="weight${i}">Weight:</label>
        <input type="number" id="weight${i}" step="0.01" required>
        <label for="value${i}">Value:</label>
        <input type="number" id="value${i}" step="0.01" required>
        <label for="priority${i}">Priority (0-1):</label>
        <input type="number" id="priority${i}" step="0.01" required>
        <label for="timeSensitive${i}">Time Sensitive (0-1):</label>
        <input type="number" id="timeSensitive${i}" step="0.01" required>
        <label for="temperatureSensitive${i}">Temperature Sensitive (0-1):</label>
        <input type="number" id="temperatureSensitive${i}" step="0.01" required>`;
    }
  });
  