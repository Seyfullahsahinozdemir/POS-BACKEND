export const designDoc = {
  _id: "_design/validation",
  validate_doc_update: `function (newDoc, oldDoc, userCtx, secObj) {
    var requiredFields = ['id', 'type', 'name', 'price', 'product_type_id', 'product_type','place_id'];
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
    by_type_product: `function(doc, req) {
      if (doc.type && doc.type === 'product') {
        return true;
      }
      return false;
    }`,
  },
};
