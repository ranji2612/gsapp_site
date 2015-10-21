app.controller('courseCtrl', function($scope,$http) {
    console.log('CourseCtrl under control..');
    $scope.syllabusMap = {};
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
    
    
    //Get the Course Type
    $http.get('/json/courseTypes.json')
    .success(function(data) {
        $scope.courseTypes = data;
    })
    .error(function(data) {
        console.log(err);
    });
    
    
    
    
    //Get the Syllabus List
    $http.get('/json/syllabi.json')
    .success(function(data) {
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
    })
    .error(function(err) {
        console.log(err);
    });
    
    //Get the faculty List
    $http.get('/json/faculty.json')
    .success(function(data) {
        $scope.faculty = {};
        console.log(data);
        for (i in data) {
            $scope.faculty[data[i].f_id] = data[i];
        }
        
        //Call the course
        $http.get('/json/course.json')
        .success(function(data) {
            $scope.courses = data;
            //Variable to show / hide the course details

            var l = data.length;
            for (var i=0;i<l;i++) {
                $scope.courseDetails.push(false);
                //console.log($scope.faculty[$scope.courses[i].f1_id]);
                if ($scope.courses[i].f1_id in $scope.faculty)
                    $scope.courses[i]['faculty']=$scope.faculty[$scope.courses[i].f1_id].f_name;
                
            }
        })
        .error(function(err) {
            console.log(err);
        });
    })
    .error(function(err) {
        console.log(err);
    });
    
    
});