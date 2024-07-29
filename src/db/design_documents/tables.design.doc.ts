export const designDoc = {
  _id: "_design/validation",
  validate_doc_update: `function (newDoc, oldDoc, userCtx, secObj) {
    var requiredFields = ['id', 'type', 'table_number', 'status', 'venue_id'];
    for (var i = 0; i < requiredFields.length; i++) {
      if (!newDoc.hasOwnProperty(requiredFields[i])) {
        throw({forbidden: 'Document must include ' + requiredFields[i]});
      }
    }
    if (oldDoc) {
      for (var key in newDoc) {
        if (requiredFields.indexOf(key) === -1) {
          throw({forbidden: 'Document fields are not allowed to change'});
        }
      }
    }
    if (userCtx.roles.indexOf('waiter') !== -1) {
      throw({forbidden: 'User with waiter role cannot modify documents'});
    }
  }`,
  filters: {
    by_type_table: `function(doc, req) {
      if (doc.type && doc.type === 'table') {
        return true;
      }
      return false;
    }`,
  },
};
