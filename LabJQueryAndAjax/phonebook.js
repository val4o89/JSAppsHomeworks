const baseUrl = "https://phonebookdb-ae6c2.firebaseio.com/";

function showContacts() {
    let request = {url: baseUrl + '.json', method:'GET', success: onSuccess };
    
    $.ajax(request);
    
    function onSuccess(response) {
        let div = $('#content').empty();
        for (let item in response) {
            let personData = $('<p>');
            let personDiv = $('<div>').css('display', 'flex').css('align-items', 'center');

            div.append(personDiv.append($('<p>').css('width', '20%')
                .text(`${response[item].name}: ${response[item].phone}`)).append($('<button>')
                .css('height', '20px').text('Delete').on('click', function () {
                    deleteContact(item);
                    personDiv.remove();
            })));
        }
        
        $('body').append(div);
    }
}

function createContact() {
    let personName = $('#person').val();
    let personPhone = $('#phone').val();

    let data = {name: personName, phone: personPhone };
    let request = {
        url: baseUrl + ".json",
        method: 'POST',
        data: JSON.stringify(data),
        success: showContacts,

    }
    $.ajax(request);
}

function deleteContact(contact) {
    let request = {
        url: `${baseUrl}${contact}/.json`,
        method: "Delete"
    }
    
    $.ajax(request);
}