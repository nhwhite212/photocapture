// AUTHOR : ChiaLing Wang cw2189@nyu.edu
/* This function mainly focus on check the login information 
and return the name and daily calories intake from our database
*/ 

function login(){


                        var pw = document.getElementById("pw").value;
                        var email = document.getElementById("id_email").value;
			
			
                        $.ajax({
                        url: "http://websys3.stern.nyu.edu:7004/login/",
                        type: "POST",

                        data :{ password: pw ,email: email },
                                                crossDomain: true,
                        success: function(response){
                                                    

                                                        if (response['error'] != null){
                                                                 alert("Please check your email / password !");
                                                                 return;
                                                        }
                                                        //alert("Hello  " + response['name']);
							//alert(response['calories'])
							//var url = "http://websys3.stern.nyu.edu/websysS16GB/websysS16GB4/My_Meal_Diary/main.html?username="+response['name']+"&calory="+response['calories'];
							//alert("http://websys3.stern.nyu.edu/websysS16GB/websysS16GB4/My_Meal_Diary/main.html?username="+response['name']+"&calory="+response['calories'])
							//setTimeout(function() {
 								 //window.location = "http://websys3.stern.nyu.edu/websysS16GB/websysS16GB4/My_Meal_Diary/main.html?username="+response['name']+"&calory="+response['calories'];
window.location = "main.html?username="+response['name']+"&calory="+response['calories'];

//"http://websys3.stern.nyu.edu/websysS16GB/websysS16GB4/My_Meal_Diary/main.html?username="+response['name']+"&calory="+response['calories'];
							//}, 2000);
							
                        }
                    });


                }

