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
  let row_counter =0;
  for (let row of CSV.parse(reader.result)) {
      if (row_counter>10) break;
      row_counter+=1;
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
                td.innerHTML = '<span>'+col+'<span><br>' + '<input class= "inputCheckbox" type="checkbox" value = '+col
                +' /> input<br>' +
                '<div class="form-check"> <input type="radio" class="form-check-input" name="output" value='+col+
                ' checked> <label class="form-check-label" for="radio1">output</label> </div>'
//                 '<input class = "outputCheckbox; form-check-input" type="radio" value = '+col+' /> output';
                td.style.background = '#FF0000'
            }
            else
                td.innerHTML = 'index';
                td.style.background = '#FF0000'
        }
    }
    if (header == false){
        let td = tr.insertCell();
        td.innerHTML = '<div class="form-check"> <input type="radio" class="form-check-input" name="type" value="1"'
                +'checked> <label class="form-check-label" for="radio1">Regression</label> </div><br>'
                +'<div class="form-check"> <input type="radio" class="form-check-input" name="type" value= "0"'
                +'checked> <label class="form-check-label" for="radio1">Classification</label> </div>';
        td.style.background = '#FF0000'
    }else{
     let td = tr.insertCell();
        td.innerHTML =''
    }
    header = true;
  }
  confirm.innerHTML = '<button  type="button" onclick= "sendTrainRequest()" class="btn btn-dark">Confirm & Train</button>'
};

function sendTrainRequest(){
    var input = getInput();
    console.log(input);
    var output = getOption('output');
    console.log(output);
    var type = getOption('type');
    console.log(picker.files[0])

    var fd = new FormData();

    fd.append("file", picker.files[0]);
    fd.append("input", input);
    fd.append("output", output);
    fd.append("type", type);
    $.ajax({
        url: '/training',
        method: "POST",
        contentType: false,
        processData: false,
        data:fd,
         success: function(response){
            if (response != 0){
                console.log(response)
                localStorage.setItem("response", response);
                localStorage.setItem("input", input);
                localStorage.setItem("output", output);
                localStorage.setItem("type", type);
                window.location.pathname = "static/templates/result.html";

            }else{
                alert('An error occurred');
             }
         }

    });
}


function getOption(name){
    var outputValue = null;
    var outputElements = document.getElementsByName(name);
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

