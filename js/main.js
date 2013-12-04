window.order = {
    items: [],
    total: 0
};

var Order = function () {
    this.total = 0;
    this.items = [];

    this.AddItem = function (data) {
        this.items.push(data);
        this.total = this.total + data.price;
    };

    this.GetTotal = function () {
        return this.total;
    };

    this.GetList = function () {
        var list = "";
        for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];

            if(parseInt(item.count) > 1 ){
                var htmlstring = '<li><span class="multiplier">' + item.count + '</span>';
            } else {
                var htmlstring = "<li>"
            }
            list = list + htmlstring + '<span class="name">' + item.name + '</span><span class="price pull-right">'+ item.price +'€</span></li>';
        };
        return list;
    };

    this.GetStacks = function () {
        var stacks = "";
        for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];

            for(var k = parseInt(item.count) - 1 ; k >= 0; k--){
                stacks = stacks + '<div class="stack-item"><span class="handler"></span>'+item.name+'<span class="pull-right">'+item.price+' €</span></div>';
            }

        };
        return stacks;
    };
};

$(function() { // <-- when docment is ready the following is executed
    $('html').removeClass('no-js');
    
    var myOrder = new Order; 
   
    
    // resize layout function that is called everytime window is resized
    var resizeLayout = function(){
	     
		 $('#main-content').css('height', ($(window).outerHeight(true) - 80) );
         $('.wide-content').css('height', ($(window).outerHeight(true) - 80) );
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

     var updateNav = function(add,string) {
        if(typeof string == "undefined"){ var string = null; }
        if(add){
            $("#left-nav")
                .children('li:not(.home)').remove()
                .end().append(string);

        } else {
            $("#left-nav").find('li:not(.home)').remove();
        }
    }
    
    //** show the language menu
    $('.has-dropdown').on('click', function(e){
	    e.preventDefault();
		$(this).children('ul').slideToggle();
	    
    });


    // open modal on every .open-modal class, uses the text buttin
    $('body').on('click','.open-modal' , function(e){
        e.preventDefault();
        var $this = $(this),
            $modal = $('#small-modal');        

        if ($this.attr('data-close') == "false") {
            $modal.children('button').hide();
        };

        $('#overlay').fadeIn(200);
        $modal.children("p").text($this.attr('data-text'))
        .end().fadeIn(300);

    });

    // open the main windoq
    $("#select-menu").on('click', function(){
        $("#init-screen").hide();
        $("#side-bar").show();
        $("#main-content").show();
        $('#left-nav').append('<li class="home"><a id="home-btn" href="#">Home</a></li>');
        getList('food/main-menu.html');
    });

    // temp for testing purposes
    $('#order-bill-btn').on('click', function(e){
        e.preventDefault();
        updateNav('add',"<li><span>Payment</span></li>");
        $('#payment-content').show();
        $('#main-content').hide();
        $('#side-bar').hide();
    });

    $("body").on('click', ".payment-back", function(e){
        e.preventDefault();
        $('#payment-split-equal-content').hide();
        $('#payment-split-by-item-content').hide();
        $('#payment-content').show();
        var string = "<li><span>Payments</span></li>"
        updateNav("add",string);
    });

    // temp for testing purposes - payment split equal screen
    $('body').on('click',".split-equal-section", function(e){
        e.preventDefault();
        var total = Math.floor(myOrder.GetTotal()*100)/100/2;
        $("#equally-result").text(total)
        $('#equally-total').text(myOrder.GetTotal());
        $('#payment-split-equal-content').show();
        $('#payment-content').hide();
        var string = "<li><a href='#' class='payment-back'>Payments</a></li><li><span>Split Equally</span></li>"
        updateNav("add",string);
    });

    $("body").on('click','.split-by-item-section', function(){
        $('#payment-split-by-item-content').show();
        $('#payment-split-equal-content').hide();
        $('#payment-content').hide();
        var string = "<li><a href='#' class='payment-back'>Payments</a></li><li><span>Split by Item</span></li>";
        
        updateNav("add",string);
        var stacks = myOrder.GetStacks();
        if(stacks){
            $("#unsorted").append(stacks);
            setTimeout(function() {
                $( "#unsorted, .drop-area" ).sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
            }, 200);
        }
    });



    // listener for "refresh-basket event"
    $(document).on('refresh-basket', function(){
    	$('#total-amount').text(0);
        var $basket = $('#basket-area'),
            $guide = $("#empty-guide");
        if( $basket.children().length > 0 ){
           
            $guide.hide();
            $basket.show();
            $("#place-order-btn").removeAttr('disabled');

            $basket.find('article.single-item').each(function(total) {
                var $this = $(this),
                    price = parseFloat($this.attr('data-price').replace(',','.')),
                    count = parseFloat($this.attr('data-count')),
                    total = parseFloat($("#total-amount").text());
                var temp = (total + (price * count))*100;
                var result = Math.round(temp + (myOrder.GetTotal()*100) ) / 100 ;
                $('#total-amount').text( result );
            });

        
        } else {
            $basket.hide();
            $guide.show();
            $("#place-order-btn").attr('disabled', 'disabled');
           
            $('#total-amount').text(myOrder.GetTotal());
        }


    });

    $("#recent-title").on('click', function(){
        //codehere
        $("#recent-orders ul").slideToggle();
        $("#recent-orders").toggleClass('open');
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

    $("body").on('click','#close-modal', function(e) {
        e.preventDefault();
        $(this).parent().fadeOut(300);
        $("#overlay").fadeOut(400);
    })

    // open modal function
    var getList = function(uri){
        $.ajax({
             url: uri,
             success: function(data){
                var $content = $('#main-content');
                 $content.empty().append(data)
                 $content.show();
             }
        });
    };



    $('body').on('click','#home-btn', function(e) {
        e.preventDefault();
        getList('food/main-menu.html');
        updateNav(false,null);
    });

    $('body').on('click','#maincourse', function(e) {
        e.preventDefault();
        getList('food/main-courses/main-courses.html');
        updateNav("add","<li><span>Main Courses</span></li>");
    });

    //hook to open list event 
    $("body").on('click','.open-list', function(){
        updateNav("add",$(this).attr('data-nav'));
        getList($(this).attr('data-uri'));
    });

    // ajaxing the information from the burger file that is is in dataurl of the article
    $('body').on('click','.show-info', function(e) {
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
	   		setTimeout(function() {
                $(document).trigger('refresh-basket');
            }, 400); 
	    }

	    	

    });

    // on add in modal do following
    $('#add-item-modal').on('click', function () {
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
    	setTimeout(function() {
             $(document).trigger('refresh-basket');
         }, 500); 
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
		setTimeout(function() {
             $(document).trigger('refresh-basket');
         }, 400); 
	     
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


    /* placing the order */

    $("#place-order-btn").on('click', function(e){
        e.preventDefault();
        var $basket = $("#basket-area"),
            $list = $('#recent-orders').find('ul'),
            elems = $basket.find('article.single-item'),
            count = elems.length;
        
        // loop the elements in the basket
        elems.each(function() {
            var $this = $(this);
            
            myOrder.AddItem({
                name: $this.attr("data-name"),
                count: parseInt($this.attr("data-count")),
                price: parseFloat($this.attr("data-price"))
            });
            // after the last round
            if (!--count){
                $basket.empty();
                $list.empty().append(myOrder.GetList());
                $(document).trigger('refresh-basket');
                $("#order-bill-btn").removeAttr('disabled');
            };
        });

    });




    //***** PAYMENTS *** //

    $("#payment-split-equal-content").on('click', '.increase', function(e){
        e.preventDefault();
        var $this = $(this),
            total = parseFloat( $this.prev('#equally-total').text() ),
            $result =  $('#equally-result'),
            pieces = parseInt( $('#equally-pieces').text() ) + 1;

        $("#equally-pieces").text(pieces);
        var result = total / pieces * 100;
        
        $result.text( Math.floor(result)/100 );
        if(pieces >= 8 ){
            $this.attr('disabled', "disabled");
        }
        if(pieces > 2 ){
            $this.next().removeAttr('disabled');
        }
        var string = "img/circle/" + pieces + ".png";
        $('#payment-equal-circle').attr('src', string);
    });

    $("#payment-split-equal-content").on('click', '.decrease', function(e){
        e.preventDefault();
        var $this = $(this),
            total = parseFloat( $this.prev().prev().text() ),
            $result =  $('#equally-result'),
            pieces = parseInt( $('#equally-pieces').text() ) - 1;
        $("#equally-pieces").text(pieces);
        var result = total / pieces * 100;
        
        $result.text( Math.floor(result)/100 );
        if(pieces < 8 ){
            $this.prev().removeAttr('disabled');
        }
        if(pieces <= 2){
            $this.attr('disabled', 'disabled')
        }
        var string = "img/circle/" + pieces + ".png";
        $('#payment-equal-circle').attr('src', string);
    });

    /** STACKS **/

    $("#spawn-a-stack").on('click', function() {
        $( "#unsorted, .drop-area" ).sortable( "destroy" );
        $("#stacks").append('<div class="stack"><div class="drop-area darkest-gray connectedSortable"> </div><div class="footer light-blue"><span>STACK</span> <div class="tools pull-right"><button  class="stack-delete darker-text"><i class="fa fa-trash-o"></i></button><span>TOTAL: <span class="stack-total">0.00</span> €</span></div> </div></div>');
        setTimeout(function() {
            $( "#unsorted, .drop-area" ).sortable({
                connectWith: ".connectedSortable"
            }).disableSelection();
        }, 300);
    });

    $('body').on('click', '.stack-delete', function() {
        var $this = $(this);
        var elements = $this.closest('div.stack').children('.drop-area').children('div');
        $("#unsorted").append(elements);
        $this.closest('div.stack').remove();
   
    });

});
