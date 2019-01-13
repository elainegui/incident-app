$(document).ready(function () {
    var username = localStorage.getItem("firstName");
    console.log("Rodrigo: " + $('#logoutTab').text() );
    if (username === null) {
        $('#loginTab').show();
        $('#logoutTab').text('Log out');
        $('#logoutTab').hide();
        $('#registerTab').show();
        $('#myIncidentsTab').hide();
    } else {
        $('#loginTab').hide();
        $('#logoutTab').text(localStorage.getItem("firstName") + ' | Log out');
        $('#logoutTab').show();
        $('#registerTab').hide();
        $('#myIncidentsTab').show();
    }

    //navbar functions calling
    $('#loginTab').on('click', function(e) {
        e.preventDefault();   
        login(); 
        });

    $('#registerTab').on('click', function(e) {
        e.preventDefault();   
        register(); 
    });

    $('#logoutTab').on('click', function(e) {
        e.preventDefault();   
        logout(); 
    });

});


function login() {
    window.location.href = 'login.html';
};

//validate button
var validateLogin = function () {
    var userId = $('#userid').val();
    var password = $('#password').val();

    if(userId!==""||password!==""){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/user?email=' + userId + '&password=' + password,
            dataType: "json",
            async: false,
            success: function (data) {
                loginSuccess(data);
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#validationMessage").text("invalid login/ password");
            }
        });
    }else{
        $("#validationMessage").text("Please fill in the fields");
    }
};

function registerUserAjaxPost() {
    //added
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    // PREPARE FORM DATA
    var formData = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        //added
        number: $("#street_number").val(),
        street: $("#route").val(),
        //city: $("#city").val(),
        city: $("#locality").val(),
        county: $("#administrative_area_level_1").val(),
        zipCode: $("#postal_code").val(),
        country: $("#country").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        confirmPassword: $("#confirmPassword").val(),
        userLatitude: latitude,
        userLongitude: longitude

    }
    // DO POST
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "http://localhost:8080/register",
        data: JSON.stringify(formData),
        dataType: 'text',

        success: function (data, textStatus, jqXHR) {
            alert('User registered successfully');
            window.location.href = 'mainPage.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('userRegistry error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });
}

function loginSuccess(data) {
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('userId', data.id);
    $("#loginForm")[0].reset();
    window.location.href = 'mainPage.html';
}

function register() {
    window.location.href = 'register.html';
}

function validateUserRegister() {
    $("#validationMessage").text('');
    return checkBlankFieldsInUserRegister() && checkPasswordConfirmationInUserRegister() &&
        checkAddressWasChosenInUserRegister();
}

function checkAddressWasChosenInUserRegister() {
    if ($("#country").val() === '') {
        $("#validationMessage").text('Please start typing the address then choose the best option suggested.');
        return false;
    }
    return true;
}

function checkPasswordConfirmationInUserRegister() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if (password !== confirmPassword) {
        $("#validationMessage").text('Passwords must match!');
        return false;
    }
    return true;
}


function checkBlankFieldsInUserRegister() {

    var invalidFields = [];

    if ($("#firstName").val() === '') {
        invalidFields.push('First Name');
    }

    if ($("#lastName").val() === '') {
        invalidFields.push('Last Name');
    }

    if ($("#autocomplete").val() === '') {
        invalidFields.push('Address');
    }

    if ($("#email").val() === '') {
        invalidFields.push('E-mail address');
    }

    if ($("#password").val() === '') {
        invalidFields.push('Password');
    }

    if ($("#confirmPassword").val() === '') {
        invalidFields.push('Confirm Password');
    }

    if (invalidFields.length > 0) {
        var errorMessage = 'Please provide information for the following fields: ';
        var fields = '';
        $.each(invalidFields, function (index, value) {
            fields += ", " + value;
        });
        fields = fields.substr(2);
        errorMessage += fields;
        $("#validationMessage").text(errorMessage);
        return false;
    }

    return true;
}

var userRegister = function () {
    // Prevent the form from submitting via the browser.
    event.preventDefault();

    if (validateUserRegister()) {
        registerUserAjaxPost();
        $("#registrationForm")[0].reset();
    }
};

function logout() {

    localStorage.removeItem('firstName');
    localStorage.removeItem('userId');
    window.location.reload(true);
};

function reportIncident() {
    window.location.href = 'reportIncident.html';
};

function saveIncident() {
    event.preventDefault();
    var place = autocomplete.getPlace();

    var formData = {
        date: new Date(),
        userId: localStorage.getItem('userId'),
        typeId: $("#incidentType").val(),
        verified: false,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        image: $("#photo").val(),
        message: $("#message").val()
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "http://localhost:8080/incident",
        data: JSON.stringify(formData),
        dataType: 'json',

        success: function (data, textStatus, jqXHR) {
            alert('Incident reported successfully');
            window.location.href = 'mainPage.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Incident report error: textStatus: ' + textStatus + ' | jqXHR.status: ' + jqXHR.status + ' | errorThrown: ' + errorThrown);
        }
    });

};






