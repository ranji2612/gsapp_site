module.exports = function(app, passport) {
	
	// Load the home page for others apart from api
	app.get('/*', function(req, res){
		
		res.sendfile('public/html/home.html');	
		
	});
	
};
