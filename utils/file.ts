import Resizer from 'react-image-file-resizer';
function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  callback: (value: any) => void
) {
  Resizer.imageFileResizer(
    file,
    maxWidth,
    maxHeight,
    'PNG',
    100,
    0,
    (value) => {
      callback(value);
    },
    'file'
  );
}

export default {
  resizeImage,
};
