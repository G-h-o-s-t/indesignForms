/**
* Fields.js
*
* @description :: Store client fields
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      "name"    : 'string',  //'Фамилия Имя Отчество',
      "descr"   : 'string',  // for label
      "type"    : 'string',    // textArea, ?select?
      "active"  : 'boolean',
      "order"   : 'integer',
      "data"    : 'array'
  }
};

