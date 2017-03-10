$(document).ready(function(){
	
	var scripts = {
		'1': 'assets/js/p1.js',
		'2': 'assets/js/p2.js',
		'3': 'assets/js/p3.js'
	};

	var load = function(i){
		if(!i){
			i = localStorage.getItem('index') || 1;
		}
		if(scripts[i]){
			var script = document.createElement('script');
			script.src = scripts[i];
			document.body.appendChild(script);
		}
	}

	$('.menu-item').click(function(e){
		var index = $(e.target).data('index');
		localStorage.setItem('index',index);
		e.preventDefault();
		location.reload();
	});

	$('.navbar-brand').click(function(){
		location.reload();
	});

	load();
});

Array.prototype.sum = function(){
	return this.reduce(function(sum, item){
		return sum + item;
	}, 0)
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}