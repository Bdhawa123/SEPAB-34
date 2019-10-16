// import CallAlert from './CallAlert.js';
// global variable for files
const file = [];
let validation = false;

function initializeImport() {
  const fileone = document.getElementById('fileone');
  const img1 = document.getElementById('fileimg1');
  const inpElementA = document.getElementById('fileA');

  inpElementA.addEventListener('change', () => {
    showfiles('fileimg1', inpElementA.files[0].name, inpElementA.files[0]);
  });

  // First file hidden input connected to the div area
  fileone.onclick = () => {
    document.getElementById('fileA').click();
  };
}

window.onload = () => {
  // file input
  initializeImport();
};

function modalreset() {
  if (file.length === 0) {
    $('.modal-dialog').css('width', '800px');
  }
}

// display files in the webpage as icons
function showfiles(idName, filename, fyl) {
  // clear out the file array
  file.length = 0;
  document.getElementById(idName).style.display = 'flex';
  document.getElementById(`${idName}2`).innerHTML = filename;
  $('.modal-dialog').css('width', '500px');
  file.push(fyl);
}

const dragOverHandler = (event) => { event.preventDefault(); };

/**
 * Drop handler
 * @param {*} ev
 */
function dropHandler(ev, field) {
  console.log('File Dropped');
  ev.preventDefault();

  if (ev.dataTransfer.items.length === 1) {
    if (ev.dataTransfer.items[0].kind === 'file') {
      console.log(ev.dataTransfer.files[0].name);
      showfiles(field, ev.dataTransfer.files[0].name, ev.dataTransfer.files[0]);
    }
  } else {
    console.log('Multiple files detected');
  }
  ev.dataTransfer.clearData();
}

/**
 * Validation for file input sentence
 */
const input_validation = () => {
  const fileValue = $('#fileName').val();
  // eslint-disable-next-line no-useless-escape
  const cantContain = /[^\[\w+\]\.\[\w+\]$]/g;
  console.log(fileValue);
  if (fileValue === '') {
    document.querySelector('#validation-tooltip').innerHTML = 'File name cannot be empty';
  } else if (fileValue.match(cantContain) != null) {
    $('#fileName').val('');
    validation = false;
    document.querySelector('#validation-tooltip').innerHTML = 'Cannot contain illegal characters';
  } else {
    validation = true;
    $('#validation-tooltip').text('');
    $.ajax(
      {
        url: 'server/newfile.php',
        type: 'POST',
        data: { functionname: 'ifTableExists', arguments: fileValue },
        success: (data) => {
          const ifExists = JSON.parse(data);
          if (ifExists) {
            document.querySelector('#validation-tooltip').innerHTML = 'Duplicate Name found!!! Please select another name.';
          }
        },
        error: () => {
          alert('unsuccessful');
        },
      },
    );
  }
};

function submitFile(ev) {
  ev.preventDefault();
  const formData = new FormData();

  // create a form data to send the array of files
  for (let val = 0; val < file.length; val += 1) {
    formData.append(`file${val}`, file[val]);
  }
  formData.append('filename', $('#fileName').val());

  const reader = new FileReader();
  //  //client side validation
  //   var val = false;
  //   reader.readAsText(file[0]);
  //   reader.onload = (evt) => {

  //     let fileapi =(evt.target.result);
  //     console.log(typeof(fileapi));

  //     let ext = file[0].name.split(".")[1];
  //     if (["csv","xls","xlsm","xlsx",".dbf"].includes(ext)){

  //     for(var i =0;i<fileapi.length;i++ ){

  //         if (fileapi[i]=="\n"){

  //             this.val = true;
  //             console.log(val);
  //             break;
  //         }
  //     }
  //      if(this.val==true){
  //         let newstring = fileapi.substr(0,i);
  //         if(newstring.split(",").length==5){
  //             console.log("file valid");
  //             console.log(val);
  //             this.val =true;
  //         }
  //         else{
  //           console.log("file Invalid");
  //           console.log(val);
  //         }
  //      }
  //      else{
  //        console.log("file Invalid");
  //          console.log(val);
  //      }
  //     }
  //     else{
  //       console.log("file type is invalid");
  //     }
  //   };


  // TODO validation required

  input_validation();
  // post into the server
  console.log('file validation', validation);

  if (file.length !== 0 && validation) {
    console.log('File inside 1');
    console.log(formData);
    $.ajax(
      {
        url: 'server/test.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: (data, textStatus, response) => {
          console.log('success in function call');
          $('.hd_inp').val('');
          $('.fileimg').css('display', 'none');
          file.length = 0;
          console.log(response.responseText);
          // location.reload(true);
        },
        // eslint-disable-next-line no-unused-vars
        error: (jqXHR, textStatus, error) => {
          // CallAlert.danger(error);
        },
      },
    );
  } else {
    document.querySelector('#validation-tooltip').innerHTML = 'file is not inserted';
  }
}
