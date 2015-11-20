var fs = require('fs');

//------------------- FACULTY ------------------------
var data = require('./public/data/faculty.json');

var content = "ID,Name,UNI,email,d-id\n";
for(i in data) {
        content += data[i].f_id+","+data[i].f_name+","+data[i].f_uni+","+data[i].f_email+","+data[i].d_id+"\n";
}

//Writing the CSV File
fs.writeFile('./public/data/faculty.csv', content, function (err) {
  if (err) throw err;
  console.log('Faculty CSV saved!');
});

//------------------- COURSES ------------------------

var data = require('./public/data/course.json');


var content = "ID,Title,FacultyID_1,FacultyID_2,CallNum,Requirements,Location,Schedule,Points,Section,Type,Session,Year,Semester\n";
for(i in data) {
        content += data[i].c_id + ",";
        content += "\""+data[i].c_title +"\""+ ",";
        content += data[i].f1_id + ",";
        content += data[i].f2_id + ",";
        content += data[i].call_num + ",";
        content += "\""+data[i].require +"\""+ ",";
        content += "\""+data[i].location +"\""+ ",";
        //Contains ',' which inhibits the general function of CSV
        // SO putting the content within quotes will help
        //Keep this in mind while reading
        content += "\""+data[i].schedule +"\""+ ",";
        content += data[i].points + ",";
        content += data[i].section + ",";
        content += data[i].type + ",";
        content += data[i].session + ",";
        content += data[i].year + ",";
        content += data[i].semester + "\n";
}
console.log(content);
//Writing the CSV File
fs.writeFile('./public/data/course.csv', content, function (err) {
  if (err) throw err;
  console.log('Course CSV saved!');
});