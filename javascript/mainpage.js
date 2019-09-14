
file =[];         //global variable for files
window.onload = function () {
    let csvData;
    console.log("This shouldn't be causing an issue");
    //file input //
    let fileone = document.getElementById("fileone");
    let filetwo = document.getElementById("filetwo");

    //file img 
    var img1 = document.getElementById("fileimg1");
    var img2 = document.getElementById("fileimg2");

    //input elements
    const inpElementA = document.getElementById("fileA");
    const inpElementB = document.getElementById("fileB");

    inpElementA.addEventListener('change', function () {
        showfiles("fileimg1", inpElementA.files[0].name, inpElementA.files[0]);
    });

    inpElementB.addEventListener('change', function () {
        showfiles("fileimg2", inpElementB.files[0].name, inpElementB.files[0]);
    });

    //First file hidden input connected to the div area
    fileone.onclick = function () {
        alert("This kinda should work");
        document.getElementById("fileA").click();
    }


    //second file hidden input connected to the div area
    filetwo.onclick = () => {
        alert("Please alert2");
        document.getElementById("fileB").click();

    }
}

    // fileinput finish
    $.ajax(
        {
            url: "API.php",
            type: "GET",
            success: function (data, textStatus, response) {
                alert("success in function call");
                console.log(response.responseText);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("unsuccessful");
            }
        });




    const dragOverHandler = (event) => { event.preventDefault(); }
    /**
     * Drop handler
     * @param {*} ev
     */
    function dropHandler(ev, field) {
        console.log("File Dropped");
        ev.preventDefault();

        if (ev.dataTransfer.items.length == 1) {
            alert("working");

            if (ev.dataTransfer.items[0].kind === 'file') {
                console.log(ev.dataTransfer.files[0].name);
                showfiles(field, ev.dataTransfer.files[0].name, ev.dataTransfer.files[0]);
            }

        }
        else {
            console.log("Multiple files detected");
        }
    }

    //display files in the webpage as icons
    function showfiles(idName, filename, fyl) {
        document.getElementById(idName).style.display = "block";
        document.getElementById(idName + "2").innerHTML = filename;
        file.push(fyl);
    }






function About() {
    document.getElementById("About").style.display = "block";
}

function Help() {
    document.getElementById("Help").style.display = "block";
}

function Import()
{
    document.getElementById("Import").style.display ="block";
}

//function for login form 
var login_modal = () =>{document.getElementById("Login").style.display ="block"};



let submit_file =(ev)=> {
    ev.preventDefault();
    const formData = new FormData();

    //create a form data to send the array of files
    for(let val=0;val<file.length;val++)
    {
        formData.append('file'+val,file[val]);
    }
    
    var reader = new FileReader();
    reader.onload =(evt) =>{
        console.log(evt.target.result);     
    }
   let logfile =reader.readAsText(file[0]);
   //validation required


    //post into the server
    $.ajax(
        {
            url : "server/test.php",
            type: "POST",
            data : formData,
            processData:false,
            contentType:false,
            success:function(data, textStatus, response)
            {
                alert("success in function call");
                console.log(response)
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                alert("unsuccessful");
            }
        });
}