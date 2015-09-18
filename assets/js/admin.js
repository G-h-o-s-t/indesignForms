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

app.controller('admin', function ($scope) {
    $scope.tab = 1;

    $scope.forms = [
        {name: 'bcards', descr: 'Визитные карточки', types: ['Основная персональная визитная карточка','Корпоративная визитная карточка','Визитная карточка для фирменного ювелирного магазина']},
        {name: 'blanks',  descr: 'Бланки', types:['Бланк для входящих документов','Бланк официального письма','Бланк пресс-релиза','Бланк общего назначения']},
        {name: 'folders', descr: 'Папки',types:[]},
        {name: 'converts', descr: 'Конверты',types:['Официальный стиль. Формат С65','Имиджевый стиль. Формат С65','Рабочий стиль. Формат С65','Формат С4','Формат С5']},
        {name: 'elements', descr: 'Элементы фирменного стиля',types:['Презентация компании (PPT)','Пакеты','Ленты','Кружка','Блок для записей']}
    ];

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
        $scope.forms.push({name:'needSlug', descr: what, types:[]});
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

      console.log(  $scope.forms );

    };

    $scope.addType =function(a, descr){
        if(!a){ return alert('Нужно выбрать категорию'); }
        a.types.push(descr);
        $scope.typeName = '';
    };


    console.log('WORK!');

});