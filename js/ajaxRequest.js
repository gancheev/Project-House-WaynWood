(function () {
    var headers = {
        'X-Parse-Application-Id': 'P8ihhukFn7gzCkPX7YKRpfRosazG0LKNIETEvF2G',
        'X-Parse-REST-API-Key': '0Vj5iUkHt9mZwTaGqPneQIqNT2yRnPqm99QWRPWG'
    };

    $(document).ready(function () {

        loadCategories();
        loadPosts();
        loadComments();
    });

    loadCategories = function () {
        var categoryName = '<div id="${QuestionId}" class="well"><h1>${Title}</h1></div>'
        $.ajax({
            url: 'https://api.parse.com/1/classes/Category',
            method: 'GET',
            headers: headers,
            success: function (data) {

                var categories = data.results;
                for (var a in categories) {
                    var output = categoryName.replace("${Title}", categories[a].title).replace("${QuestionId}", categories[a].objectId);
                    $('#categoryName').append(output);
                }

            }
        });
    };

    loadPosts = function () {
        var post = '<div id="${QuestionId}" class="well"><h2>${Title}</h2></div>';
        var postContent = '<div id="${PostContentId}" class="">${PostContent}</div>';
        var postImage = '<img src="${PostImage}"/>';
        $.ajax({
            url: 'https://api.parse.com/1/classes/Post',
            method: 'GET',
            headers: headers,
            success: function (data) {

                var posts = data.results;
                for (var a in posts) {

                    var output = post.replace("${Title}", posts[a].title).replace("${QuestionId}",posts[a].objectId);
                    $('#' + posts[a].category.objectId).append(output);
                    var postContentOutput = postContent.replace("${PostContent}", posts[a].content).replace("${PostContentId}", posts[a].objectId);
                    $('#' + posts[a].objectId).append(postContentOutput);
                    var postImageOutput = postImage.replace("${PostImage}", posts[a].image);
                    $('#' + posts[a].objectId).append(postImageOutput);
                }
              

            }
        });
    };

    loadComments = function () {
        var comment = '<p class="well"> ${Comment} </p>';

        $.ajax({
            url: 'https://api.parse.com/1/classes/Comment',
            method: 'GET',
            headers: headers,
            success: function (data) {

                var comments = data.results;
                for (var a in comments) {

                    var output = comment.replace("${Comment}", comments[a].content);
                    $('#' + comments[a].post.objectId).append(output);
                }

            }
        });
    };

    authors = function () {
        var author = '<p class="lead">${Author}</p>';

        $.ajax({
            url: 'https://api.parse.com/1/classes/Post',
            method: 'GET',
            headers: headers,
            success: function (data) {

                var authors = data.results;
                for (var a in authors) {

                    var output = author.replace("${Author}", authors[a].author);
                    $('#' + authors[a].category.objectId).append(output);
                }

            }
        });
    };


}());

