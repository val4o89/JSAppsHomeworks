function attachEvents() {

    let baseUrl = 'https://phonebook-nakov.firebaseio.com/phonebook';

    (function () {
        $('#btnCreate').on('click', function () {
            createContact();
        })
        $('#btnLoad').on('click', function () {
            getContacts();
        })
    })();

    function createContact() {
        let person = $('#person');
        let phone = $('#phone');
        let dataObject = {
            person: `${person.val()}`,
            phone: `${phone.val()}`
        }
        let request = {
            url: baseUrl + '.json',
            method: 'POST',
            data: JSON.stringify(dataObject),
            success: () => {person.val(''); phone.val(''); getContacts()}
        }

        $.ajax(request);
    }



    function getContacts() {
        let request = {
            url: baseUrl + '.json',
            method: 'GET',
            success: showContacts
        }

        $.ajax(request);
    }

    function showContacts(contacts) {
        let list = $('#phonebook').empty();
        for (let key in contacts) {
            let element = $('<li>');
            let btnDelete = $('<button>').text('Delete').on('click', function () {
                deleteContact(key, element);
            });
            element.text(`${contacts[key].person}: ${contacts[key].phone}`);
            element.append(btnDelete);
            list.append(element);

        }
    }

    function deleteContact(key, element) {
        let request = {
            url: baseUrl + '/' + key + '.json',
            method: 'DELETE',
            success: () => $(element).remove()
        }

        $.ajax(request);
    }
}