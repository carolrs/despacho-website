(function () {
    'use strict';

    var submitButton = document.querySelector("#submit-button");

    submitButton.addEventListener("click", submitForm);

    function submitForm() {
        let form = document.querySelector("#frm-sub");
        if (formValidator(form)) {
            form.scrollIntoView()
            return;
        }

        if (checkFileSize()) {
            return;
        }

        let object = {};
        let formData = document.querySelector("#frm-sub")
        let inputName = formData.querySelector("#inputName");
        let inputEmpresa = formData.querySelector("#inputEmpresa");
        let inputEmail = formData.querySelector("#inputEmail");
        let inputPhone = formData.querySelector("#inputPhone");
        let inputAddress = formData.querySelector("#inputAddress");
        let inputAddress2 = formData.querySelector("#inputAddress2");
        let inputCity = formData.querySelector("#inputCity");
        let inputState = formData.querySelector("#inputState");
        let inputZip = formData.querySelector("#inputZip");
        let inputDetalhes = formData.querySelector("#inputDetalhes");
        let fileMultiple = formData.querySelector("#fileMultiple");

        object[inputName.id] = inputName.value;
        object[inputEmpresa.id] = inputEmpresa.value;
        object[inputEmail.id] = inputEmail.value;
        object[inputPhone.id] = inputPhone.value;
        object[inputAddress.id] = inputAddress.value;
        object[inputAddress2.id] = inputAddress2.value;
        object[inputCity.id] = inputCity.value;
        object[inputState.id] = inputState.value;
        object[inputZip.id] = inputZip.value;
        object[inputDetalhes.id] = inputDetalhes.value;

        const data = new FormData()
        data.append('data', JSON.stringify(object))

       const fileArray = Array.from(fileMultiple.files)

       fileArray.forEach(file => data.append('files', file, file.name))

        let json = object;

        let dataReceived;

        fetch("https://despachante-mailer.onrender.com", {
            method: "post",
            mode: 'cors',
            body: data
        })
            .then(resp => {
                if (resp.status === 200) {
                    return resp.json()
                } else {
                    console.log("Status: " + resp.status)
                    return Promise.reject("server")
                }
            })
            .then(dataJson => {
                dataReceived = JSON.parse(dataJson)
                console.log(`Received: ${dataReceived}`)
            })
            .catch(err => {
                if (err === "server") return
                console.log(err)
            })

    }

    function formValidator(form) {
        let isNotValid = Array.from(form.querySelectorAll("input[required]")).some(n => n.value == '')
        if (isNotValid) {
            form.classList.add('was-validated');
            return true
        } else {
            form.classList.remove('was-validated');
            return false
        }
    }

    function checkFileSize() {
        let fileMultiple = document.querySelector("#fileMultiple");
        if (typeof (fileMultiple.files) != "undefined") {

            let filesSize = Array.from(fileMultiple.files)
                .map(file => file.size)
                .reduce((acc, fileSize) => acc + (fileSize / 1024 / 1024),0)

            if (filesSize >= 10) {
                alert("A soma dos arquivos nao pode ultrapassar 10MB")
                return true
            }
            return false;
        } else {
            alert("This browser does not support HTML5.")
            return true
        }
    }

})();