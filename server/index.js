const cv   = require('opencv');
const http = require('http');
const fs   = require('fs');
const formidable = require('formidable');
const merge = require('merge');

const DOMAIN = '127.0.0.1';
const PORT = 8126;

http.createServer(function(req, res) {
  var cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST'
  };
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      res.writeHead(200, merge({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-cache',
      }, cors));
      getImage(files['image']).then(function(data){
        fs.readFile(data, function(err, data){
          if(err) throw err;
          res.end('data:image/jpeg;base64,' + new Buffer(data).toString('base64'));
        });
      });
    });
  }
}).listen(PORT, DOMAIN);

console.log('Server running on port ' + PORT);

var getImage = function(image){
  return new Promise(function(resolve, reject){
    cv.readImage(image['path'], function(err, img){  
      if (err) {
        return reject(err);
      }

      var out = './img/new_image.jpg';

      const width  = img.width();
      const height = img.height();

      if (width < 1 || height < 1) {
        return reject(new Error('Image has no size'));
      }

      //img.convertGrayscale();

      img.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
        for (var i=0;i<faces.length; i++){
          var face = faces[i]
          img.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2, [0, 0, 255], 10);
        }
        img.save(out);
        return resolve(out);
      });

      /*var lower_threshold = [46, 57, 83];
      var upper_threshold = [80, 96, 115];
      img.inRange(lower_threshold, upper_threshold);*/

      /*
      const WHITE = [255, 255, 255];
      var contours = img.findContours();
      var largestContourImg;
      var largestArea = 0;
      var largestAreaIndex;

      for (var i = 0; i < contours.size(); i++) {
        if (contours.area(i) > largestArea) {
          largestArea = contours.area(i);
          largestAreaIndex = i;
        }
      }

      largestContourImg.drawContour(contours, largestAreaIndex, GREEN, thickness, lineType);
      */

      /*
      var mat = new cv.Matrix.Eye(128,128);
      for(var i = 0; i < 128; i++){
        for(var j = 0; j < 128; j++){
          mat.set(i,j, i < j ? [255,255,255] : [0,0,0]);
        }
      }
      console.log(mat.row(64));
      mat.save(out);
      */

      //img.save(out);
      //return resolve(out);
    });
  });
}
