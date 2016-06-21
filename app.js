/**
 * Created by M on 6/16/2016.
 */

$(document).ready(function() {
    var editcontainer = $('.edit-container');
    var previewcontainer = $('.preview-container');
    var normalcontainer = $('.normal-container');
    var counter = 0;

    /*Time stuff*/
    var d = new Date();
    var month = (d.getMonth() + 1) + "";
    if (month.length === 1) month = "0" + month;
    var day = d.getDate() + "";
    if (day.length === 1) day = "0" + day;

    var dateFormat = (month) + "-" + day + "-" + d.getFullYear();

    var cards = [

    ];

    // Temporary tag holder, deleted after upload or cancel
    var tagHolder = [];

    // Adds preview card
    var addPreviewCard = function (card) {
        var container = $('<div/>');
        container.addClass('preview-container');
        container.attr('id', card._id);

        var title = $('<div/>');
        title.addClass('title');
        if (card.title === "")
            title.text("Untitled");
        else
            title.text(card.title);

        var author = $('<div/>');
        author.addClass('author');
        author.text('Author'); // Will be made to user's id

        var tags = $('<div/>');
        tags.addClass('tags');
        tags.attr('id', 'normal-container-tags');

        for (var j = 0; j < card.tags.length; j++) {
            var tag = $('<label>');
            tag.text(card.tags[j]);
            console.log(card.tags[j]);
            tags.append(tag);
        }

        var textField = $('<div/>');
        textField.addClass('text-field');
        var notes = $('<p>');
        notes.text(card.body);
        textField.append(notes);

        var preview = $('<div/>');
        preview.addClass('preview hide');
        var previewImage = $('<img src="http://www.euractiv.com/wp-content/themes/euractiv_base/media/placeholder.png"/>');
        preview.append(previewImage);

        var date = $('<div/>');
        date.addClass('date');
        date.text(dateFormat);

        container.append(title);
        container.append(author);
        container.append(tags);
        container.append(textField);
        container.append(preview);
        container.append(date);

        counter++;

        $('#main-section').append(container);

    }

    // Clears edit container content
    var clearEditContainerContent = function () {
        document.querySelector('#new-card-title').value = "";
        document.querySelector('#new-card-notes').value = "";
        $('.edit-container .tags label').remove();
        tagHolder = [];
        console.log('Card cleared!');
    }

    // Load and render the cards on the server
    $.ajax({
        url: "http://thiman.me:1337/matthew",
        type: "GET",
        success: function (response) {
            cards = response.data;
            for (var i = counter; i < cards.length; i++) {
                addPreviewCard(cards[i]);
            }
        }
    });

    // Adding a new card, brings up edit container
    $('#add-card-button').on('click', function () {
        console.log('Adding a new card!');
        $(editcontainer).removeClass('hide');
        $('#main-section').addClass('darken');
    });

    // Add tags
    $('.edit-container .tags').on('keydown', function (event) {
        if (event.keyCode === 13) {
            console.log('Adding a new tag!');

            var label = $('<label>');
            label.text(document.querySelector('#add-tag').value);
            tagHolder.push(document.querySelector('#add-tag').value);

            $('.edit-container .tags').prepend(label);
            document.querySelector('#add-tag').value = "";
        }
    });

    // Remove tags
    $('.edit-container .tags').on('click', 'label', function () {
        console.log('Removed a tag!');
        var index = tagHolder.indexOf(this.textContent);
        tagHolder.splice(index, 1);
        $(this).remove(); // Remove this tag only

        // if (tagHolder.indexOf(this) > -1)
    });

    // Click on preview container to bring up the full normal containers
    $('#main-section').on('click', '.preview-container', function () {
        var titleLog = $(this).find('.text-field')[0].textContent;
        console.log(titleLog);

        var container = $('<div/>');
        container.addClass('normal-container');
        container.addClass($(this)[0].id);
        container.attr('title', $(this).find('.title')[0].textContent);
        container.attr('tags', $(this).find('.tags')[0]);
        container.attr('notes', $(this).find('.text-field')[0].textContent);

        console.log($(container));

        var title = $('<div/>');
        title.addClass('title');
        title.attr('id', 'normal-container-title');
        title.text($(this).find('.title')[0].textContent);

        var author = $('<div/>');
        author.addClass('author');
        // Will change author text later
        author.text('Author');

        var tags = $('<div/>');
        tags.append($(this).find('.tags')[0]);

        var exit = $('<div/>');
        exit.addClass('exit');
        var exitButton = $('<button>');
        exitButton.addClass('exit-button');
        exitButton.text('X');
        exit.append(exitButton);

        var textField = $('<div/>');
        textField.addClass('text-field');
        var notes = $('<p>');
        notes.attr('id', 'normal-container-notes');
        notes.text($(this).find('.text-field')[0].textContent);
        textField.append(notes);

        var buttons = $('<div/>');
        buttons.addClass('button-list');
        var downloadButton = $('<button>');
        downloadButton.addClass('action-button download-button');
        downloadButton.text('DOWNLOAD');
        var editButton = $('<button>');
        editButton.addClass('action-button edit-button');
        editButton.text('EDIT');
        var deleteButton = $('<button>');
        deleteButton.addClass('action-button delete-button');
        deleteButton.text('DELETE');
        
        buttons.append(downloadButton);
        buttons.append(editButton);
        buttons.append(deleteButton);

        container.append(title);
        container.append(author);
        container.append(tags);
        container.append(textField);
        container.append(exit);
        container.append(buttons);

        $('#normal-section').append(container);
        $('#main-section').addClass('darken');
    });

    var addMessageCard = function (messageContent) {
        var message = $('<div/>');
        message.addClass('message');

        var heading = $('<h1>');
        heading.text("Message");

        var content = $('<p>');
        content.addClass('message-content');
        content.text(messageContent);

        message.append(heading);
        message.append(content)

        console.log(message);

        $('.message-feed').prepend(message);

    };

    // Normal container exit
    $('#normal-section').on('click', '.normal-container .exit-button', function () {
        console.log('Done with the card!');
        $('.normal-container').addClass('hide');
        $('#main-section').removeClass('darken');
    });

    // Normal container delete the card, removes the preview container
    $('#normal-section').on('click', '.normal-container .delete-button', function () {
        console.log(($(this).parent().parent())[0].classList[1]);
        var idToDelete = ($(this).parent().parent())[0].classList[1];
        // console.log($('#idToDelete').classList);
        $.ajax({
            url: "http://thiman.me:1337/matthew/" + idToDelete,
            type: "DELETE",
            success: function(response) {
                console.log("Card deleted!");
                $('#' + idToDelete).remove();
            },
        })

        $('.normal-container').addClass('hide');
        $('#main-section').removeClass('darken');
    });

    // Normal container edit the card, brings up edit container
    $('#normal-section').on('click', '.normal-container .edit-button', function () {
        console.log($(this).parent().parent()[0].innerHTML);
        // console.log($('#normal-container-tags')[0].children);
        console.log($('#normal-container-notes')[0].textContent);
        var title = $('#normal-container-title')[0].textContent;
        // var tags = $('#normal-container-tags')[0].children;
        var notes = $('#normal-container-notes')[0].textContent;

        $(editcontainer).removeClass('hide');
        $('#main-section').addClass('darken');
        $('#normal-section').addClass('hide');

        $('#new-card-title').attr('value', title);
        for (var i = 0; i < tags.length; i++) {
            console.log(tags[i]);
            $('#new-card-tags').prepend(tags[i]);
        }
        $('#new-card-notes').text(notes);

        // console.log(($(this).parent().parent())[0].classList[1]);
        // var idToPatch = ($(this).parent().parent())[0].classList[1];
        // // console.log($('#idToDelete').classList);
        // $.ajax({
        //     url: "http://thiman.me:1337/matthew/" + idToPatch,
        //     type: "PATCH",
        //     success: function(response) {
        //         console.log("Card patched!");
        //         $('#' + idToDelete).remove();
        //     },
        // })

    });

    $('.edit-container .exit-button').on('click', function () {
        console.log('Done with the card!');
        $(editcontainer).addClass('hide');
        clearEditContainerContent();
        $('#main-section').removeClass('darken');
    });

    $('.edit-container .cancel-button').on('click', function () {
        console.log('Done with the card!');
        $(editcontainer).addClass('hide');
        clearEditContainerContent();
        $('#main-section').removeClass('darken');
    });

    // Upload and create cards
    $('.edit-container .save-button').on('click', function () {
        var newCardTitle = document.querySelector('#new-card-title').value;
        var newCardNotes = document.querySelector('#new-card-notes').value;
        var newCardObj = {
            title: newCardTitle,
            notes: newCardNotes,
            tags: tagHolder
        };

        cards.push(newCardObj);
        console.log('New card created!');

        $.ajax({
            url: "http://thiman.me:1337/matthew",
            data: {
                title: newCardTitle,
                body: newCardNotes,
                tags: newCardObj.tags
            },
            type: "POST",
            traditional: true,
            success: function(response) {
                addPreviewCard(response.data);
            }
        });

        tagHolder = [];

        // Hide and empty the content of the card
        $(editcontainer).addClass('hide');
        clearEditContainerContent();

        // // Display the content in a preview container
        // addPreviewCard(newCardObj);

        // Remove the modal
        $('#main-section').removeClass('darken');

    });

    // Submit messages to the chat
    $('.chat .text-field .submit-button').on('click', function () {
        var content = document.querySelector('.chat textarea').value;
        addMessageCard(content);
        document.querySelector('.chat textarea').value = "";
        console.log(content);
    });

});