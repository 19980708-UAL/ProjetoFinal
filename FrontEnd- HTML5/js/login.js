// Abre a modal com o formulário de login
function loginForm() {
    (async () => {
        const { value: formLogin } = await Swal.fire({
            title: "Login",
            showCancelButton: true,
            confirmButtonText: "Login",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            allowOutsideClick: true,
            allowEnterKey: true,
            customClass: {
                confirmButton: 'loginButton',
                cancelButton: 'loginButton'
            },
            html:
                ' <form id="loginForm" >' +
                '<div class="imgcontainer">' +
                '<span onclick="document.getElementById(' + "'" + 'id01' + "'" + ').style.display=' + "'" + 'none' + "'" + '" class="close"' +
                'title="Close Modal">&times;</span>' +
                '<img src="./Images/covid.png" alt="Avatar" class="avatar"></div>' +
                '<div class="container">' +
                '<label for="uname"><b>Username</b></label>' +
                '<input type="text" placeholder="Enter Username" name="uname" id="uname" required>' +
                '<label for="psw"><b>Password</b></label>' +
                '<input type="password" placeholder="Enter Password" name="psw" id="psw" required>' +
                '</div>',
            footer:
                '<span class="psw">Forgot <a href="#">password?</a></span>',
            preConfirm: () => {
                var error_msg = "";
                if (!document.getElementById("uname").value) {
                    error_msg += "Username must have value.<br>";
                }
                if (!document.getElementById("psw").value) {
                    error_msg += "Password must have value.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
                return [
                    document.getElementById("uname").value,
                    document.getElementById("psw").value,
                ];
            },
        });
        // se não tem erros no preenchimento chama o serviço de validação
        if (formLogin) {
            console.log(formLogin[0] + "-" + formLogin[1]);
             $.ajax({
                    url: "http://213.30.2.186:22228/KOFKOF/webresources/users/login/" + formLogin[0] + "/" + formLogin[1],
                    type: "GET",
                    cache: false,
                    success: function (response) {
                        isOk = response;
                        if (isOk) {
                            document.cookie = "userId="+isOk;
                            Swal.fire({
                                icon: "success",
                                title: "Login sucess!",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(function() {
                                window.location = "welcome.html";
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "User or password is wrong!",
                                showConfirmButton: true,
                            });
                        }
                    },
                });
           
        }
    })();
}