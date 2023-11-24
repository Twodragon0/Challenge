function timeout(callback, repeat) {
  if (repeat) {
    setTimeout(() => {
        callback();
        timeout(callback, repeat - 1);
    }, 300)
  }
}

function next() {
    const totalPage = +document.querySelector('iframe').contentDocument.querySelector('#total-page').textContent;
    timeout(() => {
        document.querySelector('iframe').contentDocument.querySelector('#next').click();
    }, totalPage);
    totalTime = 3600 + Math.floor(Math.random() * 1800); 
}

next();
