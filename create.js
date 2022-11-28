$("#formid").submit(function (e) {
    e.preventDefault();
});

var userLineID = '';


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

function generatToken() {

    var rand = function () {
        return Math.random().toString(36).substr(2);
    };

    var token = function () {
        return rand() + rand() + rand() + rand();
    };

    Token = token();
    console.log(Token);
}


function createUser() {
    let nameParent = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let p_age = document.getElementById('p-age').value;


    let firstName = document.getElementById('user-firstname').value;
    let lastname = document.getElementById('user-lastname').value;
    let level = document.getElementById('level').value;
    let age = document.getElementById('age').value;
    let gender = document.getElementById('gender').value;
    let height = document.getElementById('height').value;
    let weight = document.getElementById('weight').value;

    if (
        nameParent != '' &&
        phone != '' &&
        p_age != '' &&
        height != '' &&
        weight != '' &&
        level != 0 &&
        gender != 0 &&
        firstName != '' &&
        lastname != '' &&
        age != ''
    ) {

        $('#handleSubmit').addClass('loading');
        $('#loading').removeClass('loading');

        generatToken();
        axios.post('https://line-api-laoruthit.herokuapp.com/create/parent', {
                /* https://line-api-laoruthit.herokuapp.com/create/parent */
                name: nameParent,
                phone: phone,
                line_user_id: userLineID,
                age: p_age,
                token: Token
            })
            .then(function (response) {
                //console.log(response.data.status);
                if (response.data.status != 203) {
                    axios.post('https://line-api-laoruthit.herokuapp.com/create/user', {
                            rfid: '',
                            firstName: firstName,
                            lastName: lastname,
                            height: height,
                            weight: weight,
                            age: age,
                            gender: gender,
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
                    document.getElementById('p-age').value = '';
                    document.getElementById('gender').value = '';
                    setTimeout(function () {
                        $('#handleSubmit').removeClass('loading');
                        $('#loading').addClass('loading');
                    }, 2000)

                    var dateNow = new Date();

                    axios.post('https://line-api-laoruthit.herokuapp.com/push/message', {
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
                    setTimeout(function () {
                        $('#handleSubmit').removeClass('loading');
                        $('#loading').addClass('loading');
                    }, 1000)
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'มีบางอย่างผิดพลาด',
                        text: 'คุณได้เคยลงทะเบียนไว้แล้วในระบบ',
                    })
                    setTimeout(function () {
                        $('#handleSubmit').removeClass('loading');
                        $('#loading').addClass('loading');
                    }, 2000)
                }

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

        setTimeout(function () {
            $('#handleSubmit').removeClass('loading');
            $('#loading').addClass('loading');
        }, 2000)
    }
}
