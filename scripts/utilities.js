/*Loop through all elements in points #array,
execute #callback for each element*/

function forEach(array, callback) {
  for(var i = 0; i < array.length; i++) {
    callback(array[i]);
  }
}
