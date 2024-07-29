export const designDoc = {
  _id: "_design/validation",
  validate_doc_update: `function(newDoc, oldDoc, userCtx, secObj) {
    if (userCtx.roles.indexOf('_admin') === -1) {
      throw({forbidden: 'Only admin can change documents.'});
    }
    var requiredFields = [ 'date', 'order_id', 'user_id', 'total_price', 'type'];
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
