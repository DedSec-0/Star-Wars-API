
(function(){
	run(generator).catch(function(err){
            console.log(err);
      	});
})();

function *generator() {
	var Ids = [2,75,22,74,65,3,59,58,63,28,29,39,10];
	var Ships = [];
	var Ship1 = 0;
	var Ship2 = 0;
	var option_1 = document.getElementById('dropdown1');
	var option_2 = document.getElementById('dropdown2');
	var button = document.getElementById('Compare');

	function createOption(name){
		var option = document.createElement('option');

        option.text = temp.name;
        return option;
	}

	for (var i = 0; i < Ids.length; i++) {
		var response = yield fetch('https://swapi.co/api/starships/' + Ids[i] + '/');
		var temp = yield response.json()

		Ships.push(temp);
		option_1.add(createOption(temp.name), i);
		option_2.add(createOption(temp.name), i);
	}

	option_1.addEventListener('change', function () {
		Ship1 = this.selectedIndex;
	});

	option_2.addEventListener('change', function () {
		Ship2 = this.selectedIndex;
	});

	button.addEventListener('click', function(){
		populateData(Ships[Ship1], Ships[Ship2])
	});
}

function populateData(Data1, Data2){
	document.getElementById('Name1').innerHTML = Data1.name;
	document.getElementById('Name2').innerHTML = Data2.name;

	function compareShips(quality) {
		var firstShip = document.getElementById(quality + "1");
        var secondShip = document.getElementById(quality + "2");

       	firstShip.innerHTML = Data1[quality];
        secondShip.innerHTML = Data2[quality];
            
            var first = parseInt(Data1[quality]);
            var second = parseInt(Data2[quality]);
            
            if (first > second) {
                firstShip.setAttribute("style", "background-color: red;");
            }
            else if (second > first) {
                secondShip.setAttribute("style", "background-color: red;");
            }
	}

	var qualities = [ "cost_in_credits", "max_atmosphering_speed", "cargo_capacity", "passengers" ];

    for (var quality of qualities) {
    	compareShips(quality);
    }

}

function run(genFunc) {
	var genObj = genFunc();

	function iterate(yieldedVal) {
		if(yieldedVal.done)
			return Promise.resolve(yieldedVal.value);

		return Promise.resolve(yieldedVal.value)
			.then(x => iterate(genObj.next(x)))
			.catch(x => iterate(genObj.throw(x)));
	}

	try {
		return Promise.resolve(iterate(genObj.next()));
	}
	catch (err) {
		return Promise.reject(err);
	}
}