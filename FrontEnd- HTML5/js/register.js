// Função que devolve o valor da cookie 
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// função de criação de um novo utilizador
function adduser(v_id) {
    var errForm = "";
    // validação do preenchimento dos campos
    if (document.getElementById("user").value == "") {
        errForm += "User must have value.<br>";
    }
    if (document.getElementById("name").value == "") {
        errForm += "Name must have value.<br>";
    }
    if (document.getElementById("password").value == "") {
        errForm += "Password must have value.<br>";
    }
    if (document.getElementById("rpassword").value == "") {
        errForm += "Repeat password must have value.<br>";
    } else {

        if (document.getElementById("rpassword").value != document.getElementById("password").value) {
            errForm += "Passwords must be equal.<br>";
        }
    }
    if (document.getElementById("email").value == "") {
        errForm += "Email must have value.<br>";
    }

    if (document.getElementById("years").value == "") {
        errForm += "Year of Birth must have value.<br>";
    }
    if (document.getElementById("country").value == "") {
        errForm += "Country must have value.<br>";
    }
    if (errForm != "") {
        Swal.fire({
            icon: "error",
            title: errForm,
            showConfirmButton: false,
            timer: 4500,
        });

    } else {
        //Se não houver erro no preenchimento então chama o serviço de registo
        var objUser = {
            usr_user: document.getElementById("user").value,
            usr_name: document.getElementById("name").value,
            usr_password: document.getElementById("password").value,
            usr_email: document.getElementById("email").value,
            usr_age: document.getElementById("years").value,
            usr_country: document.getElementById("country").value
        };
        var exit = "no";
        var json = JSON.stringify(objUser);
        
        $.ajax({
            url: "http://213.30.2.186:22228/KOFKOF/webresources/users/create",
            type: "POST",
            data: json,
            dataType: "json",
            success: function (result) {
                document.cookie = "userId=" + result;
                Swal.fire({
                    icon: "success",
                    title: "Registed",
                    showConfirmButton: false,
                    timer: 1500,
                }).then(function () {
                    window.location = "welcome.html";
                });

            },
            error: function (err) {
                exit = err;
            }
        });
    }
}

// devolve todo os Paises existentes em base de dados
function getcontry() {

    //   (async () => {
    //       await 
    $.ajax({
        url: "http://213.30.2.186:22228/KOFKOF/webresources/country/all",
        type: "GET",
        success: function (data) {
            select = document.getElementById('country');
            data = data;
            for (i in data) {
                var opt = document.createElement('option')
                opt.value = data[i].CNT_ID;
                opt.innerHTML = data[i].CNT_DESC;
                select.appendChild(opt);
            }
        }
    }).c
    //})();

}

// devolve todo os Anos de Nascimento existentes em base de dados
function getyear() {

    (async () => {
        await $.ajax({
            url: "http://213.30.2.186:22228/KOFKOF/webresources/age/all",
            type: "GET",
            success: function (data) {
                select = document.getElementById('years');
                data = data;
                for (i in data) {
                    var opt = document.createElement('option')
                    opt.value = data[i].AGE_ID;
                    opt.innerHTML = data[i].AGE_YEAR;
                    select.appendChild(opt);
                }
            }
        })
    })();

}
