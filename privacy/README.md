
# Privacy Protection Education Automation Script

Automate the completion of Privacy Protection Education by navigating through paginated content and interacting with necessary buttons on the website. This script streamlines the process, allowing users to efficiently complete their training without manual intervention.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Script Explanation](#script-explanation)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

Completing Privacy Protection Education can be time-consuming due to repetitive page navigation and button clicks. This automation script simplifies the process by automatically navigating through each page and interacting with required elements, ensuring a swift and efficient completion of the training.

## Features

- **Automated Page Navigation**: Automatically clicks the "Next Page" button to navigate through paginated content.
- **Force Activation of Disabled Buttons**: Activates the "Next Page" button even when it is disabled.
- **Logging**: Provides console logs to monitor the current page, attempt counts, and actions being performed.
- **Error Handling**: Detects and logs errors when essential elements are not found.
- **Loop Prevention**: Implements a maximum attempt limit to prevent infinite loops.

## Prerequisites

- **Web Browser**: Google Chrome, Mozilla Firefox, or any modern browser with developer tools.
- **Basic Knowledge**: Familiarity with browser developer tools (Console).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Twodragon0/Challenge.git
   ```

2. **Navigate to the Script Directory**

   ```bash
   cd Challenge/privacy
   ```

## Usage

### Step 1: Open the Privacy Protection Education Website

Navigate to the [Privacy Protection Education](https://edu.privacy.go.kr/user/study/lectureView.do) website in your preferred web browser.

### Step 2: Access Developer Tools

- **Chrome**: Press `F12` or `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac).
- **Firefox**: Press `F12` or `Ctrl + Shift + K` (Windows) / `Cmd + Option + K` (Mac).

### Step 3: Allow Pasting Scripts

When prompted with the warning:

```
Warning: Don’t paste code into the DevTools Console that you don’t understand or haven’t reviewed yourself. This could allow attackers to steal your identity or take control of your computer. Please type ‘allow pasting’ below and hit Enter to allow pasting.
```

Type `allow pasting` and press `Enter`.

### Step 4: Execute the Script

You can execute the script in two ways:

#### Option 1: **Direct Execution**

Copy and paste the following script into the console and press `Enter`:

```javascript
(async () => {
    // Function to set delay (in milliseconds)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Recursively search all frames to find an element by ID.
     * @param {string} id - The ID of the element to find.
     * @param {Window} currentWindow - The current window object.
     * @returns {HTMLElement|null} - The found element or null.
     */
    const findElementRecursively = (id, currentWindow = window) => {
        try {
            const el = currentWindow.document.getElementById(id);
            if (el) return el;
            for (let i = 0; i < currentWindow.frames.length; i++) {
                const found = findElementRecursively(id, currentWindow.frames[i]);
                if (found) return found;
            }
        } catch (e) {
            // Ignore frames from different domains.
        }
        return null;
    };

    /**
     * Wait for an element with the specified ID to appear.
     * @param {string} id - The ID of the element to wait for.
     * @param {number} timeout - The maximum time to wait (in milliseconds).
     * @returns {Promise<HTMLElement>} - The found element.
     */
    const waitForElement = async (id, timeout = 10000) => {
        const interval = 500;
        let elapsed = 0;
        while (elapsed < timeout) {
            const el = findElementRecursively(id);
            if (el) return el;
            await sleep(interval);
            elapsed += interval;
        }
        throw new Error(`Element with id "${id}" not found within ${timeout}ms`);
    };

    try {
        console.log('Searching for cPage and tPage elements...');
        // Wait for 'cPage' and 'tPage' elements
        const cPageElement = await waitForElement('cPage');
        const tPageElement = await waitForElement('tPage');

        /**
         * Get the current page number.
         * @returns {number}
         */
        const getCurrentPage = () => Number(cPageElement.innerText.trim());

        /**
         * Get the last page number.
         * @returns {number}
         */
        const getLastPage = () => Number(tPageElement.innerText.trim());

        let currentPage = getCurrentPage();
        const lastPage = getLastPage();

        console.log(`Starting at page: ${currentPage} / Last page: ${lastPage}`);

        // Set maximum attempts to prevent infinite loops
        const maxAttempts = lastPage - currentPage + 10; // Add buffer
        let attempts = 0;

        // Loop through all pages
        while (currentPage < lastPage && attempts < maxAttempts) {
            attempts += 1;
            console.log(`\n[Attempt ${attempts}] Current page: ${currentPage} / Last page: ${lastPage}`);

            // Find 'nextBtn' element
            const nextBtn = findElementRecursively('nextBtn');

            if (!nextBtn) {
                console.error('Next Page button (nextBtn) not found.');
                break;
            }

            // Force activate the "Next Page" button if disabled
            if (nextBtn.disabled || nextBtn.style.pointerEvents === 'none' || parseFloat(nextBtn.style.opacity) < 1) {
                console.log('Next Page button is disabled. Activating it...');
                nextBtn.disabled = false; // Remove 'disabled' attribute
                nextBtn.style.pointerEvents = 'auto'; // Enable pointer events
                nextBtn.style.opacity = '1'; // Set opacity to make it visible
            }

            // Click the "Next Page" button
            nextBtn.click();
            console.log(`Attempting to navigate to page ${currentPage + 1}...`);

            // Wait for the page to load
            await sleep(3000); // Wait 3 seconds (adjust as needed)

            // Check if the page has changed
            const newPage = getCurrentPage();
            if (newPage === currentPage) {
                console.warn('Page did not change as expected. Retrying...');
                continue; // Retry
            } else {
                currentPage = newPage;
                console.log(`Successfully navigated to page ${currentPage}.`);
            }
        }

        if (attempts >= maxAttempts) {
            console.warn('Maximum attempt limit reached. Stopping the script.');
        }

        // Click the finish button on the last page
        if (currentPage >= lastPage) {
            const finishButton = findElementRecursively('finishBtn') || document.querySelector('.btnm.btnCyan.radius4');
            if (finishButton) {
                finishButton.click();
                console.log('All pages completed successfully.');
            } else {
                console.warn('Finish button not found.');
            }
        } else {
            console.warn('Did not complete all pages.');
        }

    } catch (error) {
        console.error('An error occurred during script execution:', error);
    }
})();
```

