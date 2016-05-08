// AUTHOR : ChiaLing Wang cw2189@nyu.edu
/*This function maily focus on calculate the daily calories intake from user's profile 
 *and upload to our MySQL database 
*/
		function validateEmail(email) 
		{
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
		}
			
		function calculator(){
    		var bday = new Date(document.getElementById("bday").value).getTime();
          	var name = document.getElementById("name").value;
			var pw = document.getElementById("password").value;
			var email = document.getElementById("email").value;
			if (!validateEmail(email)){
				alert("Please make sure your email format !");
				return;
			}
			var cm = document.getElementById("height").value*12*2.54;
			var kg = document.getElementById("weight").value/2.2;
			var cur = new Date().getTime();
			
			var age =  (cur-bday)/ (31557600000);
			var cal = 0;
			var gender = document.getElementById("Gender");
		        	
			if(gender.options[gender.selectedIndex].value == "Female"){
				gender = "female";
				cal = 665.09+(9.56*kg)+(1.84*cm)-(4.67*age);
				
			}else{
				cal = 66.47+(13.75*kg)+(5*cm)-(6.75*age);
				
			}
			
			alert( "Your Daily Calories Intake Should Be : "+ cal.toFixed(2));
			
			
			
			$.ajax({
                        url: "http://websys3.stern.nyu.edu:7004/signup/",
                        type: "POST",
						
                        data :{ name: name , password: pw ,email: email, bday: bday/1000, age: age , gender: gender, weight: kg, height: cm , calories:cal.toFixed(2) },
						crossDomain: true,
                        success: function(response){
							
							if (response['error'] != null){
								 window.alert("This user already exist !");
							}
							//alert(response['name'])
							//alert(response['calories'])
						        //window.location = "http://websys3.stern.nyu.edu/websysS16GB/websysS16GB4/My_Meal_Diary/main.html?username="+response['name']+"&calory="+response['calories'];
window.location = "main.html?username="+response['name']+"&calory="+response['calories'];
		
							
                        }
                        });
			
			
		}
