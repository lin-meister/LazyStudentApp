/**
 * Created by M on 6/16/2016.
 */
$(document).ready(function() {
    var editcontainer = $('.edit-container');
    var cards = [
        {
            title: 'My new card',
            notes: 'This is my note'
        }
    ];

    var clearEditContainerContent = function() {
        document.querySelector('#new-card-title').value = "";
        document.querySelector('#new-card-notes').value = "";
        console.log('Card cleared!');
    }

    $('#add-card-button').on('click', function() {
        console.log('Adding a new card!');
        $(editcontainer).removeClass('hide');
    });

    $('.normal-container .exit-button').on('click', function() {
        console.log('Done with the card!');
        $('.normal-container').addClass('hide');
    });

    $('.edit-container .exit-button').on('click', function() {
        console.log('Done with the card!');
        $(editcontainer).addClass('hide');
        clearEditContainerContent();
    });
    
    $('.edit-container .cancel-button').on('click', function() {
        console.log('Done with the card!');
        $(editcontainer).addClass('hide');
        clearEditContainerContent();
    });

    $('.edit-container .upload-button').on('click', function() {
        var newCardTitle = document.querySelector('#new-card-title').value;
        var newCardNotes = document.querySelector('#new-card-notes').value;
        var newCardObj = {
            title: newCardTitle,
            notes: newCardNotes
        };
        console.log(newCardObj);
        cards.push(newCardObj);
        console.log(cards);
        console.log('New card uploaded!');
        $(editcontainer).addClass('hide');
        clearEditContainerContent();

    });


});