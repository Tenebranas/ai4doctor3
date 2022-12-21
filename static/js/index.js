// (A) FILE READER + HTML ELEMENTS
let reader = new FileReader(),
    picker = document.getElementById("demoPick"),
    table = document.getElementById("demoTable")
    confirm = document.getElementById("confirmedButton");

// (B) READ CSV ON FILE PICK
picker.onchange = () => reader.readAsText(picker.files[0]);


// (C) READ CSV & GENERATE TABLE
reader.onloadend = () => {
  table.innerHTML = "";
  let header = false;
  for (let row of CSV.parse(reader.result)) {
    let tr = table.insertRow();
//    console.log(header);
//    console.log(row);
    for (let col of row) {
        let td = tr.insertCell();
        if (header != false){ //
            td.innerHTML = col;
        }
        else{
            if(col != null){
                td.innerHTML = '<span>'+col+'<span><br>' + '<input class= "inputCheckbox" type="checkbox" value = '+col+' /> input<br>' +
                 '<input class = "outputCheckbox" type="checkbox" value = '+col+' /> output';
                td.style.background = '#FF0000'
            }
            else
                td.innerHTML = 'index';
                td.style.background = '#FF0000'
        }
    }
    header = true;
  }
  confirm.innerHTML = '<button  type="button" onclick= "sendTrainRequest()" class="btn btn-dark">Confirm & Train</button>'
};

function sendTrainRequest(){
    var input = getInput();
    console.log(input);
    var output = getOutput();
    console.log(output);
    console.log(picker.files[0])

    var fd = new FormData();

    fd.append("file", picker.files[0]);
    fd.append("input", input);
    fd.append("output", output);
    $.ajax({
        url: '/training',
        method: "POST",
        contentType: false,
        processData: false,
        data:fd,
         success: function(response){
            if (response != 0){
                console.log(response)
                window.location.pathname = "static/templates/result.html";
                localStorage.setItem("response", response);
            }else{
                alert('An error occurred');
             }
         }

    });
}


function getOutput(){
    var outputValue = null;
    var outputElements = document.getElementsByClassName('outputCheckbox');
    console.log(outputElements)
    for(var i=0; outputElements[i]; ++i){
          if(outputElements[i].checked){
               outputValue = outputElements[i].value;
               break;
          }
    }
    return outputValue
}

function getInput(){
    var inputValue = [];
    var inputElements = document.getElementsByClassName('inputCheckbox');
    for(var i=0; inputElements[i]; ++i){
          if(inputElements[i].checked){
               inputValue.push(inputElements[i].value);
          }

    }
    return inputValue;
}
