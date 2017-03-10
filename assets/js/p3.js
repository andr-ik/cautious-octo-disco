$(document).ready(function(){

	var init = function(){
		document.title = 'Практическая работа №3';
		$('.navbar-brand').text(document.title);
		$('h1').text('Изучаем преобразование ХАФА');
		$('.lead').text('Просто загрузите изображение и все будет хорошо!');
		$('.starter-template').append($("<div class='form-group'></div>").append($("<input type='file'></a>").addClass('image')));
		$('.starter-template').append($("<div class='row'><div class='col-xs-6 original'></div><div class='col-xs-6 result'></div></div>"))
	}

	init();

	var loader = $('<div class="loader">');

	$(window).resize(function(){
		console.log('resize', $('.original').height());
		$('.result').height($('.original').height());
	});

	$('.image').change(function(e){
		if (e.target.files && e.target.files[0]){
			var reader = new FileReader();
			$('.original').html(loader);
			reader.onload = function(e){
				$('.original').html('').append($('<img>').attr('src', e.target.result));
				$('.result').height($('.original').height()).html(loader);
				start_hafa();
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	});

	var start_hafa = function(){
		var fd = new FormData;
		var url = 'http://127.0.0.1:8126/upload';
		fd.append('image', $('.image').prop('files')[0]);
		$.ajax({
	        url: url,
	        data: fd,
	        processData: false,
	        contentType: false,
	        type: 'POST',
	        success: function(data){
	        	$('.result').html('').append($('<img>').attr("src", data));
	        }
	    });
	}
});