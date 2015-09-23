/**
 * Created by ghost on 19/09/15.
 */
/**
 * Created by ghost on 23/04/15.
 */

var app = angular.module('iidentic', []);

/*app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});*/

app.controller('interface', function ($scope) {

    $scope.showPopUp = false;
    $scope.typeName ='';
    $scope.cd = {};

    function loadClient(id) {

        io.socket.get('/client/'+id, function (data, jwres){
            $scope.$apply(function(){
                if(data){
                    $scope.client = data.client;
                }
            });
        });
    }

//  Load Data..
    io.socket.on('connect', function(){
        io.socket.connected = true;
        loadClient($scope.clientID);
    });

    $scope.initCli = function (id){
        $scope.clientID = id;
    };

    $scope.showCat = function(cat) {
        cat.expanded = !cat.expanded;
    };

    $scope.editData = function (cliId, name, typeId) {

        $scope.cd.id = cliId;
        $scope.cd.name = name;
        $scope.cd.typeId = typeId;
        $scope.typeName = name;
        $scope.showPopUp = true;

    };
    
    $scope.moveToCreate = function () {
        location.href = '/form/create?clientId='+$scope.cd.id+'&typeId='+$scope.cd.typeId;
    }
});