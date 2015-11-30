app.controller('courseCtrl', function($scope,$http) {
    console.log('CourseCtrl under control..');
    $scope.syllabusMap = {};
    $scope.imageMap = {};
    $scope.courseDetails=[];
    //For the search
    $scope.searchText = '';
    $scope.toggleCourseDetails = function(i) {
        //console.log(i);
        $scope.courseDetails[i] = !($scope.courseDetails[i]);
    };
    $scope.isVisibleCourseDetails = function(i) {
        return $scope.courseDetails[i];
    };
    
    
    //To sort the list of objects
    function compare(a,b) {
      if (a.year < b.year)
        return 1;
      if (a.year > b.year)
        return -1;
      return 0;
    };
    
    //To consolidate and return the stuff
    $scope.getAllSyl = function(data,section) {
        var res = [];
        for(i in data) {
            for(j in data[i]) {
                if (data[i][j].section == section)
                    res.push(data[i][j]);
            }
        }
        return res;
    };
    
    //Get the Course Type
    $http.get('data/courseTypes.json')
    .success(function(data) {
        $scope.courseTypes = data;
    })
    .error(function(err) {
        console.log(err);
    });
    
    //Getting the syllabus and mapping it
    $http.get('data/syllabi.json')
    .success(function(data) {
        data = data.sort(compare);
        $scope.syllabi = data;
        
        //Make the JSON for the syllabi
        for (i in data) {
            var c_id = data[i].c_id;
            var f_id = data[i].f_id;
            //Check for course in hash
            if (typeof($scope.syllabusMap[c_id]) === "undefined") {
                $scope.syllabusMap[c_id] = {};
            }
            //Check for facultyID in hash
            if ( typeof($scope.syllabusMap[c_id][f_id]) === "undefined" ) {
                $scope.syllabusMap[c_id][f_id]=[data[i]];
            } else {
                $scope.syllabusMap[c_id][f_id].push(data[i]);
            }
        }
        console.log('Syllabus Done');
    })
    .error(function(err) {
        console.log(err);
    });
    
    //Getting the Images list and mapping it
    $http.get('data/image.json')
    .success(function(data) {
        $scope.image = data;
        //Make the JSON for the syllabi
        for (i in data) {
            var c_id = data[i].c_id;
            var f_id = data[i].f_id;
            //Check for course in hash
            if (typeof($scope.imageMap[c_id]) === "undefined") {
                $scope.imageMap[c_id] = {};
            }
            //Check for facultyID in hash
            if ( typeof($scope.imageMap[c_id][f_id]) === "undefined" ) {
                $scope.imageMap[c_id][f_id]=[data[i]];
            } else {
                $scope.imageMap[c_id][f_id].push(data[i]);
            }
        }
        console.log('Image List Done');
    })
    .error(function(err) {
        console.log(err);
    });
    
    //Get the Faculty List - From CSV file
    $http.get('data/faculty.csv')
    .success(function(data) {
        
        data = CSVToArray(data);
        data = arrayToObject(data.slice(1),["f_id","f_name","f_uni","f_email","d_id"]);
        
        $scope.faculty = {};
        //console.log(data);
        for (i in data) {
            $scope.faculty[data[i].f_id] = data[i];
        }
        
        //Call the course
        $http.get('data/course.csv')
        .success(function(data) {
            data = CSVToArray(data);
            data = arrayToObject(data.slice(1),["c_id","c_title","f1_id","f2_id","call_num","require","location","schedule","points","section","type","session","year","semester"]);
            $scope.courses = data;
            //Variable to show / hide the course details

            var l = data.length;
            for (var i=0;i<l;i++) {
                $scope.courseDetails.push(false);
                //console.log($scope.faculty[$scope.courses[i].f1_id]);
                if ($scope.courses[i].f1_id in $scope.faculty)
                    $scope.courses[i]['faculty']=$scope.faculty[$scope.courses[i].f1_id].f_name;
                
            }
            console.log('Course Done');
        })
        .error(function(err) {
            console.log(err);
        });
    })
    .error(function(err) {
        console.log(err);
    });
    
    //Get semester name
    $scope.getSemester = function(n) {
        if (n==1) return 'Spring';
        else if(n==2) return 'Summer';
        else return 'Fall';
    };
});

//Convert CSV big string to array rows
function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }
//Convert the list of list to list of Object
function arrayToObject( data, schema) {
    var newData = [];
    var ob = {}
    for ( var i in data) {
        ob ={}
        for( var j in schema) {
            ob[schema[j]] = data[i][j];
        }
        newData.push(ob);
    }
    return newData;   
}