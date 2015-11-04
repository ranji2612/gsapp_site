//controller for view 1, the main table
function CollapseDemoCtrl($scope) {
    $scope.isCollapsed = true;
};

app.controller('oldCtrl', function($scope, $route, $routeParams, dataService) {
	dataService.getData().then(function(data) {
		$scope.myData = data;
        console.log(data);
	    });
	$scope.$route = $route;
	$scope.$routeParams = $routeParams;
    $scope.isCollapsed = true;
});


