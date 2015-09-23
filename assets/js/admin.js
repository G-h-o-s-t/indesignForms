/**
 * Created by ghost on 19/09/15.
 */
/**
 * Created by ghost on 23/04/15.
 */

var app = angular.module('iidentic', []);

app.directive('myEnter', function () {
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
});

app.controller('admin',['$scope', function ($scope) {

    slug.defaults.modes['pretty'] = {
        replacement: '-',
        symbols: true,
        remove: /[.]/g,
        lower: false,
        charmap: slug.charmap,
        multicharmap: slug.multicharmap
    };

    $scope.user = {};
    $scope.tab = 1;
    $scope.cliActive = true;
    $scope.showAddCliForm = false;
    $scope.forms=[];
    $scope.fields=[];
    $scope.fieldTypes= ['text','textarea'];
    $scope.client = {};
    $scope.cients = [];
    $scope.fieldsTitle = '';
    $scope.showCreate = true;

    function clone(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [], i = 0, len = obj.length;
            for ( ; i < len; i++ ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            var out = {}, i;
            for ( i in obj ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    }


    function loadClients() {
        io.socket.get('/admin/clients', function (data, jwres){
            $scope.$apply(function(){
                $scope.clients = data.clients;
            });
        });
    }

    function loadUsers() {
        io.socket.get('/admin/users', function (data, jwres){
            $scope.$apply(function(){
                $scope.users = data.users;
            });
        });
    }

// Load Data..
    io.socket.on('connect', function(){
        io.socket.connected = true;
        console.log('Socket Connected..',io.socket.connected );

        loadUsers();
        loadClients();

        io.socket.get('/admin/catalog', function (data, jwres){
            $scope.$apply(function(){
                $scope.forms = data.catalog[0].forms;
            });
        });
    });

    $scope.addUser = function() {
        console.log('POST:', $scope.user);
        $scope.user.provider = 'local';

        io.socket.post('/auth/local/register', $scope.user, function (data, jwres){

            if(data.err && data.err[0]){
                switch (data.err[0]){
                    case 'Error.Passport.Email.Exists': alert('Не правильный email'); break;
                    case 'Error.Passport.Username.Missing': alert('Не указано имя пользователя'); break;
                    case 'Error.Passport.Password.Missing': alert('Не указан пароль'); break;
                    case 'Error.Passport.Email.Missing': alert('Не указан email'); break;
                    case 'Error.Passport.Password.Invalid': alert('Длинна пароля должна быть >= 8 символам'); break;
                    default: alert(data.err);
                }
            }
            console.log('recieve:', data);

            if(data.msg ==='user Added'){
                $scope.$apply(function(){
                    $scope.users.push($scope.user);
                });
            }
        });
    };

    $scope.delUser = function (user) {
        console.log('DELETE ',user);

        io.socket.delete('/admin/user/'+user.id, function (data, jwres){
            console.log('recieve:', data);

            $scope.$apply(function(){
                var idx =  $scope.users.indexOf(user);
                $scope.users.splice(idx, 1);
            });

        });
    };

    $scope.restoreBack = function(){

        $scope.forms = [
            {name: 'bcards', descr: 'Визитные карточки', types: ['Основная персональная визитная карточка','Корпоративная визитная карточка','Визитная карточка для фирменного ювелирного магазина']},
            {name: 'blanks',  descr: 'Бланки', types:['Бланк для входящих документов','Бланк официального письма','Бланк пресс-релиза','Бланк общего назначения']},
            {name: 'folders', descr: 'Папки',types:[]},
            {name: 'converts', descr: 'Конверты',types:['Официальный стиль. Формат С65','Имиджевый стиль. Формат С65','Рабочий стиль. Формат С65','Формат С4','Формат С5']},
            {name: 'elements', descr: 'Элементы фирменного стиля',types:['Презентация компании (PPT)','Пакеты','Ленты','Кружка','Блок для записей']}
        ];

    };

    $scope.addForm = function( what ){
        $scope.forms.push({ name: slug(what), descr: what, types:[]});
        $scope.formName = '';
    };

    $scope.delete =function(a,type){
        var idx = $scope.forms.indexOf(a);
        var remove = $scope.forms[idx].types.indexOf(type);
        $scope.forms[idx].types.splice( remove , 1);
    };

    $scope.deleteForm =function(form){
        var idx = $scope.forms.indexOf(form);
        $scope.forms.splice( idx , 1);
    };

    $scope.save =function(data){
      //console.log(  $scope.forms );
      //  console.log( io.socket.connected );
        if(io.socket.connected){
            io.socket.post('/admin/catalog', {'forms': $scope.forms}, function (res, jwres){
                console.log('RES:', res);
            });
        } else {
            alert('Не могу сохранить, сервер недоступен(');
        }

    };

    $scope.addType =function(a, descr){
        if(!a){ return alert('Нужно выбрать категорию'); }
        a.types.push(descr);
        $scope.typeName = '';
    };

    $scope.newClient =function(){
        $scope.showCreate = true;
        $scope.showAddCliForm = true;
        $scope.client = {users:[], data:[]};
    };

    $scope.addUserToClient =function(user){
        $scope.client.users.push({'id':user.id, 'name' : user.username });
        //console.log($scope.client);
    };

    $scope.delUserFromClient =function(user){
        var idx =  $scope.client.users.indexOf(user);
        $scope.client.users.splice(idx,1);
        //console.log('Removing client', $scope.client);
    };

    $scope.addCat = function(cat) {
        var types = [];

        for(var i=0,l=cat.types.length; i<l; i++){
            types.push({'id':i, 'name': cat.types[i], 'fields': [] });
        }

        $scope.client.data.push(                                // create new data for client.
            {
            'name'  : cat.name,
            'descr' : cat.descr,
            'types' : types
            }
        );
    };

    $scope.removeCat = function(catName) {
        if($scope.client.data.length){
            for(var i=0,l=$scope.client.data.length; i<l; i++){
                if($scope.client.data[i] && $scope.client.data[i].name === catName){ $scope.client.data.splice(i,1); }
            }
        }
    };


    $scope.saveClient = function() {

        function indexTypes(data) {
            var idx = 0;
                for(var i=0,l=data.length; i<l; i++){           // iterate over categories
                    var cat = data[i];

                    for(var n=0,tl = cat.types.length; n < tl; n++){      // iterate over types=
                        cat.types[n].id = idx;
                        ++idx;
                    }
                }
            return data;
        }

        $scope.client.data = indexTypes($scope.client.data);

        console.log('Save client', $scope.client);
        var cli = JSON.parse( angular.toJson($scope.client, false) );       // anguar add $$index keys in to model. to remove this
        console.log( 'send:',cli );


        io.socket.put('/admin/client', cli, function (data, jwres){
            console.log('recieve:', data );
            $scope.$apply(function(){
                $scope.showAddCliForm = false;
            });
            loadClients();                      // update new data.
        });

    };

    $scope.delClient = function() {
        var cli = JSON.parse( angular.toJson($scope.client, false) );
        console.log('DELETE:', cli);

        io.socket.delete('/admin/client/'+cli.id, cli , function (data, jwres){
            $scope.$apply(function(){
                var idx = $scope.clients.indexOf($scope.client);
                $scope.clients.splice(idx,1);
                $scope.showAddCliForm = false;
            });
        });

    };

    $scope.createClient = function() {

        var cli = JSON.parse( angular.toJson($scope.client, false) );

        io.socket.post('/admin/client', cli , function (data, jwres){
            $scope.$apply(function(){
                $scope.clients.push(data);
                $scope.showAddCliForm = false;
            });
        });

    };
    
    $scope.removeType = function( cat, type ) {
        var idx = $scope.client.data.indexOf(cat);
        var idx2 = $scope.client.data[idx].types.indexOf(type);
        $scope.client.data[idx].types.splice(idx2,1);
//        console.log( $scope.client.data );
    };

    $scope.fieldsChange = function(cat, type){

console.log('CHANGE!!!!');
        $scope.showFieldsPopUp = true;

        setTimeout(function() {
            var popUp = document.getElementById('fieldsPopUp');
            window.scrollTo(0, popUp.offsetTop-100);
        }, 0);

        var idx = $scope.client.data.indexOf(cat);
        var idx2 = $scope.client.data[idx].types.indexOf(type);
        $scope.filedsIdx = [idx,idx2];

        $scope.fieldsTitle = $scope.client.data[idx].descr + ' / '+$scope.client.data[idx].types[idx2].name;
        var fields = $scope.client.data[idx].types[idx2].fields;

        //console.log('найдены:', $scope.client.data[idx].types[idx2].fields);
        if(fields.length) {          // если есть какие - грузим данные

            io.socket.get('/admin/field/',{'id':fields}, function (data, jwres){
                console.log('recieve:', data );
                $scope.$apply(function(){
                    $scope.fields = data;
                });
            });

        } else {
            $scope.fields=[];
        }
    };

    $scope.editClient = function(cli) {
        console.log(cli);
        $scope.client = cli;
        $scope.showCreate = false;
        $scope.showAddCliForm = true;
    };

    $scope.delField = function(field){
        console.log(field.id+', to delete');

        io.socket.delete('/admin/field/'+field.id, function (data, jwres){
            console.log('recieve:', data);
            $scope.$apply(function(){
                $scope.fields.splice($scope.fields.indexOf(field),1);
            });
        });
    };

    $scope.addEmptyField = function(){
        var newFields = {
            "name"    : '',
            "descr"   : '',  // for label
            "type"    : 'text',    // text, textArea, ?select?
            "active"  : 'true',
            "order"   : $scope.fields.length,
            "data"    : []
        };
//        console.log(newFields);

        io.socket.post('/admin/field', newFields, function (data, jwres){
            console.log('recieve', data);
            $scope.$apply(function(){
                $scope.fields.push(data);
            });
        });
    };

    $scope.saveFields = function( cat, type ){
        $scope.showFieldsPopUp = false;
        var idx = $scope.filedsIdx;

        console.log($scope.fields);
        var ids = [];

        for(var i=0,l=$scope.fields.length; i<l; i++){
            var field = $scope.fields[i];
            ids.push(field.id);

            if(!$scope.fields[i].name){            $scope.fields[i].name = slug( $scope.fields[i].descr );}                     // generate description.
            io.socket.put('/admin/field', $scope.fields[i], function (resData) {
                console.log('Saved:',resData);
            });
        }
//        $scope.changedFieldsFor.fields = ids;

        //console.log('IDS:', ids);
        //console.log('IDX', idx);
        //console.log('one:', $scope.client.data[ idx[0] ]);
        //console.log('two:', $scope.client.data[ idx[0] ].types[ idx[1] ] );

        $scope.client.data[ idx[0] ].types[ idx[1] ].fields = ids;

//        console.log('cli dta:', $scope.client.data);
    };

}]);