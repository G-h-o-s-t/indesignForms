/**
 * Created by ghost on 19/09/15.
 */
/**
 * Created by ghost on 23/04/15.
 */
console.log('Loaded..');
var app = angular.module('iidentic', ['autocomplete','angularMoment']);

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
    console.log('Controller starts');
    $scope.filesPlace = '/files/';
    $scope.showPopUp = false;
    $scope.typeName ='';
    $scope.cd = {};
    $scope.job = {'status' : '-1' };
    $scope.showCreate = true;
    $scope.fields = window.fields;
    $scope.ans = [];
    $scope.requestId = null;
    $scope.counter = 0;
    $scope.poolTime = 60;  // wait for 1 minute for complite conversion.



//    console.log('Scope',$scope.fields );
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

    if(!io.socket.linkUp) {
        console.log('trying to connect..',io.socket.linkUp );
        io.socket.on('connect', function() {
            loadClient($scope.clientID);
        });
    } else {
        setTimeout(
            function() {
                loadClient($scope.clientID);
            }, 0);
    }

    $scope.initCli = function (id){
        console.log(id);
        $scope.clientID = id;
    };

    $scope.loadData = function (ids){
//        console.log(ids);
    };

    $scope.showCat = function(cat) {
        cat.expanded = !cat.expanded;
    };
    
    $scope.collect = function() {

        for(var i=0,l=$scope.fields.length; i<l; i++){
            var field = $scope.fields[i];
            if(field.selected) field.data.push(field.selected);
            $scope.ans.push({'name': field.name, 'value': field.selected });
            delete field.updatedAt;
            delete field.createdAt;
        }
        var fields = JSON.parse( angular.toJson($scope.fields, false) );       // anguar add $$index keys in to model. to remove this


        io.socket.put('/form/updateFields', {'fields' : fields },  function (data, jwres){
            console.log('saved', data);
        });


        var form = JSON.parse( angular.toJson($scope.ans, false) );       // angular add $$index keys in to model. to remove this
        console.log(typeId,catName);

        var client = {
                'id': $scope.clientID,
                'dataName': window.catName,
                'formId': window.typeId
            };

        console.log('FORM!:', client);

        io.socket.post('/form/request', {'fields' : form, 'client' : client},  function (data, jwres){
            $scope.$apply(function () {
                $scope.queueID = data.id;
            });
            console.log(data.id);
            if(data.id) startPooling( data.id );
        });
    };


    $scope.moveback = function () {
        window.history.back();
    };

    $scope.cancelPooling = function () {
        console.log('cancel pooling');
        clearInterval( window.poolTimer );
    };

    function startPooling(id){

        function setStatus( data ) {
            function getLast(arr){ return arr[arr.length-1]; }

            console.log('set status', data);

            if(data.previewPath){
                var preview = $scope.filesPlace + getLast( data.previewPath.split('/') );
            }

            if(data.outputPath){
                var filepath = $scope.filesPlace + getLast( data.outputPath.split('/') );
            }

            $scope.$apply(function() {
                $scope.job.status = data.status;
                $scope.job.comments = data.comments;
                $scope.job.preview = preview||'';
                $scope.job.filepath = filepath||'';
            });

        }


        $scope.counter = 0;
//        console.log('ID:', id);
        $scope.requestId = id;

        $scope.job.status = 'prepare';

        setTimeout(function() {
            var popUp = document.getElementById('statusPopUp');
            window.scrollTo(0, popUp.offsetTop-100);
        }, 0);


        window.poolTimer =
            window.setInterval(function(){

                console.log('Ask for', $scope.requestId);

                io.socket.get('/form/request/'+$scope.requestId,  function (data, jwres){
                    console.log('recieved', data);

                    setStatus( data );

                    if('4' == data.status || '3' == data.status || $scope.counter == $scope.poolTime) {     // если 3-готово  или 4-ошибка или запарился опрашивать..
                        console.log('call cancel');
                        $scope.cancelPooling();
                    }

                    if ($scope.counter == $scope.poolTime) {
                        alert('Время ожидания истекло, попробуйте позже');
                    }
                    $scope.counter++;
                });

            }, 1000);
    }
    
    $scope.editData = function (cliId, type, catName) {

        console.log('type', type);

        $scope.showCreate = !!type.fields.length;

        io.socket.get('/form/requestdocs/', {'clientId':cliId, 'catName':catName, 'typeId': type.id}, function (data, jwres) {
            console.log('recieved', data);
            $scope.$apply(function() {
                $scope.docs = data;
                $scope.cd.id = cliId;
                $scope.cd.name = type.name;
                $scope.cd.typeId = type.id;
                $scope.typeName = type.name;
                $scope.showPopUp = true;
            });
        });
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