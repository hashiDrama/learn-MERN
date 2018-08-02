var http = require('http');
var fs = require('fs');
const qs = require('querystring');
var mongoClient = require('mongodb').MongoClient;
var url  = "mongodb://localhost:27017/";


http.createServer(function(req, res){
	if(req.url === '/login' && req.method == 'POST')
	{
		let body = '';
		req.on('data', d => {
			body += d;
		});
		req.on('end', () => {
			mongoClient.connect(url, {useNewUrlParser : true}, function(err, db){
				if(err) throw err;
				console.log("connected");
				var dbo = db.db("newDB");
				var collection = dbo.collection('users');
				let valBody = qs.parse(body);
				let val;
				console.log(valBody.email);
				collection.findOne({email: valBody.email}, function(err, result){
					console.log(result);
					if(err) throw err;

					else if(!result)
					{
						console.log("No record found");
						res.end(`
								<!doctype html>
								<html>
									<head><title>Sorry</title></head>
									<body>
										<h4>Sorry, you need to <a href="http://localhost:3000">register</a> first</h4>
									</body>
								</html>
							`);
					}
					else
					{
						val = result.email;
						console.log("email: "+ result.email);
						console.log("valid value: ");
						console.log(val);

						res.end(`
								<!doctype html>
								<html>
									<head><title>Sorry</title></head>
									<body>
										<h4>Welcome `+val+`</h4>
									</body>
								</html>
							`);	
					}
					
					db.close();
				});
			});
			
			
		});
	}
	else if(req.url === '/register' && req.method == 'POST')
	{
		let body = '';
		req.on('data', d => {
			body+= d;
		});
		req.on('end', () => {
			insertData(qs.parse(body));
			res.end(`
					<!doctype html>
					<html>
						<head><title>Ye to sach hai ki bhagwan hai</title></head>
						<body>
							<h1>You have successfully registered</h1>
						</body>
					</html>
				`);
		});
	}
	else
	{
		res.write(`
				<!doctype html>
				<html>
				<head><title>Ye to sach hai ki bhagwan hai</title></head>
				<body>
					<form method = "post">
						Email Id: <input type = "text" name="email" /><br />
						Password: <input type = "text" name = "pswrd" /><br />
						<button  formaction = "/register">Register</button>
						<button formaction = "/login">Login</button>		
					</form>
				</body>
				</html>
			`);
		res.end();
	}
	
}).listen(3000, function(){
	console.log('listening on 3000');
});

function insertData(body)
{
	mongoClient.connect(url, {useNewUrlParser : true}, function(err, db){
		if(err) throw err;
		var dbo = db.db("newDB");
		dbo.collection("users").insertOne(body, function(err, res){
			if(err) throw err;
			console.log("1 doc inserted");
			db.close();
		});
	});
}

/*function authenticateData(body)
{
	var val = '';
	mongoClient.connect(url, {useNewUrlParser : true}, function(err, db){
		if(err) throw err;
		var dbo = db.db("newDB");
		dbo.collection('users').findOne({email: body.email}, function(err, result){
			if(err) throw err;
			if(!result)
			{id += "No record found";
				console.log(val);
			}
			else
			{
				val += result.email;
				console.log("email: "+ result.email);
				console.log("valid value: " + val);
			}
			db.close();
		});
	});
}*/

