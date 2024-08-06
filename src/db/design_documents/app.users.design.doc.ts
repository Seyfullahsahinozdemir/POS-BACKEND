// export const validationDesignDoc = {
//   _id: "_design/validation",
//   validate_doc_update: `function (newDoc, oldDoc, userCtx, secObj) {
//     if (oldDoc) {
//       for (var key in newDoc) {
//         if (requiredFields.indexOf(key) === -1) {
//           throw({forbidden: 'Document fields are not allowed to change'});
//         }
//       }
//     }
//   }`,
// };

export const filterDesignDoc = {
  _id: "_design/filters",
  filters: {
    by_company_id: `function(doc, req) {
        const companyId = parseInt(req.query.company_id, 10);
        return doc.companyId === companyId;
      }`,
  },
};
