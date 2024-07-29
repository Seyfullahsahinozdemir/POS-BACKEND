export const designDoc = {
  _id: "_design/validation",
  validate_doc_update: `function(newDoc, oldDoc, userCtx, secObj) {
    if (userCtx.roles.indexOf('_admin') !== -1) {
      return;
    }
    if (userCtx.name === null) {
      throw({forbidden: 'Anonymous users are not allowed to modify documents.'});
    }
    if (userCtx.roles.indexOf('user:' + newDoc.user_id) === -1) {
      throw({forbidden: 'You can only modify your own documents.'});
    }
    var requiredFields = ['user_id', 'type', 'products', 'status', 'date', 'total_price', 'table_id', 'venue_id'];
    for (var i = 0; i < requiredFields.length; i++) {
      if (!newDoc.hasOwnProperty(requiredFields[i])) {
        throw({forbidden: 'Document must include ' + requiredFields[i]});
      }
    }
  }`,
  views: {
    by_user_role: {
      map: `function(doc) {
        if (doc.user_id) {
          emit(doc.user_id, doc);
        }
      }`,
    },
  },
};
