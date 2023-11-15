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
