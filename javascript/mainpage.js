import CallAlert from './CallAlert.js';
// global variable for files
const file = [];

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


function submitFile(ev) {
  ev.preventDefault();
  const formData = new FormData();

  // create a form data to send the array of files
  for (let val = 0; val < file.length; val += 1) {
    formData.append(`file${val}`, file[val]);
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    console.log(evt.target.result);
  };

  const logfile = reader.readAsText(file[0]);
  // TODO validation required


  // post into the server
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
        console.log(response);
        CallAlert.preview();
      },
      // eslint-disable-next-line no-unused-vars
      error: (jqXHR, textStatus, error) => {
        CallAlert.danger(error);
      },
    },
  );
}
