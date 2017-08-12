function attachEvents() {
    let source = $('#towns-template').html();
    let template = Handlebars.compile(source);

    $('#btnLoadTowns').on('click', function () {
        loadTowns();
    })

    function loadTowns() {

        let towns = ($('#towns').val()).split(', ').map(function (x) {
            return {town: x}
        });

        $('#towns').val('');

        let context = {
            towns: towns
        }

        let html = template(context);

        $('#root').html(html);
    }
}