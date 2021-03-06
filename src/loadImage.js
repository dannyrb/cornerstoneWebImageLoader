import * as cornerstone from 'cornerstone-core';
import arrayBufferToImage from './arrayBufferToImage';
import createImage from './createImage';

//
// This is a cornerstone image loader for web images such as PNG and JPEG
//
let options = {
  // callback allowing customization of the xhr (e.g. adding custom auth headers, cors, etc)
  beforeSend (/* xhr */) {}
};


// Loads an image given a url to an image
export function loadImage (imageId) {
  const deferred = $.Deferred();

  const xhr = new XMLHttpRequest();

  xhr.open('GET', imageId, true);
  xhr.responseType = 'arraybuffer';
  options.beforeSend(xhr);

  xhr.onload = function () {
    const imagePromise = arrayBufferToImage(this.response);

    imagePromise.then(function (image) {
      const imageObject = createImage(image, imageId);

      deferred.resolve(imageObject);
    }, function (error) {
      deferred.reject(error);
    });
  };
  xhr.onprogress = function (oProgress) {

    if (oProgress.lengthComputable) {  // evt.loaded the bytes browser receive
        // evt.total the total bytes seted by the header
        //
      const loaded = oProgress.loaded;
      const total = oProgress.total;
      const percentComplete = Math.round((loaded / total) * 100);

      $(cornerstone.events).trigger('CornerstoneImageLoadProgress', {
        imageId,
        loaded,
        total,
        percentComplete
      });
    }
  };
  xhr.send();

  return deferred;
}

export function configure (opts) {
  options = opts;
}
