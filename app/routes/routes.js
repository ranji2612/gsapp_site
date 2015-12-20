var ssh2 = require("ssh2");
//Multer - file upload
var multer  = require('multer')
var upload = multer({dest:'tmp/'});
//For file handling
var fs = require('fs')



module.exports = function(app, passport) {
	//Upload
    app.post('/change', upload.single('file1'), function(req,res) {
        console.log("---------FILES-------------");
        console.log(req.file);
        
        fs.rename(req.file.path, 'tmp/'+req.file.originalname, function (err) {
            if(err) res.send(500);
            console.log('tmp/'+req.file.originalname);
            //Create connectioon
              
                var c = new ssh2();
                c.on('ready', function () {

                    var putFile = function (local, remote) {
 
                        c.sftp(function (err, sftp) {
                            if (err) throw err;

                            sftp.fastPut(local, remote, {}, function (err) {
                                console.log(err ? "Could not deploy. " : "Deployed.");
                                sftp.end();
                                c.end();
                                res.json({'status':'success','message':'Uploaded Successfully'});
                                
                            });
                        });
                    };
                    
                    //
                    putFile("tmp/"+req.file.originalname, "/hmt/sirius1/viv0/data7/cu/arch/courses/temp/"+req.file.originalname);
                    //Close the SSH connection
                    //c.end();
                    
                    
                });
                //On Invalid Credentials
                c.on('error',function (err) {
                    console.log( "- connection error: %s", err );
                    res.json({'status':'error','message':'Invalid Credentials'});
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
	// Load the home page for others apart from api
    app.get('/*', function(req, res){
		
		res.sendfile('public/index.html');	
		
	});
	
};
