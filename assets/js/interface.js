/**
 * Created by ghost on 19/09/15.
 */
/**
 * Created by ghost on 23/04/15.
 */

var app = angular.module('iidentic', ['autocomplete']);

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

app.controller('interface',['$scope', function ($scope) {

    $scope.showPopUp = false;
    $scope.typeName ='';
    $scope.cd = {};
    $scope.showCreate = true;
    $scope.fields = window.fields;

    //$scope.arr =[ 'aaa','bbbb','ccccc','abgbgb','aasded' ];
//    $scope.fields.Full_name.data =[ 'aaa','bbbb','ccccc','abgbgb','aasded' ];


    console.log('Scope',$scope.fields );
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

    $scope.loadData = function (ids){
        console.log(ids);
    };

    $scope.showCat = function(cat) {
        cat.expanded = !cat.expanded;
    };

    $scope.editData = function (cliId, type) {

        console.log('type', type);

        if(type.fields.length){
            $scope.showCreate= true;
        } else {
            $scope.showCreate= false;
        }

        $scope.cd.id = cliId;
        $scope.cd.name = type.name;
        $scope.cd.typeId = type.id;
        $scope.typeName = type.name;
        $scope.showPopUp = true;

    };

    $scope.moveToCreate = function () {
        location.href = '/form/create?clientId='+$scope.cd.id+'&typeId='+$scope.cd.typeId;
    };




    //// gives another movie array on change
    //$scope.updateData = function(typed){
    //    // MovieRetriever could be some service returning a promise
    //    $scope.newmovies = MovieRetriever.getmovies(typed);
    //    $scope.newmovies.then(function(data){
    //        $scope.movies = data;
    //    });
    //}

}]);