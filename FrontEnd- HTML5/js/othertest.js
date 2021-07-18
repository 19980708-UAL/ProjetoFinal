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

// Chama o serviço que devolve todos os teste de um utilizador e mostra numa tabela
function getOtherTests(v_id) {
    (async () => {
        await $.ajax({
            url: "http://213.30.2.186:22228/KOFKOF/webresources/test/usr_id/" + v_id,
            type: "GET",
            success: function (data) {
                table = document.getElementById('testReport');
                data = data;
                if (data.length > 0) {
                    num = 0;
                    auxTable = '<table id="tests"><tr><th>Test</th><th>Date</th><th>Result</th></tr>';
                    for (i in data) {
                        num += 1
                        auxTable += '<tr>' +
                            '<td style="font-family: CooperFiveOpti-Black; ' +
                            'font-size:30px;">' + num + 'º</td>' +
                            '<td style="font-family: Arial, Helvetica, sans-serif; ' +
                            'font-size: 25px;">19/04/2021</td>' +
                            '<td>';
                        if (data[i].test_result == "positive") {
                            auxTable += '<font style="font-family: Arial, Helvetica, sans-serif; ' +
                            'text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;' +
                            'font-weight: bold; ' +
                            'font-size: 30px; ' +
                            'color:#9C1212">' +
                            'Positive</font>'
                        } else {
                            auxTable += '<font style="font-family: Arial, Helvetica, sans-serif; ' +
                            'text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;' +
                            'font-weight: bold; ' +
                            'font-size: 30px; ' +
                            'color:#AFD569">' +
                            'Negative</font>'
                        }

                        auxTable += '</td>';
                        auxTable += '</tr>';

                    }
                    table.innerHTML = auxTable + '</table>';
                } else {
                    table.innerHTML = '<div width="100%" style="text-align:center">' +
                        '<h2>Widthout tests performed .</h2>' +
                        '</div>';
                }

            },


        })
    })();

}

// chama o serviço que devolve os dados o utilizador
function getUserDesc(v_id) {
    (async () => {
        
        await $.ajax({
            url: "http://213.30.2.186:22228/KOFKOF/webresources/users/recordDesc/" + v_id,
            type: "GET",
            success: function (data) {
                data = data;
                document.getElementById('name').innerHTML="Name: " + data.usr_name;                
                document.getElementById('year').value="Year of Birth: " + data.age_year;                
                document.getElementById('country').value="Country: " + data.cnt_desc;

            }
        })
    })();

}