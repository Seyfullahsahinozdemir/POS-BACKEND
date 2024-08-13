export const validationDesignDoc = {
  _id: "_design/validation",
  validate_doc_update: `function (newDoc, oldDoc, userCtx, secObj) {
    var requiredFields = [ 'id', 'date', 'order_id', 'user_key', 'total_price', 'type', 'payment_method'];
    var allowedRoles = ['_admin', 'user']; 

    if (allowedRoles.indexOf(userCtx.roles[0]) === -1) {
      throw({forbidden: 'You are not authorized to modify this document'});
    }

    if (newDoc._deleted) {
      return;
    }

    for (var i = 0; i < requiredFields.length; i++) {
      if (!newDoc.hasOwnProperty(requiredFields[i])) {
        throw({forbidden: 'Document must include ' + requiredFields[i]});
      }
    }
  }`,
};

export const filterDesignDoc = {
  _id: "_design/filters",
  filters: {
    by_company_id: `function(doc, req) {
      const companyId = parseInt(req.query.company_id, 10);
      return doc.companyId === companyId;
    }`,
  },
};
