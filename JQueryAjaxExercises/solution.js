function attachEvents() {
    let baseUrl = 'https://messengerdb-13747.firebaseio.com/messenger';

    (function () {
        $('#submit').on('click', function () {
            postMessage();
        });

        $('#refresh').on('click', function () {
            refreshMessages();
        })
    })();

    function postMessage() {
        let author = $('#author');
        let message = $('#content');
        let postData = {
            author: author.val(),
            content: message.val(),
            timestamp: Date.now()
        }
        message.val('');
        let request = {
            url: baseUrl + '.json',
            method: 'POST',
            data: JSON.stringify(postData)
        }

        $.ajax(request);
    }
    
    function refreshMessages() {
        let request = {
            url: baseUrl + '.json',
            method: "GET",
            success: showMessages
        }

        $.ajax(request);
    }

    function showMessages(messages) {
        let arrStamps = [];

        for (let key in messages) {
            arrStamps.push([messages[key].timestamp, messages[key].author, messages[key].content])
        }

        arrStamps = arrStamps.sort(function (a, b) {
            return Number(a.timestamp) - Number(b.timestamp);
        });

        let textArea = $('#messages').empty();

        for (let message of arrStamps) {
            textArea.text(textArea.text() + `${message[1]}: ${message[2]}\n`)
        }
    }
}