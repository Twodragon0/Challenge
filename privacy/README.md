# Infinite Scroll Automation

This script automates the process of scrolling through pages on a website with an infinite scroll using JavaScript. The specific use case here is for a website where the content is paginated, and the script scrolls through each page until reaching the last one.

## How it works

The script utilizes a simple function to simulate a delay and an asynchronous function to iterate through the pages until the last page is reached. It uses the `sleep` function and interacts with the DOM elements to navigate through the pages.

```javascript
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const main = async () => {
  const lastPage = Number(document.getElementById('contentsFrame').contentWindow.document.getElementById('frame').contentWindow.document.getElementById('tPage').innerText);

  while (true) {
    const currPage = Number(document.getElementById('contentsFrame').contentWindow.document.getElementById('frame').contentWindow.document.getElementById('cPage').innerText);

    if (currPage >= lastPage) {
      document.getElementsByClassName('btnm btnCyan radius4')[0].click();
      break;
    }

    document.getElementById('contentsFrame').contentWindow.document.getElementById('frame').contentWindow.document.getElementById('nextBtn').click();
    await sleep(1000);
  }
};

main();
