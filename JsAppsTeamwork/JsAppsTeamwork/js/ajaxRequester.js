$(function () {
    var PARSE_APP_ID = "qPuWyYL6iGXkMrpboqlyrGcURCw3iVSRl0YHX0rX";
    var PARSE_REST_API_KEY = "ICtiKOhTxDXmSmQySN3sL88Q5wZ4WoUPsF7xwomN";

   

    var password = "admin";
    var user = "admin";
    var use = prompt("Enter the username", "");
    var pas = prompt("Enter in the password", "");
    

    if (use.toLowerCase() == user || pas.toLowerCase() === password) {
        

        
        loadCategories();
    }
    else {
        location = "../index.html";
    }

    function loadCategories() {

    $('#categoryName').html('');   

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

        $('#categoryName').html('');   

        $('#categoryName').append('<h2>Categories</h2>')
            .append('<input type="text" id="add-category-text" />')
            .append('<a class="btn btn-success" id="add-category-button" href="#">Add category</a>')
            .append('<ul class="categories"></ul>');
        $('#add-category-button').click(addCategory);

        for (var c in data.results) {
           
            var category = data.results[c];
            var sidebar = $('<button type="button" class="btn btn-warning sidebar-button"></button>');
            sidebar.text(category.name);
			sidebar.data('category', category);
			sidebar.click(loadPosts);
            sidebar.appendTo($('.list-unstyled'));
            var categoryItem = $('<li class="styled-li"></li>');
            categoryItem.addClass(category.objectId);
            var categoryLink = $('<a href="#"></a>');
            categoryLink.data('category', category);
            categoryLink.click(loadPosts);
            categoryLink.text(category.name);
            categoryLink.appendTo(categoryItem);
            addControlButtons(categoryItem, category);

            categoryItem.appendTo($(".categories"));
        }

        $('.edit-category').click(editCategory);
    }

    function addControlButtons(categoryItem, category) {
        var removeButton = $('<a class="remove-category btn btn-danger" href="#">Remove</a>');
        removeButton.data('category', category);
        removeButton.click(removeCategory);

        var editButton = $('<a class="edit-category btn btn-info" href="#">Edit</a>');
        editButton.data('category', category);
        editButton.click(editCategory);

        categoryItem.append('  ')
            .append(editButton)
            .append('  ')
            .append(removeButton);
    }

    function addCategory() {
        var categoryName = $('#add-category-text').val();

        $.ajax({
            method: "POST",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            data: JSON.stringify(
                { "name": categoryName }
            ),
            contentType: "application/json",
            url: "https://api.parse.com/1/classes/Category",
            success: loadCategories,
            error: error
        });
        event.stopPropagation();
    }

    function editCategory() {
        var category = $(this).data('category');
        var oldCategoryName = category.name;
        var newCategoryName = prompt('Rename :', oldCategoryName) || oldCategoryName;

        $.ajax({
            method: "PUT",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            data: JSON.stringify(
                { "name": newCategoryName }
            ),
            contentType: "application/json",
            url: "https://api.parse.com/1/classes/Category/" + category.objectId,
            success: loadCategories,
            error: error
        });
    }

    function removeCategory() {
        var category = $(this).data('category');
        $.ajax({
            method: "DELETE",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: "https://api.parse.com/1/classes/Category/" + category.objectId,
            success: loadCategories,
            error: error
        });
    }

    function loadPosts() {
        var category = $(this).data('category');

        if (!$(this).parent().has('ul').length) {
            var targetLi = $("li:contains('" + category.name + "')");
            var postTitle = $('<input type="text" class="add-post-title" placeholder="Post name" />');
            var postContent = $('<textarea class="add-post-content" placeholder="Post content"></textarea><br>');
            var addPostButton = $('<a id="add-post-button" class="btn btn-primary" href="#">Add a post</a>');
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

    function postsLoaded(data) {
        var category = data.results[0].category;
        var targetLi = $("li." + category.objectId + "");

        if (targetLi.has('ul').length) {
            $('"' + targetLi + " ul").empty();
        }

        var postsUl = $('<ul>');
        for (var p in data.results) {
            var editPostButton = $('<a href="#">Edit</a>');
            editPostButton.data('post', data.results[p]);
            editPostButton.click(editPost);

            console.log(data.results[p]);

            var commentAuthor = $('<input type="text" class="add-comment-author" placeholder="Author..."/>');
            var commentContent = $('<input type="text" class="add-comment-content" placeholder="Content..."/>');
            var addCommentButton = $('<a id="add-post-button" href="#">Add a comment</a>');

            var showCommentButton = $('<a id="show-comment-button" href="#">Show comments</a>');
            showCommentButton.data('comment', data.results[p]);
            showCommentButton.click(loadComments);

            addCommentButton.data('post', data.results[p]);
            addCommentButton.data('author', commentAuthor);
            addCommentButton.data('content', commentContent);

            addCommentButton.click(addComment);

            var commentsUl = $('<ul>');
            var commentsLI = $('<li>');
            commentsLI.addClass(data.results[p].objectId);
            commentsLI.appendTo(commentsUl);

            var removePostButton = $('<a href="#">Remove</a>');
            removePostButton.data('post', data.results[p]);
            removePostButton.click(removePost);
            postsUl.append($('<li>' + data.results[p].title + '</li>'))
                .append($('<div>' + data.results[p].content + '</div>'))
                .append(editPostButton)
                .append(' ')
                .append(removePostButton)
                .append('<br>')
                .append('<h5>Add your comment</h5>')
                .append(commentAuthor)
                .append(' ')
                .append(commentContent)
                .append(addCommentButton)
                .append('<br>')
                .append(showCommentButton)
                .append('<br>')
                .append(commentsUl);
        }

        postsUl.appendTo(targetLi);

    }

    function addPost() {
        var postTitle = $(this).data('postTitle').val();
        var postContent = $(this).data('postContent').val();
        var category = $(this).data('category');

        $.ajax({
            method: "POST",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            data: JSON.stringify(
                {
                    "title": postTitle,
                    'content': postContent,
                    "category":
                    {
                        "__type": "Pointer",
                        "className": "Category",
                        "objectId": category.objectId
                    }
                }
            ),
            contentType: "application/json",
            url: "https://api.parse.com/1/classes/Post",
            success: loadCategories,
            error: error
        });
    }

    function editPost() {
        var post = $(this).data('post');
        var oldPostTitle = post.title;
        var newPostTitle = prompt('Rename :', oldPostTitle) || oldPostTitle;

        $.ajax({
            method: "PUT",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            data: JSON.stringify(
                {
                    "title": newPostTitle
                }
            ),
            contentType: "application/json",
            url: "https://api.parse.com/1/classes/Post/" + post.objectId,
            success: loadCategories,
            error: error
        });
    }

    function removePost() {
        var post = $(this).data('post');
        console.log(post);
        $.ajax({
            method: "DELETE",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: "https://api.parse.com/1/classes/Post/" + post.objectId,
            success: loadCategories,
            error: error
        });
    }

    function removeComment() {
        var comment = $(this).data('comment');
        console.log(comment);
        $.ajax({
            method: "DELETE",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: "https://api.parse.com/1/classes/Comment/" + comment.objectId,
            success: loadPosts,
            error: error
        });
    }

    function editComment() {
        var comment = $(this).data('comment');
        var oldCommentContent = comment.content;
        var newCommentContent = prompt('Edit :', oldCommentContent) || oldCommentContent;

        $.ajax({
            method: "PUT",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            data: JSON.stringify(
                {
                    "content": newCommentContent
                }
              ),
            contentType: "application/json",
            url: "https://api.parse.com/1/classes/Comment/" + comment.objectId,
            success: loadPosts,
            error: error
        });
    }

    function addComment() {
        var commentAuthor = $(this).data('author').val();
        var commentContent = $(this).data('content').val();
        var post = $(this).data('post');

        console.log(post);

        $.ajax({
            method: "POST",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            data: JSON.stringify(
                {
                    "author": commentAuthor,
                    "content": commentContent,
                    "post":
                    {
                        "__type": "Pointer",
                        "className": "Post",
                        "objectId": post.objectId
                    }
                }
            ),
            contentType: "application/json",
            url: "https://api.parse.com/1/classes/Comment",
            success: loadCategories,
            error: error
        });
    }

    function loadComments() {
        var post = $(this).data('comment');
        $.ajax({
            method: "GET",
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: 'https://api.parse.com/1/classes/Comment?where={"post":{"__type":"Pointer","className":"Post","objectId":"' + post.objectId + '"}}',
            success: commentsLoaded,
            error: error
        });

    }

    function commentsLoaded(data) {
        var comment = data.results[0].post;
        console.log(comment.objectId);
        var targetLi = $("li." + comment.objectId + "");
        var targetP = $('p.' + comment.objectId + "")
        if (targetP.has('div').length) {
            $('""' + targetP + " div").empty();
        }
        var commentDiv = $("<div>");
        for (var c in data.results) {
            var editCommentButton = $('<a href="#">Edit</a>');
            editCommentButton.data('comment', data.results[c]);
            editCommentButton.click(editComment)

            var removeCommentButton = $('<a href="#">Remove</a>');
            removeCommentButton.data('comment', data.results[c]);
            removeCommentButton.click(removeComment);
            commentDiv.append($('<p>' + data.results[c].author + '</p>'))
                .append($('<p>' + data.results[c].content + '</p>'))
                .append(editCommentButton)
                .append(' ')
                .append(removeCommentButton)
        }

        commentDiv.appendTo(targetLi);
    }
	
	//Search functionality
	//=========================================================
	
	$(document).ready(function(){
			$('.btn-default').click(searchCategory);
	});
	
	
	function searchCategory(){

			$.ajax({
				method: "GET",
				headers: {
					"X-Parse-Application-Id": PARSE_APP_ID,
					"X-Parse-REST-API-Key": PARSE_REST_API_KEY
				},
				url: "https://api.parse.com/1/classes/Post",
				success: searchCategoryLoaded,
				error: error
			});

	}
	
	function searchCategoryLoaded(data){
	
		var postSearch = $('.form-control').val();
        var postSearch = $('<ul></ul>');
        for (var c in data.results) {
            var postTitle = data.results[c].title;
            var postItem = $('<li></li>');
            if(postTitle.toLocaleLowerCase().indexOf(postSearch ) > -1){
                postItem.append(postTitle);
                postItem.appendTo(postSearch);
            }
        }

	}
	
	//=========================================================

    function error() {
        noty({
            text: 'Cannot load AJAX data.',
            type: 'error',
            layout: 'topCenter',
            timeout: 5000
        });
    }
  
});

