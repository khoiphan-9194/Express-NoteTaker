//This is for creating data in this application in case of no data exist
//this will check if a filepath wheather exists, if not it will create a file with initial value =[]
//if the file exists, it will check wheather or not the file has the content
const path = require('path');
const fs = require('fs');
function isFileExist (filepath)
{

  try {
    if (fs.existsSync(filepath)) {
      //file exists
      fs.readFile(filepath, function (err, data) {
        if (err) throw err;
        if(data.length==0){
         fs.writeFile(filepath, '[]', err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${filepath.substring(5)} was written sucessfully.`)
        }
          });
      
        }
      });
    }
    else{
      fs.writeFile(filepath, '[]', err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${filepath.substring(5)} was written sucessfully.`)
        }
          });
    }


  } catch(err) {
    console.error(err)
  }

}


module.exports ={isFileExist};