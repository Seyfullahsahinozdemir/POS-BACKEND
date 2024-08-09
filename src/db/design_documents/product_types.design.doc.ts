export const validationDesignDoc = {
  _id: "_design/validation",
  validate_doc_update: `function (newDoc, oldDoc, userCtx, secObj) {
    var requiredFields = ['company_id'];
    var allowedRoles = ['_admin']; 

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

    if (oldDoc) {
      for (var key in newDoc) {
        if (requiredFields.indexOf(key) === -1) {
          throw({forbidden: 'Document fields are not allowed to change'});
        }
      }
    }
  }`,
};

// filter design document
export const filterDesignDoc = {
  _id: "_design/filters",
  filters: {
    by_company_id: `function(doc, req) {
      const company_id = parseInt(req.query.company_id, 10);
      return doc.company_id === company_id;
    }`,
  },
};
