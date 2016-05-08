var calCounterApp = angular.module('calCounterApp', ['LocalStorageModule']);

calCounterApp.controller('calCounterCtrl', ['$scope','localStorageService','$http', 
	function ($scope,lsService,$http) {

		$scope.diet = lsService.get("diet") || [];
		$scope.storedfood_local = lsService.get("storedfood") || [];
		$scope.storedfood_server = [];
		$scope.activedate = new Date();
		$scope.selectedfood = null;
		$scope.selectedStored = null;
		$scope.foodunit = "-";
		$scope.foodamt = 1;
		$scope.foodamttotal = 100;
		$scope.entrytype = 'direct';
		$scope.foodcat = 'Misc';

		$scope.activeday = getActiveDay();

		$http.get('/public/stored-food.json').success(function(data) {
			$scope.storedfood_server = data;
		});

		$scope.changeDate = function(difference){
			$scope.activedate.setDate($scope.activedate.getDate() + difference);
			$scope.activeday = getActiveDay();
		}

		$scope.storedfood = function(){
			return $scope.storedfood_server.concat($scope.storedfood_local);
		}
		$scope.addFood = function() {
			//var slabel = foodcat.value;
			//alert(slabel);
			var cal = calcRelativeCalories($scope.entrytype, document.getElementById("foodcal").value, $scope.foodamttotal, $scope.foodamt);
			
			if ($scope.selectedfood && !$scope.selectedStored)
			{
				$scope.selectedfood.name = $scope.foodname;
				alert(selectedfood.name);
				$scope.selectedfood.cal = cal;
				$scope.selectedfood.unit = $scope.foodunit;
				$scope.selectedfood.amt = $scope.foodamt;
				$scope.selectedfood.amttotal = $scope.foodamttotal;
				$scope.selectedfood.caltotal = $scope.foodcal;
				$scope.selectedfood.type = $scope.entrytype;
				$scope.selectedfood.cat = $scope.foodcat;
			}
			else
			{
				$scope.activeday.eaten.push({
					name:document.getElementById("foodname").value, 
					cal:cal,
					unit:$scope.foodunit, 
					amt:$scope.foodamt,	
					caltotal:$scope.foodcal,
					amttotal:$scope.foodamttotal,
					type:$scope.entrytype,
					cat:$scope.foodcat,
				});
			}
			$scope.resetFood();
			maketotal();
			// alert(foodname.value);
			updateLocalStorage();
		}
		$scope.addFoodFromStored = function(food)
		{

			$scope.activeday.eaten.push({
				name:food.name, 
				cal:food.cal,
				unit:food.unit, 
				amt:food.amt,
				caltotal:food.caltotal,
				amttotal:food.amttotal,
				type:food.type,	
				cat:food.cat,				
			});
			maketotal()
			updateLocalStorage();
		}
		$scope.saveFoodToStored = function(){
			
			if ($scope.selectedfood && $scope.selectedStored)
			{
				$scope.selectedfood.name = document.getElementById("foodname").value;
				$scope.selectedfood.cal = cal;
				$scope.selectedfood.unit = $scope.foodunit;
				$scope.selectedfood.amt = $scope.foodamt;
				$scope.selectedfood.amttotal = $scope.foodamttotal;
				$scope.selectedfood.caltotal = $scope.foodcal;
				$scope.selectedfood.type = $scope.entrytype;
				$scope.selectedfood.cat = $scope.foodcat;
			}
			else
			{
				$scope.storedfood_local.push({
					name:document.getElementById("foodname").value, 
					cal: calcRelativeCalories($scope.entrytype, document.getElementById("foodcal").value, $scope.foodamttotal, $scope.foodamt),
					unit:$scope.foodunit, 
					amt:$scope.foodamt,	
					caltotal:$scope.foodcaltotal,
					amttotal:$scope.foodamttotal,
					type:$scope.entrytype,
					cat:$scope.foodcat,							
				});
			}
			$scope.resetFood();
			lsService.add("storedfood",angular.toJson($scope.storedfood_local));
		}		
		$scope.resetFood = function()
		{
			$scope.foodname = '';
			$scope.foodcal = '';
			$scope.foodamt = 1;
			$scope.foodamttotal = 1;
			$scope.foodunit = '-';
			$scope.entrytype = 'direct';
			$scope.foodcat = 'Misc'
			$scope.selectedfood = null;
			$scope.selectedStored = null;
		}		
		$scope.editFood = function(food, is_stored){
			$scope.selectedStored = is_stored;
			$scope.selectedfood = food;
			$scope.foodcal = calcRelativeCalories(food.type, food.cal, food.amttotal, food.amt);
			$scope.foodname = food.name;
			$scope.foodunit = food.unit;
			$scope.foodamt = food.amt;
			$scope.foodamttotal = food.amttotal;
			$scope.entrytype = food.type;
			$scope.foodcat = food.cat;
		}		
		$scope.removeFood = function(food){
			var id = $scope.activeday.eaten.indexOf(food);
			if (id<0)
			{
				alert("Error:Food not found.");
			}
			$scope.activeday.eaten.splice(id,1);
			maketotal();
			updateLocalStorage();
		}
		$scope.removeStoredFood = function(food){
			var id = $scope.storedfood_local.indexOf(food);
			if (id<0)
			{
				alert("Error:Food not found.");
			}
			$scope.storedfood_local.splice(id,1);
			lsService.add("storedfood",angular.toJson($scope.storedfood_local));
		}
		$scope.clearDay = function()
		{
			$scope.activeday.eaten = {};
			maketotal()
			updateLocalStorage();
		}
		$scope.clearAll = function()
		{
			$scope.diet = [];
			$scope.activeday = getActiveDay();
			$scope.storedfood_local = [];
			updateLocalStorage();
			lsService.add("storedfood",angular.toJson($scope.storedfood_local));
		}
		$scope.makeFoodLabel = function(food){
			var unit = food.unit=="-" ? "" : food.unit;

			// alert(food.name);
			//alert(food.cat);
			// alert(food.cal);


			return food.name + " (" + food.amt + " " + unit + ")" + " -------- " + food.cat;
		}
		$scope.seelocalstorage = function()
		{
			return lsService.get("diet");
		}

		function parseDate(input) {
			var parts = input.split('.');
			return new Date(Date.UTC(parts[0], parts[1]-1, parts[2],0,0,0));
		}
		function updateLocalStorage()
		{
			lsService.add("diet",angular.toJson($scope.diet));
		}
		function getActiveDay()
		{
			var found = false;
			var shown_day = $scope.activedate;
			for (var i = $scope.diet.length - 1; i >= 0; i--) {
				if ($scope.diet[i].date == shown_day)
				{
					found= true;
					return $scope.diet[i];
					break;
				}
			};
			if (!found)
			{
				$scope.diet.push({date:shown_day, total:0, eaten:[]});
				return $scope.diet[$scope.diet.length - 1];
				updateLocalStorage();
			}
		}
		function maketotal() {
			var cal = 0;
			angular.forEach($scope.activeday.eaten, function(food) {
				cal = cal + parseInt(food.cal);
			});
			$scope.activeday.total = cal;
		};
		function calcRelativeCalories(type, cal, amttotal, amteaten)
		{
			if ($scope.entrytype == 'relative' )
			{
				return (cal / amttotal) * amteaten;
			}else{
				return cal;
			}
		}		

		$scope.generateReport = function(){
			var report=[],max=0;
			for (var i = $scope.diet.length - 1; i >= 0 && report.length <30; i--) {
				var report_date = parseDate($scope.diet[i].date);
				if ($scope.diet[i].total>max){
					max = $scope.diet[i].total;
				}
				report.push({date:report_date,total:$scope.diet[i].total});
			};
			//Ok to sort by "string dates", because they are in sortable form from Date conversion above
			report.sort(function(a,b){return b.date-a.date});
			for (var i=report.length-1;i>=0; i--)
			{
				var calc = (report[i].total / max) * 100;
				report[i].style = {right:(i*40) + "px",height:calc + "%"};
			}
			return report;
		}

		function reverseRelativeCalories(type, cal, amttotal, amteaten)
		{
			if ($scope.entrytype == 'relative' )
			{
				return (cal / amteaten) * amttotal;
			}else{
				return cal;
			}
		}	
	}]);

calCounterApp.config(['localStorageServiceProvider', 
	function(localStorageServiceProvider){
  		localStorageServiceProvider.setPrefix('cc');		
	}]);


