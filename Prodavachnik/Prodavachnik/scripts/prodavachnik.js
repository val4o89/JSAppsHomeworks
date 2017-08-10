function startApp() {

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_rJ8tDHdvW";
    const kinveyAppSecret = "71dae5e0a7e04c3d935d9b32d63ee9cc";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    let username;

    let loginLink = $('#menu #linkLogin').on('click', function () {
        viewLogin();
    });
    let homeLink = $('#menu #linkHome').on('click', function () {
        viewHome();
    }).show();
    let registerLink = $('#menu #linkRegister').on('click', function () {
        viewRegister();
    });
    let linkListAds = $('#linkListAds').on('click', function () {
        viewAds();
    });

    let linkCreateAd = $('#linkCreateAd').on('click', function () {
        viewCreateAd();
    })
    let linkLogout = $('#linkLogout').on('click', function () {
        logOutUser();
    });

    let viewRegisterSection = $('#viewRegister');
    let viewHomeSection = $('#viewHome');
    let viewLoginSection = $('#viewLogin');
    let viewAdSection = $('#viewAds');
    let viewCreateAdSection = $('#viewCreateAd');
    let viewEditAdSection = $('#viewEditAd');
    let loggedInUser = $('#loggedInUser');
    let sections = $('.sections');

    let buttonRegisterUser = $('#buttonRegisterUser').on('click', function () {
        registerUser();
    });
    let buttonLoginUser = $('#buttonLoginUser').on('click', function () {
        loginUser();
    });

    let buttonCreate = $('#buttonCreateAd').on('click', function () {
        createAd();
    })

    function checkSession() {
        if (!sessionStorage.getItem('authToken')) {
            viewHomeSection.show();
            registerLink.show();
            loginLink.show();
            linkListAds.hide();
            linkCreateAd.hide();
            linkLogout.hide();
            loggedInUser.hide();
            showUser(false);
            viewHome();

        } else {
            linkListAds.show();
            linkCreateAd.show();
            linkLogout.show();
            loggedInUser.show();
            viewHomeSection.hide();
            registerLink.hide();
            loginLink.hide();
            showUser(true);
            viewHome();
        }
    };

    checkSession();

    function viewHome() {
        sections.hide();
        viewHomeSection.show();
    }

    function viewRegister() {
        sections.hide();
        viewRegisterSection.show();
    }

    function viewLogin() {
        sections.hide();
        viewLoginSection.show();
    }

    function registerUser() {
        showLoading();
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: logRegSuccess,
            error: onError
        });
    }

    function loginUser() {
        showLoading();
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: logRegSuccess,
            error: onError
        });
    }

    function logRegSuccess(response) {
        if(viewLoginSection.css('display') === 'none'){
            showInfo('You successfuly registred!');
        } else {
            showInfo('You successfuly loged in!');
        }
        sessionStorage.setItem('authToken', response._kmd.authtoken);
        sessionStorage.setItem('userId', response._id);
        sessionStorage.setItem('username', response.username)
        checkSession();
        viewHome();
        hideLoading();
        clearFields();
    }

    function logOutUser() {
        showInfo('You successfuly logged out!');
        sessionStorage.clear();
        checkSession();
        viewHome();
    }

    function onError(response) {
        let errorMsg = JSON.stringify(response.error);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description){
            errorMsg = response.responseJSON.description;
            showError(errorMsg);
            hideLoading();
        }

    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 4000);
    }

    function showLoading() {
        $('#loadingBox').text('Loading...').show();

    }

    function hideLoading(){
        $('#loadingBox').text('').hide();
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
        setInterval(function () {
            $('#errorBox').fadeOut()
        }, 4000);
    }

    function viewAds() {
        showLoading();
        sections.hide();

        let request = {
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey +  '/ads',
            method: 'GET',
            headers: {"Authorization": "Kinvey " + sessionStorage.getItem('authToken')},
            success: showAds
        }
        $.ajax(request);
        viewAdSection.show();
    }

    function showAds(response) {
        let table = $('#ads table');

        $('.body-row').remove();

        for (let row of response) {
            let curent = $('<tr>').addClass('body-row');
            
            curent.append(`
                    <td>${row.title}</td>
                    <td>${row.publisher}</td>
                    <td>${row.description}</td>
                    <td>${parseFloat(row.price).toFixed(2)}</td>
                    <td>${row.publish_date}</td>`)

            if(row._acl.creator === sessionStorage.getItem('userId')){

                let anchorDel = $('<a href="#">[Delete]</a>').on('click', function () {
                    deleteAd(curent, row);
                });

                let tdDelete = $('<td>').append(anchorDel);

                let tdEdit = $('<td><a href="#">[Edit]</a></td>').on('click', function () {
                    viewEditAd();
                    modifyAd(row);

                })
                curent.append(tdDelete, tdEdit);
            };
            table.append(curent);
        }
        showInfo('Successfuly loaded advertisements!');
        hideLoading();
    }

    function deleteAd(row, ad) {
        let request = {
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/ads/" + ad._id,
            method: "DELETE",
            headers: {"Authorization": "Kinvey " + sessionStorage.getItem('authToken')},
            success: () => { row.remove(); showInfo('The ad was successfuly deleted!') }
        }

        $.ajax(request);
    }

    function showUser(visibility) {
        if(visibility){
            $('#loggedInUser').text(`Welcome, ${sessionStorage.getItem('username')}!`).show();
        } else {
            $('#loggedInUser').text(``).hide();
        }
    }
    
    function createAd() {

        let date = returnDate($('#formCreateAd input[name=datePublished]').val());


        if(checkFields("formCreateAd") && date){

            let ad = {
                title: $('#formCreateAd input[name=title]').val(),
                publisher: sessionStorage.getItem('username'),
                description: $('#formCreateAd textarea[name=description]').val(),
                publish_date: date,
                price: $('#formCreateAd input[name=price]').val(),
            };

            let requset = {
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/ads",
                method: 'POST',
                data: ad,
                headers: {"Authorization": "Kinvey " + sessionStorage.getItem('authToken')},
                success: () => {onCreateEditSuccess("created")}
            };

            showLoading();
            $.ajax(requset);
        }
    }

    function onCreateEditSuccess(action) {
        showInfo(`An ad was successfuly ${action}!`);
        sections.hide();
        viewAds();
        hideLoading();
        clearFields();
    }

    function viewCreateAd() {
        sections.hide();
        viewCreateAdSection.show();
    }

    function viewEditAd() {
        sections.hide();
        viewEditAdSection.show();
    }

    function modifyAd(ad) {
        let idField = $('#formEditAd input[name=id]').val(ad._id);
        let publisherField = $('#formEditAd input[name=publisher]').val(sessionStorage.getItem('username'));
        let titleField = $('#formEditAd input[name=title]').val(ad.title);
        let descriptionField = $('#formEditAd textarea[name=description]').val(ad.description);
        let dateField = $('#formEditAd input[name=datePublished]').val(ad.publish_date);
        let priceField = $('#formEditAd input[name=price]').val(ad.price);

        let buttonEditAd = $('#buttonEditAd').on('click', function () {

            let date = returnDate(dateField.val());

            if(checkFields("formEditAd") && date){
                let modifiedAdData = {
                    publisher: publisherField.val(),
                    title: titleField.val(),
                    description: descriptionField.val(),
                    publish_date: date,
                    price: priceField.val()
                };

                let request = {
                    url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/ads/" + idField.val(),
                    method: "PUT",
                    data: modifiedAdData,
                    headers: {"Authorization": "Kinvey " + sessionStorage.getItem('authToken')},
                    success: () => {onCreateEditSuccess('modified'); buttonEditAd.off()}
                }

                showLoading();
                $.ajax(request);
            }
        })
    }

    function clearFields() {
        $('input[type=text]').val('');
        $('input[type=number]').val('');
        $('input[type=password]').val('');
        $('input[type=date]').val('');
        $('input[type=hidden]').val('');
        $('textarea').val('');
    }


    function checkFields(formId) {
        let text = $(`#${formId} input[type=text]`).val();
        let price = $(`#${formId} input[type=number]`).val();
        let date = $(`#${formId} input[type=date]`).val();
        let desc = $(`#${formId} textarea`).val();



        if(!text || !date || !desc){



            showError("All fields are required!");
            return false;
        } else if(price == ""){
            showError("Price must be number!");
            return false;
        }

        return true;
    }
    
    function returnDate (date) {
        console.log(date);
        let patternMozila = /^(\d{2}(\/|\-)){2}\d{4}$/;
        let patternChrome = /^\d{4}-\d{2}-\d{2}$/;

        let returnDate = new Date(date);

        console.log(returnDate.toString() == "Invalid Date");
        console.log(!patternMozila.test(date));
        console.log(!patternChrome.test(date));

        if(returnDate.toString() == "Invalid Date" || (!patternMozila.test(date) && !patternChrome.test(date))){
            showError("Date is not valid!");
            return false;
        };
        let month = (returnDate.getMonth() + 1);
        return  (month.length < 2 ? month : "0" + month)+ '/' + returnDate.getDate() + '/' + returnDate.getFullYear();

    };
}