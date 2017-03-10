$(document).ready(function(){

	var template_step1 = function(){
		var result = "";

		var demo_f = localStorage.getItem('list.demo.f') || '';
		var demo_z = localStorage.getItem('list.demo.z') || '';

		var list = [
			{
				title: 'Введите целефую функцию:',
				key: 'f',
				type: 'input',
				prefix: 'F = ',
				demo: demo_f
			},
			{
				title: 'Введите ограничивающие условия:',
				key: 'z',
				type: 'textarea',
				demo: demo_z
			}
		];
		list.forEach(function(item){
			result += "<div class='lead'>"+item['title']+"<br/>"+createInput(item)+"</div>";
		});

		return "<div class='template_step1'>"+result+"</div>";
	}

	var template_run = function(){
		return "<div class='template_run'></div>";
	}

	var createInput = function(item){
		var result = '';
		switch(item['type']){
			case 'input': result = (item['prefix'] ? item['prefix'] : "") + "<input type='text' name='"+item['key']+"' value='"+(item['demo'] ? item['demo'] : "")+"'>"; break;
			case 'textarea': result = (item['prefix'] ? item['prefix'] : "") + "<textarea name='"+item['key']+"'>"+(item['demo'] ? item['demo'] : "")+"</textarea>"; break;
		}
		return result;
	}

	var init = function(){
		document.title = 'Практическая работа №1';
		$('.navbar-brand').text(document.title);
		$('h1').text('Решаем задачи симплекс-методом');
		$('.lead').text('Просто введите коэффициенты и все будет хорошо!');
		$('.starter-template').append($("<a></a>").addClass('btn btn-primary btn-lg reset').text('Редактировать').hide());
		$('.starter-template').append($("<div class='col-xs-12'><div class='template_data'></div></div>"));
		$('.starter-template').append(template_step1()).append(template_run());
		$('.starter-template').append($("<a></a>").addClass('btn btn-primary btn-lg start').text('Начать'));
		$('.starter-template').append($("<div class='col-xs-12'><div class='template_result'></div></div>"));
	}

	init();

	var m = 0;
	var n = 0;

	var c = [];
	var a = [];
	var b = [];

	var ak = null;
	var p_main = null;
	var p_col = null;
	var p_row = null;

	var original = {};
	var current = [];

	var current_p = [];
	var current_x = [];

	$('.start').on('click', function(){
		$(this).remove();
		$('.reset').show();
		
		var data_f = $('input[name=f]').val();
		var data_z = $('textarea[name=z]').val();

		localStorage.setItem('list.demo.f', data_f);
		localStorage.setItem('list.demo.z', data_z);

		$('.template_data').append($("<p>F = "+data_f+"</p>")).append($("<p class='system'>"+data_z.split('\n').join('<br/>')+"</p>")).show();

		parse_f(data_f, data_z);
		parse_z(data_f, data_z);

		original['a'] = a.slice();
		original['c'] = c.slice();
		original['b'] = b.slice();

		$('.template_step1').remove();
		run();
	});

	$('.reset').on('click', function(){
		location.reload();
	});

	var parse_f = function(data_f, data_z){
		data_f = data_f.replace(/\s+/g,'');
		data_f = data_f.match(/(\d*[,.]?\d+)?x(\d+)/g);
		data_f = data_f.map(function(item){
			return [parseInt(item.match(/x(\d+)/g)[0].replace(/x/g,'')), parseFloat(item.match(/(\d*[,.]?\d+)?/g)[0].replace(',','.')) || 1];
		});
		n = Math.max.apply(null, data_f.map(function(item){
			return item[0];
		}));
		m = data_z.split('\n').length;
		c.length = n;
		for(var i = 0; i < n + m; i++){
			if(!c[i]){
				c[i] = 0;
			}
			if(data_f[i]){
				c[data_f[i][0]-1] = data_f[i][1];
			}
		}
		return c;
	}
	
	var parse_z = function(data_f, data_z){
		data_z = data_z.split('\n');
		data_z = data_z.map(function(item){
			item = item.replace(/\s+/g,'');
			var a = item.match(/(\d*[,.]?\d+)?x(\d+)/g);
			a = a.map(function(item){
				return [parseInt(item.match(/x(\d+)/g)[0].replace(/x/g,'')), parseFloat(item.match(/(\d*[,.]?\d+)?/g)[0].replace(',','.')) || 1];
			});
			var b = parseFloat(item.match(/([><]?=)(\d*[,.]?\d+)/g)[0].match(/\d*[,.]?\d+/g)[0].replace(',','.'));
			return [a,b];
		});
		m = data_z.length;
		a.length = m;
		b.length = m;
		for(var i = 0; i < m; i++){
			if(!a[i]){
				a[i] = [];
			}
			for(var j = 0; j < n + m; j++){
				if(!a[i][j]){
					a[i][j] = 0;
				}
				if(data_z[i][0][j]){
					a[i][data_z[i][0][j][0]-1] = data_z[i][0][j][1];
				}
				if(j >= n){
					a[i][j] = i === (j - n ) ? 1 : 0;
				}
			}
			b[i] = data_z[i][1];
		}
		return [a, b];
	}

	var p_all = function(){
		var result = "";
		for(var i = 1; i <= n+m; i++){
			result += "<td>P"+i+"</td>"
		}
		return result;
	}

	var p_current = function(){
		var current = get_current();
		var result = "";
		for(var i = 0; i < current.length; i++){
			result += "<tr>";
			for(var j = 0; j < current[i].length; j++){
				if(isFloat(current[i][j])){
					current[i][j] = current[i][j].toFixed(3)
				}
				result += "<td data-id='a_"+i+"_"+j+"'>"+current[i][j]+"</td>";
			}
			result += "</tr>";
		}
		return result;
	}

	var p_footer = function(){
		return get_footer().map(function(item){
			if(isFloat(item)){
				item = item.toFixed(3)
			}
			return "<td>"+item+"</td>";
		}).join('');
	}

	var get_current = function(){
		var i = 0;
		return current_p.map(function(item){
			i++;
			return [].concat([i,"P"+item,c[item-1],b[i-1]], c.map(function(item, index){
				return a[i-1][index]
			}),get_q(i-1));
		});
	}

	var get_footer = function(){
		return [].concat(['','','',], get_f(), get_deltas(),['']);
	}

	var get_delta = function(index){
		var i = 0;
		return current_p.map(function(item){
			i++;
			return c[item-1]*a[i-1][index];
		}).sum() - c[index];
	}

	var get_deltas = function(){
		return c.map(function(item, index){
			return get_delta(index);
		});
	}

	var get_q = function(index){
		return b[index] / a[index][p_col];
	}

	var get_qs = function(){
		var i = 0;
		return current_p.map(function(item, index){
			i++;
			return get_q(i-1);
		});
	}

	var get_f = function(){
		return current_p.map(function(item, index){
			return b[index] * c[item-1];
		}).sum();
	}

	var get_id = function(i, j){
		return "a_"+i+"_"+(j + 4);
	}

	var simplex_table = function(){
		var simplex = $('#simplex_table').clone().text();
		simplex = simplex.replace('{{P_ALL}}', p_all());
		simplex = simplex.replace('{{P_CURRENT}}', p_current());
		simplex = simplex.replace('{{P_FOOTER}}', p_footer());

		simplex = $(simplex);

		simplex.find('[data-id='+get_id(p_row,p_col)+']').css('color', 'red');

		$('.template_run').append(simplex);
		simplex.show();
	}

	var result = function(){
		var argument_all = [];
		for(var i = 0; i < original.c.length; i++){
			argument_all.push(0);
		}
		current_p.forEach(function(item, index){
			argument_all[item-1] = b[index];
		});
		var argument_f = argument_all.map(function(item, index){
			var is_disabled = current_x.indexOf(index+1) === -1;
			if(isFloat(item)){
				item = item.toFixed(3);
			}
			return "<span class='"+(is_disabled ? 'disabled' : '')+"'>"+original.c[index]+"*"+item+"</span>";
		});
		var argument_x = argument_all.map(function(item, index){
			var is_disabled = current_x.indexOf(index+1) === -1;
			if(isFloat(item)){
				item = item.toFixed(3);
			}
			return "<span class='"+(is_disabled ? 'disabled' : '')+"'>X"+(index+1)+" = "+item+"</span>";
		});
		var f = get_f();
		if(isFloat(f)){
			f = f.toFixed(3);
		}
		var f = "F = "+argument_f.join(" + ")+" = "+f;
		$('.template_result').append($("<p>"+f+"</p><p class='system'>"+argument_x.join('<br/>')+"</p>")).show();
	}

	var is_optimum = function(iteration){
		if(iteration !== 0){
			update();
		}

		var deltas = get_deltas();
		ak = deltas.slice(0).sort(function(a,b){
  			return a - b;
		});
		p_col = deltas.indexOf(ak[0]);
		var qs = get_qs();
		//console.log('qs', qs);
		qk = qs.slice(0).sort(function(a,b){
  			return a - b;
		});
		p_row = qs.indexOf(qk[0]);

		// todo вспомнить что это
		if(p_row === -1 || p_col === -1){
			console.log(a);
		}

		p_main = a[p_row][p_col];

		// можно завершить программу, если задача не может быь решена

		// если все qs >= 0 то план оптимален
		// если ak[0] < 0 && qk[qk.length-1] > 0 то продолжаем
		// если ak[0] < 0 && qk[qk.length-1] <= 0 то alert();

		/*
		console.log('ak', ak);
		console.log(ak.reduce(function(previousValue, currentValue){
				return previousValue && currentValue >= 0;
			}, true) ? true : false);
		*/

		var result = {
			status: ak.reduce(function(previousValue, currentValue){
				return previousValue && currentValue >= 0;
			}, true) ? true : false,
			error: ak[0] < 0 && ak[ak.length-1] <= 0
		};
		console.log(result);
		return result;
	}

	var update = function(){
		b[p_row] = b[p_row] / p_main;
		for(var i = 0; i < a[p_row].length; i++){
			a[p_row][i] = a[p_row][i] / p_main;
		}
		current_p[p_row] = p_col + 1;

		current_copy = current_p.slice();
		current_copy.splice(current_copy.indexOf(current_p[p_row]), 1);
		current_copy.map(function(item){
			var row = current_p.indexOf(item);
			var col = a[row][p_col];
			for(var i = 0; i < a[row].length; i++){
				a[row][i] = a[row][i] - a[p_row][i] * col;
			}
			b[row] = b[row] - b[p_row] * col;
		});
	}

	// todo 

	// внедрить возможность использовать min или max

	// посмотреть на м метод
	// и задание в общем

	// добавить коментарии в код

	// оттестировать

	var iteration = 0;
	var run = function(){
		var i = 0;
		var is_first = true;

		for(var i = 1; i <= original.c.length; i++){
			current_p.push(i);
		}
		current_x = current_p.splice(0, n);

		while(!(optimum = is_optimum(iteration)).status){
			simplex_table();
			iteration++;
		}
		if(optimum.error){
			alert('error');
		}
		simplex_table();
		result();
	}
});