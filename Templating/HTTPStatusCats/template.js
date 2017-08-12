$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        let source = $('#cat-template').html();
        let template = Handlebars.compile(source);
        let context = {
            cats: window.cats
        }

        let html = template(context);

        $('#allCats').html(html);
    }

    $(`button`).on('click', function (event) {
        let element = $($(event.target).parent()).find('div').toggle();

        if(element.css('display') == 'none'){
            $(element.parent()).find('button').text("Show status code");
        } else {
            $(element.parent()).find('button').text("Hide status code");
        }
    });
})

