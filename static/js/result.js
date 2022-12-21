let resultTable = document.getElementById("resultTable");

function buildTable(){
    response = JSON.parse(localStorage.getItem("response"));
    console.log(response);
    resultTable.innerHTML = "";
    setHeaders();
    for (let row of response[0]) {
        let tr = resultTable.insertRow();
        for (let col of row) {
            let td = tr.insertCell();
            td.innerHTML = col;
        }
        let td = tr.insertCell();
        td.style="text-align: center"
        td.innerHTML = ' <button  type="button" onclick= "" class="btn btn-dark" id ='+row[0]+'>select</button>';

    }
}

function setHeaders(){
    let tr = resultTable.insertRow();
    labels = ['Algorithm','Accuracy','Standard Deviation','Select Algorithm']
    for (let col of labels) {
        let td = tr.insertCell();
        td.innerHTML = col;
        td.style="text-align: center"
        td.style.background = '#FF0000'
    }

}

buildTable();
