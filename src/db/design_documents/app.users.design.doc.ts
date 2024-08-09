export const filterDesignDoc = {
  _id: "_design/filters",
  filters: {
    by_company_id: `function(doc, req) {
        const companyId = parseInt(req.query.company_id, 10);
        return doc.companyId === companyId;
      }`,
  },
};
