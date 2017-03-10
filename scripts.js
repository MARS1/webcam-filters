//  grab all elements on the page including setting the context to 2d for the HTML5 canvas element
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//  First function is to get the video working
function getVideo() {
  // how to access someones media devices
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
    // console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
    })
    .catch(err => {
      console.log('OH NO!!!', err);
    })
}

// Second function is to paint whatever the video captures on to the canvas
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  // set return in case  you later have to stop the interval
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //  take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);

    //  mess with them
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;

    pixels = greenScreen(pixels);

    //  put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

// Third function that takes a photo of what's on the canvas
function takePhoto() {
  //  play the sound
  snap.currenTime = 0;
  snap.play();
  //  take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  // creating a link element
  const link = document.createElement('a');
  // giving href value the base64 code
  link.href = data;
  // setting link attribute to 'download' (the first agrument), and giving download the value of 'handsome' (second argument)
  link.setAttribute('download', 'handsome');
  //  create the name for the link
  // link.textContent = 'Download Image';
  // Or add a thumbnail  to the page
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`

  strip.insertBefore(link, strip.firstChild);

  console.log(data);

}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 550] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });

    // console.log(levels);

    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];

      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out
        pixels.data[i + 3] =0;
      }
    }

    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