#### Option 2: **Using the Hosted Script**

If you prefer to use the script hosted on GitHub, you can include it directly into your console using the following command:

```javascript
fetch('https://raw.githubusercontent.com/Twodragon0/Challenge/main/privacy/edu_privacy.js')
    .then(response => response.text())
    .then(script => eval(script))
    .catch(error => console.error('Failed to load the script:', error));
```

## Script Explanation

### Main Functionality

1. **Element Search**:
    - **`findElementRecursively`**: This function searches for an element by its ID across all frames within the current window. It recursively traverses through each frame to locate the desired element.
    - **`waitForElement`**: Waits for a specific element to appear within a given timeout period (default is 10 seconds). It repeatedly checks for the element at set intervals.

2. **Page Navigation Logic**:
    - **Current and Last Page Retrieval**: The script retrieves the current page number (`cPage`) and the last page number (`tPage`) from the DOM.
    - **Loop Through Pages**: While the current page is less than the last page and the maximum number of attempts hasn't been reached, the script:
        - Searches for the "Next Page" button (`nextBtn`).
        - If the button is disabled, it forcefully enables it by removing the `disabled` attribute and adjusting its styles.
        - Clicks the "Next Page" button to navigate to the next page.
        - Waits for 3 seconds to allow the page to load.
        - Verifies if the page number has incremented to ensure successful navigation.

3. **Completion**:
    - Once the last page is reached, the script attempts to click the finish button (`finishBtn` or `.btnm.btnCyan.radius4`) to complete the education process.

4. **Error Handling**:
    - The script logs errors if it cannot find necessary elements or if unexpected issues arise during execution.

### Logging

- The script uses `console.log`, `console.warn`, and `console.error` to provide real-time feedback on its operations, making it easier to monitor progress and troubleshoot issues.

## Customization

### Adjusting Delay

The delay between page navigations can be modified to match the loading speed of the website. By default, the script waits for 3 seconds (`3000` milliseconds) after clicking the "Next Page" button.

```javascript
await sleep(3000); // 3-second delay
```

To increase the delay to 5 seconds:

```javascript
await sleep(5000); // 5-second delay
```

### Changing Element Selectors

If the target website updates its structure or element IDs, you may need to update the selectors in the script accordingly.

```javascript
// Example: Changing the ID of the "Next Page" button
const nextBtn = findElementRecursively('newNextBtnId');
```

### Modifying Maximum Attempts

The `maxAttempts` variable prevents the script from running indefinitely. You can adjust this value based on the number of pages or your specific needs.

```javascript
const maxAttempts = lastPage - currentPage + 10; // Buffer of 10 attempts
```

## Troubleshooting

### Common Issues

1. **Elements Not Found**:
    - **Symptom**: `Element with id "cPage" not found within 10000ms`
    - **Solution**:
        - Verify that the element IDs (`cPage`, `tPage`, `nextBtn`) match those on the website.
        - Use the developer tools to inspect the elements and confirm their IDs.
        - Update the script with the correct IDs if they have changed.

2. **Script Not Executing**:
    - **Symptom**: No action occurs after executing the script.
    - **Solution**:
        - Ensure that JavaScript is enabled in your browser.
        - Check for any browser extensions that might block script execution.
        - Confirm that you have allowed pasting scripts by typing `allow pasting` when prompted.

3. **Buttons Not Clicking**:
    - **Symptom**: The "Next Page" button does not respond or the page does not change.
    - **Solution**:
        - Increase the sleep duration to allow more time for the page to load.
        - Ensure that the script is correctly force-activating the button.
        - Check if additional user interactions are required by the website.

### Debugging Tips

- **Use Console Logs**: Monitor the console for log messages to understand where the script is failing.
- **Inspect Elements**: Use the Elements tab in developer tools to verify the presence and state of target elements.
- **Adjust Delays**: Modify the `sleep` duration to better accommodate slower page loads.
- **Check Frame Structure**: Ensure that the script is searching within the correct frames if the website uses multiple frames.

## Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, please open an issue or submit a pull request.

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/YourFeature`
3. **Commit Your Changes**: `git commit -m 'Add some feature'`
4. **Push to the Branch**: `git push origin feature/YourFeature`
5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Inspired by various automation scripts and user experience enhancements.
- Thanks to the open-source community for their continuous support and contributions.
```

---

**Repository Link:** [Twodragon0/Challenge](https://github.com/Twodragon0/Challenge/blob/main/privacy/edu_privacy.js)

Feel free to customize the `README.md` further to better suit your project's needs!
