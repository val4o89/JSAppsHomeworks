function attachEvents() {

    $('#btnLoadPosts').on('click', function () {
        loadPosts();
    });

    $('#btnViewPost').on('click', function () {
        getComments();
    });

    let url = 'https://baas.kinvey.com/appdata/kid_SybLuvhIb';
    let username = 'val4o89';
    let password = 'valiovalio';
    let headers = {
        "Authorization": "Basic " + btoa(username + ":" + password)
    };

    function loadPosts() {

        let request = {
            url: url + '/posts',
            method: "GET",
            headers: headers,
            success: getPosts
        };
        
        $.ajax(request);
    }

    function getPosts(posts) {
        let selectMenu = $('#posts').empty();

        for (let post of posts) {
            selectMenu.append($('<option>').val(post._id).text(post.title));
        }
    }

    function getComments() {
        let postId = $('#posts option:selected').val();

        let requestPost = {
            url: url + `/posts/?query={"_id":"${postId}"}`,
            method: "GET",
            headers: headers,
            success: showPost
        }

        $.ajax(requestPost)

        let requestComments = {
            url: url + `/comments/?query={"post_id":"${postId}"}`,
            method: "GET",
            headers: headers,
            success: showComents
        }

        $.ajax(requestComments);
    }

    function showPost(post) {
        $('#post-title').text(post[0].title);
        $('#post-body').text(post[0].body);
    }

    function showComents(comments) {
        let list = $('#post-comments').empty();

        for (let comment of comments) {
            list.append($('<li>').text(comment.text));
        }
    }
}