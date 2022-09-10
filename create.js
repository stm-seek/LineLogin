
$("#formid").submit(function (e) {
    e.preventDefault();
});

var userLineID;


function runApp() {
    liff.getProfile().then(profile => {
        userLineID = profile.userId;
        document.getElementById("name").value = profile.displayName;
        console.log(userLineID);
    }).catch(err => console.error(err));
}

liff.init({
    liffId: "1657403396-Ep6P1KLn"
}, () => {
    if (liff.isLoggedIn()) {
        runApp();
    } else {
        liff.login();
    }
}, err => console.error(err.code, error.message));


var Token;
var qr;

function logout() {
    liff.logout();
    location.reload();
}

function generatToken () {
    /* let baseString = document.getElementById('name').value;
    token = window.btoa(baseString); */
    var rand = function() {
        return Math.random().toString(36).substr(2);
    };

    var token = function() {
        return rand() + rand() + rand() + rand(); // to make it longer
    };

    Token = token();
    console.log(Token);
}

/* function decodeToken() {
    var painText = window.atob(token);
    console.log(painText);
} */

function createUser() {
    let nameParent = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    

    let firstName = document.getElementById('user-firstname').value;
    let lastname = document.getElementById('user-lastname').value;
    let level = document.getElementById('level').value;
    let age = document.getElementById('age').value;

    if (nameParent != '' &&
        phone != '' &&
        level != 0 &&
        firstName != '' &&
        lastname != '' &&
        age != '') {
        
        generatToken();
        axios.post('http://localhost:4000/create/parent', {
                name: nameParent,
                phone: phone,
                line_user_id: userLineID,
                token: Token
            })
            .then(function (response) {
                axios.post('http://localhost:4000/create/user', {
                        rfid: '',
                        firstName: firstName,
                        lastName: lastname,
                        age: age,
                        level: level,
                        moneyUse: 0,
                        parentName: nameParent
                    })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                document.getElementById('name').value = '';
                document.getElementById('phone').value = '';
                

                document.getElementById('user-firstname').value = '';
                document.getElementById('user-lastname').value = '';
                document.getElementById('level').value = 0;
                document.getElementById('age').value = '';
                console.log(response);

                var dateNow = new Date();

                axios.post('http://localhost:4000/push/message', {
                        user_child_id: userLineID,
                        name: nameParent,
                        date: dateNow.toDateString(),
                        token: Token
                    })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                Swal.fire({
                    imageUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=' + Token + '&amp;size=150x150',
                    imageHeight: 200,
                    imageAlt: 'image qrcode',
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ',
                    text: 'กรุณาบันทึก QRcode ที่ได้เพื่อนำไปรับ Wristband',
                  })
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'มีบางอย่างผิดพลาด',
            text: 'กรุณาใส่ข้อมูลให้ครบถ้วน',
          })
    }
}