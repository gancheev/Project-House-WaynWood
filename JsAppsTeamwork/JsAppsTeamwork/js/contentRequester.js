$(function () {
    var PARSE_APP_ID = "qPuWyYL6iGXkMrpboqlyrGcURCw3iVSRl0YHX0rX";
    var PARSE_REST_API_KEY = "ICtiKOhTxDXmSmQySN3sL88Q5wZ4WoUPsF7xwomN";

    loadCategories();

    function loadCategories() {
        $.ajax({
            method: "GET",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: "https://api.parse.com/1/classes/Category",
            success: categoriesLoaded,
            error: error
        });
    }

    function categoriesLoaded(data) {
        for (var c in data.results) {
            var category = data.results[c];
            var categoryItem = '<div class="well">${Title}</div>';
            var output = categoryItem.replace("${Title}", category.name);
            $("#categoryName").append(output);
        }
        
    }

    function loadPosts() {
        var category = $(this).data('category');

        if (!$(this).parent().has('div').length) {
            var targetLi = $("li:contains('" + category.name + "')");
            var postTitle = $('<br><input type="text" class="add-post-title" placeholder="Post name" /><br>');
            var postContent = $('<textarea class="add-post-content" placeholder="Post content"></textarea>');
            var addPostButton = $('<a id="add-post-button" href="#">Add a post</a>');
            addPostButton.data('category', category);
            addPostButton.data('postTitle', postTitle);
            addPostButton.data('postContent', postContent);
            addPostButton.click(addPost);
            targetLi.append(postTitle).append(postContent).append(addPostButton);
            targetLi.insertAfter($('.ul :last-child'));
        }

        $.ajax({
            method: "GET",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: 'https://api.parse.com/1/classes/Post?where={"category":{"__type":"Pointer","className":"Category","objectId":"' + category.objectId + '"}}',
            success: postsLoaded,
            error: error
        });
    }

    function error() {
        noty({
            text: 'Cannot load AJAX data.',
            type: 'error',
            layout: 'topCenter',
            timeout: 5000
        }
			);
    }
});