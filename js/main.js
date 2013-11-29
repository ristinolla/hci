$(function() { // <-- when docment is ready the following is executed
    $('html').removeClass('no-js');
    
    //$('#container').css('height', window.outerHeight);
   
    
    // resize layout function that is called everytime window is resized
    var resizeLayout = function(){
	     
	     $('#main-content').css('width', (window.outerWidth - 342) );
		 $('#main-content').css('height', ($(window).outerHeight(true) - 80) );
		 $('#side-bar').css('height', ($(window).outerHeight(true) - 80) );
		 $('#basket-area').css('height', ($(window).outerHeight(true) - 292) );
		 $('#overlay').css('height',$(window).outerHeight(true)).css('width', $(window).outerWidth(true));
    };
    resizeLayout();
    //is triggered everytime window is resized
    $(window).resize(function(){
    	// timeout to limit the resize function to be called just in 400ms intervals
	    setTimeout(resizeLayout, 200);
    });
    
    //** show the language menu
    $('.has-dropdown').on('click', function(e){
	    e.preventDefault();
		$(this).children('ul').slideToggle();
	    
    });


    // listener for "refresh-basket event"
    $(document).on('refresh-basket', function(){
    	console.log( 'sss' );


    });
    

    // open modal function
    var openModal = function(uri){
	    $.ajax({
	    	 url: uri,
	    	 success: function(data){
		    	 var $modal = $("#info-modal");
		    	 $("#overlay").show();;
		    	 
		    	 $modal.children('#modal-content').empty().append(data);
		    	 $modal.show();
		    	 
	    	 }
	    });
    };

    // ajaxing the information from the burger file that is is in dataurl of the article
    $('body').on('click','.show-info', function() {
    	e.preventDefault();
    	var $item = $(this).parent().parent(); //select the article.single-item -tag
    	openModal($item.attr('data-uri'));
    });


    $('#close-info-modal').on('click',function () {
    	$(this).parent().parent().fadeOut(300);
    	$('#overlay').fadeOut(600);
    });
    
    // on radio change do this
    $('#modal-content').on('change', 'fieldset input[type="radio"]', function (e) {
    	var $article = $(this).closest('article.single-item'),
    		$this = $(this),
    		name = 'data-' + $this.attr('name');
  	  	$article.attr(name, $this.val());
    });
    
    // ** on checkbox change save the values to article data-attributes
    $('#modal-content').on('change','fieldset input[type="checkbox"]', function () {
    	var $this = $(this),
    		$article = $this.closest('article.single-item'),
    		name = 'data-' + $this.attr('name'),
    		values = [];
    	$this.parent().children(":checkbox:checked").each(function() {
    		values.push($(this).val());
    	});
		$article.attr(name, values); 

    });
    
    //** adding via add button thing to the basket
    $("body").on('click','.add-item', function(e){
	    e.preventDefault();
	    var $item = $(this).parent().parent(),
	    	template = $('#basket-item-template').text(),
	    	$article = $(this).closest('article.single-item');
	    
	    if($article.attr('data-modal') == "true"){
	    	e.preventDefault();
	    	openModal($item.attr('data-uri'));
	    } else {
		   

		    var data = {
		    	name : $article.data('name'),
	    		side_dish : null,
	    		diets : null,
	    		price : $article.data('price')
		    };
		    var string = _.template(template, data);
		    $('#basket-area').append(string);
	   		$(document).trigger('refresh-basket');
	    }

	    	

    });

    // on add in modal do following
    $('#add-item-modal').on('click', function () {
    	console.log( "lll" );
    	var $article = $(this).parent().parent().find('article.single-item'),
    		$target = $('#basket-area');
    		template = $('#basket-item-template').text(); 
  		
  		var diets = $article.data('diet');
  		if(diets != null){
  			diets = diets.split(',');
  		}

    	var data = {
    		name : $article.data('name'),
    		side_dish : $article.data('side-dish'),
    		diets : diets,
    		price : $article.data('price')
    	};

    	var string = _.template(template, data);
    	$target.append(string);
    	$(document).trigger('refresh-basket');
    	$(this).parent().parent().fadeOut(300);
    	$('#overlay').fadeOut(600);
    });
    
    //** listen the click event of delete button
    $('body').on('click','.delete-item',function(e){
	     e.preventDefault(); // PREVENT THE DEFAULT FUNCTIONALITY (important on links)
	     var $this = $(this); // save the current button as variable, to speed things up
		 $this.parent().fadeOut(300,function(){
			 $(this).remove();
		 });
		 $(document).trigger('refresh-basket');
	     
    });

    // INCREASE BUTTTONS
    $('#basket-area').on('click', '.increase', function() {
    	var $this = $(this),
    		count = parseInt($this.next().text());
    	$this.next().text(count + 1);
    	$this.closest('article.single-item').attr('data-count', count +1);
    	$(document).trigger('refresh-basket');
    	if(count + 1 > 1){
    		$this.siblings('button').removeAttr('disabled');
    	}
    });

    // DECREASE BUTTONS
    $('#basket-area').on('click', '.decrease', function() {
    	var $this = $(this),
    		count = parseInt($this.prev().text());
    	$this.prev().text(count - 1);
    	$this.closest('article.single-item').attr('data-count', count - 1);
    	$(document).trigger('refresh-basket');
    	if(count - 1 == 1){
    		$this.attr('disabled', 'disabled');
    	}
    });

   
});
