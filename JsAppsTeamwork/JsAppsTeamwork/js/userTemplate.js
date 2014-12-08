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
        
        $('#categoryName').append('<h2>Categories</h2>')
            .append('<input type="text" id="add-category-text" />')
            .append('<a id="add-category-button" href="#">Add category</a>')
            .append('<ul class="categories"></ul>');
        $('#add-category-button').click(addCategory);

        for (var c in data.results) {
            var category = data.results[c];
            var categoryItem = $('<li></li>');
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
        function error() {
            noty({
                text: 'Cannot load AJAX data.',
                type: 'error',
                layout: 'topCenter',
                timeout: 5000}
                );
        }
    });