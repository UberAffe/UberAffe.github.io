function setup() {
  createCanvas(360, 240);
  pixelDensity(1);
  loadPixels();
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      var pix = (x + y * width) * 4;
      pixels[pix+0] = 51;
      pixels[pix+1] = 51;
      pixels[pix+3] = 51;
      pixels[pix+4] = 255;
    }
  }
  updatePixels();
}
