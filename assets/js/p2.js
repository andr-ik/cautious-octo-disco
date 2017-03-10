$(document).ready(function(){

	var init = function(){
		document.title = 'Практическая работа №2';
		$('.navbar-brand').text(document.title);
		$('h1').text('Выбираем мобильный телефон');
		$('.lead').text('Просто отвечайте на вопорсы и все будет хорошо!');
		$('.starter-template').append($("<a></a>").addClass('btn btn-primary btn-lg start').text('Начать'));
	}

	init();

	var tree = {
		name: {
			type: 'question',
			format: 'input',
			title: 'Введите Ваше имя'
		},
		os: {
			type: 'question',
			format: 'radio',
			title: 'Выберете операционную систему',
			values: [
				{
					type: 'check',
					key: 'ios',
					value: 'iOS'
				},
				{
					type: 'check',
					key: 'android',
					value: 'Android'
				},
			]
		},
		memory: {
			type: 'question',
			format: 'radio',
			title: 'Выберете размер памяти',
			values: [
				{
					type: 'check',
					key: '8',
					value: '8 ГБ'
				},
				{
					type: 'check',
					key: '16',
					value: '16 ГБ'
				},
				{
					type: 'check',
					key: '32',
					value: '32 ГБ'
				},
				{
					type: 'check',
					key: '64',
					value: '64 ГБ'
				},
				{
					type: 'check',
					key: '128',
					value: '128 ГБ'
				},
				{
					type: 'check',
					key: '256',
					value: '256 ГБ'
				},
			]
		},
		color: {
			type: 'question',
			format: 'radio',
			title: 'Выберете цвет',
			values: [
				{
					type: 'check',
					key: 'white',
					value: 'белый'
				},
				{
					type: 'check',
					key: 'red',
					value: 'красный'
				},
				{
					type: 'check',
					key: 'blue',
					value: 'синий'
				},
				{
					type: 'check',
					key: 'light-blue',
					value: 'голубой'
				},
				{
					type: 'check',
					key: 'pink',
					value: 'розовое золото'
				},
				{
					type: 'check',
					key: 'gold',
					value: 'золотой'
				},
				{
					type: 'check',
					key: 'silver',
					value: 'серебристый'
				},
				{
					type: 'check',
					key: 'space-gray',
					value: 'серый космос'
				},
				{
					type: 'check',
					key: 'black',
					value: 'черный'
				},
				{
					type: 'check',
					key: 'black-onyx',
					value: 'черный оникс'
				},
			]
		},
		brand: {
			type: 'question',
			format: 'radio',
			title: 'Выберете бренд',
			values: [
				{
					type: 'check',
					key: 'apple',
					value: 'apple'
				},
				{
					type: 'check',
					key: 'lg',
					value: 'lg'
				},
				{
					type: 'check',
					key: 'motorola',
					value: 'motorola'
				},
				{
					type: 'check',
					key: 'huawei',
					value: 'huawei'
				},
			]
		}
	};

	var steps = [
		//'name',
		'os',
		'brand',
		'memory',
		'color',
	];

	var data = [
		{
			title: 'iPhone 7',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['32','128','256'],
				color: ['pink','gold','silver','black','black-onyx']
			}

		},
		{
			title: 'iPhone 7 Plus',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['32','128','256'],
				color: ['pink','gold','silver','black','black-onyx']
			}

		},
		{
			title: 'iPhone 5s',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['16','32'],
				color: ['silver','space-gray']
			}

		},
		{
			title: 'iPhone 6',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['16','64'],
				color: ['gold','silver','space-gray']
			}

		},
		{
			title: 'iPhone 6 Plus',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['16','64','128'],
				color: ['silver','space-gray']
			}

		},
		{
			title: 'iPhone 6s',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['16','32','128'],
				color: ['pink','gold','silver','space-gray']
			}

		},
		{
			title: 'iPhone 6s Plus',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['16','32','128'],
				color: ['pink','gold','silver','space-gray']
			}

		},
		{
			title: 'iPhone SE',
			filter: {
				os: ['ios'],
				brand: ['apple'],
				memory: ['16','64'],
				color: ['pink','gold','silver','space-gray']
			}

		},
		{
			title: 'Nexus 4',
			filter: {
				os: ['android'],
				brand: ['lg'],
				memory: ['8','16'],
				color: ['black','white']
			}

		},
		{
			title: 'Nexus 5',
			filter: {
				os: ['android'],
				brand: ['lg'],
				memory: ['16','32'],
				color: ['black','white','red']
			}

		},
		{
			title: 'Nexus 6',
			filter: {
				os: ['android'],
				brand: ['motorola'],
				memory: ['32','64'],
				color: ['black','white','blue']
			}

		},
		{
			title: 'Nexus 5X',
			filter: {
				os: ['android'],
				brand: ['lg'],
				memory: ['16','32'],
				color: ['black','white','light-blue']
			}

		},
		{
			title: 'Nexus 6P',
			filter: {
				os: ['android'],
				brand: ['huawei'],
				memory: ['32','64','128'],
				color: ['black','white','silver','gold']
			}

		}
	];

	var current_step = steps.shift();
	var results = {};

	$('.start').on('click',function(){
		$(this).off('click').removeClass('start').addClass('next').text('Дальше');
		render(current_step);
		$(this).click(function(e){
			if($(e.target).hasClass('disabled')){
				return false;
			}
			var value = result(tree[current_step]['format']);
			if(value){
				results[current_step] = value;
				$(this).removeClass('disabled');
			}
			current_step = steps.shift();
			return next(current_step);
		});
	});

	var next = function(step){
		if(step){
			render(step);
		}else{
			$('.next').remove();
			$('.question').remove();
			var finds = filter();
			finds = finds.map(function(item){
				return item['title'];
			});
			$('.lead').html('<pre>'+JSON.stringify(finds)+'</pre>');
		}
	}

	var render = function(step){
		$('.lead').text(tree[step]['title']);
		$('.question').html(template(tree[step]['format'], tree[step]['values']));
		$('.question input').change(function(){
			$('.next').removeClass('disabled');
		});
		$('.next').addClass('disabled');
		$('label.disabled input').attr('disabled',true);
	}

	var template = function(format, values){
		var result = '';
		var good_values = [];
		if(values){
			var finds = filter();
			var good_values = [];
			finds.map(function(item){
				good_values = good_values.concat(item['filter'][current_step]);
			});
			good_values = unique(good_values);
		}
		switch(format){
			case 'input': result = '<input type="text" name="input" value="">'; break;
			case 'radio': result = values.map(function(item){
				return '<label class="'+(good_values.indexOf(item['key']) > -1 ? '' : 'disabled')+'""><input type="radio" name="radio" value="'+item['key']+'">'+item['value']+'</label>'
			}).join(''); break;
		}
		return '<div class="form-group">'+result+'</div>';
	}

	var result = function(format){
		var result = '';
		switch(format){
			case 'input': result = $('input[name=input]').val(); break;
			case 'radio': result = $('input[name=radio]:checked').val(); break;
		}
		return result;
	}

	var filter = function(){
		return data.filter(function(item){
			var find = true;
			for(var field in results){
				if(results.hasOwnProperty(field) && item['filter'][field]){
					find = find && item['filter'][field].indexOf(results[field]) > -1
				}
			}
			return find ? item : null;
		});
	}

	function unique(arr) {
		var result = [];
		nextInput:
		for (var i = 0; i < arr.length; i++) {
			var str = arr[i]; // для каждого элемента
			for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
				if (result[j] == str) continue nextInput; // если да, то следующий
			}
			result.push(str);
		}
		return result;
	}
});