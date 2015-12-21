var ssh2 = require("ssh2");
//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});
//For file handling
var fs = require('fs')



module.exports = function(app, passport) {
	//Upload - To upload to CUNIX server
    app.post('/change', upload.single('file1'), function(req,res) {
        console.log("---------FILES-------------");
        console.log(req.file);
        
        fs.rename(req.file.path, 'tmp/'+req.file.originalname, function (err) {
            if(err) res.send(500);
           req.body.section = ('00'+ req.body.section).slice(-3); console.log("/hmt/sirius1/viv0/data7/cu/arch/courses/"+req.body.type+"2/"+req.body.c_id+"/"+req.body.year+"/"+req.body.semester+"/"+req.body.section+"/"+req.file.originalname);
            //Create connectioon
              
                var c = new ssh2();
                c.on('ready', function () {

                    var putFile = function (local, remote) {
 
                        c.sftp(function (err, sftp) {
                            if (err) throw err;

                            sftp.fastPut(local, remote, {}, function (err) {
                                console.log(err ? "Could not deploy. " : "Deployed.");
                                //console.log(err);
                                sftp.end();
                                c.end();
                                if(err){
                                    res.send(err);
                                } else {
                                    res.send("Update Successful");
                                }
                                res.end();
                            });
                        });
                    };
                    
                    //
                    putFile("tmp/"+req.file.originalname, "/hmt/sirius1/viv0/data7/cu/arch/courses/"+req.body.type+"2/"+req.body.c_id+"/"+req.body.year+"/"+req.body.semester+"/"+req.body.section+"/"+req.file.originalname);
                    //Close the SSH connection
                    //c.end();
                    
                    
                });
                //On Invalid Credentials
                c.on('error',function (err) {
                    console.log( "- connection error: %s", err );
                    res.send('Invalid Credentials');
                    res.end();
                });
                //Connect to cunix server
                c.connect({
                    host: 'cunix.columbia.edu',
                    port:22,
                    username: req.body.user,
                    password: req.body.password
                });
                
        });

    });
	// TO render the upload page
    app.get('/upload', function(req, res){
        res.sendfile('public2/upload.html');
    });
    // Load the home page for others apart from api
    app.get('/*', function(req, res){
		
		res.sendfile('public/index.html');	
		
	});
	
};
