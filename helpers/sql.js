const { BadRequestError } = require("../expressError");

/**
 * Helper function to generate SQL for partial updates.
 *
 * @param {Object} dataToUpdate - The data to be updated.
 * @param {Object} jsToSql - Maps JS fields to database columns.
 *
 * @returns {Object} - { setCols: string, values: Array }
 *
 * @throws {BadRequestError} - If no data is provided for update.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
