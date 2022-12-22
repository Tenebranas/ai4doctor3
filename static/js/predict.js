
//console.log(localStorage.getItem("input").split(','));

function buildForm(){
    var algorithm = localStorage.getItem("algorithm")
    var title = document.getElementById("title")
    title.innerHTML = algorithm + '- Prediction'
    var  input = localStorage.getItem("input").split(',')
    var form = document.getElementById("inputForm");

    for(var item of input){
        var FN = document.createElement("input");
        FN.setAttribute("type", "text");
        FN.setAttribute("name", item);
        FN.setAttribute("placeholder", item);
        FN.setAttribute("class","form-control")
        FN.setAttribute("id",item);

        var label = document.createElement("label");
        label.setAttribute("for",item);
        label.innerHTML = item;

         form.appendChild(label);
        // Append the full name input to the form
         form.appendChild(FN);

    }
    // create a submit button
    var s = document.createElement("button");
    s.setAttribute("type", "button");
    s.setAttribute("class", "btn btn-primary")
    s.innerHTML = 'Predict'
    s.setAttribute('onclick', 'predict()')

    var br =document.createElement("br");
    form.append(br)
    form.appendChild(s);

}
buildForm();

function predict(){
    var form = getData();
    var data = {};
    data['form']= form;
    data['output'] = localStorage.getItem("output");
    data['type'] = localStorage.getItem("type");
    data['algorithm'] = localStorage.getItem("algorithm");
    console.log(form);
    $.ajax({
        type: 'post',
        url: '/predict',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
            var result = document.getElementById('result');
            result.innerHTML = data;
        }
    });
}

function getData() {
    var elements = document.getElementById("inputForm").elements;
    var obj ={};
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        obj[item.name] = item.value;
    }
    return obj
}