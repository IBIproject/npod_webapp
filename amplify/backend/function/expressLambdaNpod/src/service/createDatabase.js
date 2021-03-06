const mysql = require("mysql");
const dotenv = require("dotenv").config();
const writeColumnMap = require("./updateColumnMap");

var pool = mysql.createPool({
  connectLimit: 10,
  host: process.env.WRITE_DB_HOST,
  user: process.env.WRITE_DB_USER,
  password: process.env.WRITE_DB_PASS,
  database: process.env.WRITE_DB_NAME,
});

async function testPoolForCreate() {
  const newConnection = await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
  try {
    return newConnection;
  } finally {
    newConnection.release();
    console.log("Write DB connection was released.");
  }
}

async function pooledConnection(asyncAction) {
  const newConnection = await new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
  try {
    return await asyncAction(newConnection);
  } finally {
    newConnection.release();
    console.log("Write DB connection was released.");
  }
}

// create a new case
async function create_case(case_id) {
  const sql = `INSERT INTO cases(case_id) VALUES('${case_id}')`;
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Write Database][Insert the case] The case ${case_id} was inserted.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// get test case
async function get_test_case() {
  const sql = "SELECT * FROM `cases` WHERE `case_id`=9999";
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Write Database][Insert the case] The case 9999 was inserted.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// check case if exist
async function check_case_exist(case_id) {
  console.log("Checking case " + case_id + " exist");
  const sql = `SELECT COUNT(1) FROM cases WHERE case_id='${case_id}'`;
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`[Fetch cases] case ${case_id} was fetched.`);
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

async function get_one_case_all_column_values(case_id, columns) {
  let columnStr = "";
  for (let i = 0; i < columns.length; i++) {
    if (i === 0) {
      columnStr = columns[i];
    } else {
      columnStr = columnStr + "," + columns[i];
    }
  }
  //console.log(columnStr);
  const sql = `SELECT ${columnStr} FROM cases WHERE case_id='${case_id}'`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch case column] Case ${case_id} column ${columnStr} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

async function get_one_table_one_column_all_existing_values(
  table_name,
  column_name,
  sort_by
) {
  const sql = `SELECT ${column_name} FROM ${table_name} ORDER BY ${sort_by}`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch table column] Table ${table_name} column ${column_name} was fetched.`
          );
          resolve(result.map((res) => res[column_name]));
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

async function get_one_table_one_column_all_existing_values_with_conditions(
  table_name,
  column_name,
  sort_by,
  conditions
) {
  let conditionsClause = "";
  for (let i = 0; i < conditions.length; i++) {
    if (i === 0) {
      conditionsClause =
        conditions[i].column + "=" + '"' + conditions[i].value + '"';
    } else {
      conditionsClause =
        conditionsClause +
        " AND " +
        conditions[i].column +
        "=" +
        '"' +
        conditions[i].value +
        '"';
    }
  }
  const sql = `SELECT ${column_name} FROM ${table_name} WHERE ${conditionsClause} ORDER BY ${sort_by}`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch table column] Table ${table_name} column ${column_name} was fetched.`
          );
          resolve(result.map((res) => res[column_name]));
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

async function get_one_table_one_column_all_possible_values(
  table_name,
  column_name
) {
  const sql = `SELECT COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_NAME="${table_name}" AND COLUMN_NAME="${column_name}"`;
  console.log("sql: " + sql);
  function str_to_arr(values) {
    let newValues = [];
    // remove "enum" suffix
    let temp = values.slice(5, -1).split(",");
    // remove single quote around each value
    for (let i = 0; i < temp.length; i++) {
      newValues.push(temp[i].slice(1, -1));
    }
    return newValues;
  }
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch table column] Table ${table_name} column ${column_name} was fetched.`
          );
          resolve(str_to_arr(result[0]["COLUMN_TYPE"]));
          console.log(
            "Returned possible column value",
            str_to_arr(result[0]["COLUMN_TYPE"])
          );
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

async function check_foreign_key(table_name, foreign_key, foreign_key_value) {
  const sql = `SELECT * FROM ${table_name} WHERE ${foreign_key}='${foreign_key_value}'`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Check Foreign Key] Table ${table_name} column ${foreign_key} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// check AAb if exist
async function check_AAb_exist(case_id) {
  console.log("Checking AAb table case " + case_id + " exist");
  const sql = `SELECT COUNT(1) FROM AAb WHERE case_id='${case_id}'`;
  console.log("sql", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`[Fetch AAb] case ${case_id} was fetched.`);
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// get all AAb_id by one case_id (multiple AAb records scenario)
async function get_all_AAb_id(case_id) {
  console.log("Getting all AAb_id of the case " + case_id);
  const sql = `SELECT AAb_id FROM AAb WHERE case_id='${case_id}'`;
  console.log("sql", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch AAb] Fetching all AAb_id of the case ${case_id} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// get one AAb row all column values
async function get_one_AAb_all_column_values(case_id, AAb_id, columns) {
  let columnStr = "";
  for (let i = 0; i < columns.length; i++) {
    if (i === 0) {
      columnStr = columns[i];
    } else {
      columnStr = columnStr + "," + columns[i];
    }
  }
  //console.log(columnStr);
  const sql = `SELECT ${columnStr} FROM AAb WHERE case_id='${case_id}' AND AAb_id='${AAb_id}'`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch AAb columns] Case ${case_id} column ${columnStr} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// create a new AAb row
async function create_AAb(columns) {
  let keys = "";
  let values = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null) {
      columns[key] = "'" + value + "'";
    }
    if (keys === "") {
      keys = key;
    } else {
      keys += "," + key;
    }
    if (values === "") {
      values = columns[key];
    } else {
      values += "," + columns[key];
    }
  }
  const sql = `INSERT INTO AAb(${keys}) VALUES(${values})`;
  console.log("sql:", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Write Database][Insert new AAb] The case ${columns.case_id} was inserted.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Check if HLA exists
async function check_HLA_exist(case_id) {
  console.log("Checking HLA table case " + case_id + " exist");
  const sql = `SELECT COUNT(1) FROM HLA WHERE case_id='${case_id}'`;
  console.log("sql", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`[Fetch HLA] case ${case_id} was fetched.`);
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Get one HLA row all columns values
async function get_one_HLA_all_column_values(case_id, columns) {
  let columnStr = "";
  for (let i = 0; i < columns.length; i++) {
    if (i === 0) {
      columnStr = columns[i];
    } else {
      columnStr = columnStr + "," + columns[i];
    }
  }
  //console.log(columnStr);
  const sql = `SELECT ${columnStr} FROM HLA WHERE case_id='${case_id}'`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch AAb columns] Case ${case_id} column ${columnStr} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Create new HLA
async function create_HLA(columns) {
  let keys = "";
  let values = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null) {
      columns[key] = "'" + value + "'";
    }
    if (keys === "") {
      keys = key;
    } else {
      keys += "," + key;
    }
    if (values === "") {
      values = columns[key];
    } else {
      values += "," + columns[key];
    }
  }
  const sql = `INSERT INTO HLA(${keys}) VALUES(${values})`;
  console.log("sql:", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Write Database][Insert new HLA] The case ${columns.case_id} was inserted.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Check if RNA exists
async function check_RNA_exist(case_id) {
  console.log("Checking RNA table case " + case_id + " exist");
  const sql = `SELECT COUNT(1) FROM RNA WHERE case_id='${case_id}'`;
  console.log("sql", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(`[Fetch RNA] case ${case_id} was fetched.`);
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// get all RNA_id by one case_id (multiple RNA records scenario)
async function get_all_RNA_id(case_id) {
  console.log("Getting all RNA_id of the case " + case_id);
  const sql = `SELECT RNA_id FROM RNA WHERE case_id='${case_id}'`;
  console.log("sql", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch RNA] Fetching all RNA_id of the case ${case_id} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Get one RNA row all columns values
async function get_one_RNA_all_column_values(case_id, RNA_id, columns) {
  let columnStr = "";
  for (let i = 0; i < columns.length; i++) {
    if (i === 0) {
      columnStr = columns[i];
    } else {
      columnStr = columnStr + "," + columns[i];
    }
  }
  //console.log(columnStr);
  const sql = `SELECT ${columnStr} FROM RNA WHERE case_id='${case_id}' AND RNA_id='${RNA_id}'`;
  console.log("sql: " + sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Fetch RNA columns] RNA ${RNA_id} Case ${case_id} column ${columnStr} was fetched.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

// Create new RNA
async function create_RNA(columns) {
  let keys = "";
  let values = "";
  for (let [key, value] of Object.entries(columns)) {
    if (value !== null) {
      columns[key] = "'" + value + "'";
    }
    if (keys === "") {
      keys = key;
    } else {
      keys += "," + key;
    }
    if (values === "") {
      values = columns[key];
    } else {
      values += "," + columns[key];
    }
  }
  const sql = `INSERT INTO RNA(${keys}) VALUES(${values})`;
  console.log("sql:", sql);
  const asyncAction = async (newConnection) => {
    return await new Promise((resolve, reject) => {
      newConnection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(
            `[Write Database][Insert new HLA] The case ${columns.case_id} was inserted.`
          );
          resolve(result);
        }
      });
    });
  };
  return await pooledConnection(asyncAction);
}

module.exports = {
  testPoolForCreate: testPoolForCreate,
  create_case: create_case,
  get_test_case: get_test_case,
  check_case_exist: check_case_exist,
  get_one_case_all_column_values: get_one_case_all_column_values,
  get_one_table_one_column_all_existing_values:
    get_one_table_one_column_all_existing_values,
  get_one_table_one_column_all_existing_values_with_conditions:
    get_one_table_one_column_all_existing_values_with_conditions,
  get_one_table_one_column_all_possible_values:
    get_one_table_one_column_all_possible_values,
  check_foreign_key: check_foreign_key,
  check_AAb_exist: check_AAb_exist,
  get_one_AAb_all_column_values: get_one_AAb_all_column_values,
  create_AAb: create_AAb,
  check_HLA_exist: check_HLA_exist,
  get_all_AAb_id: get_all_AAb_id,
  get_one_HLA_all_column_values: get_one_HLA_all_column_values,
  create_HLA: create_HLA,
  check_RNA_exist: check_RNA_exist,
  get_all_RNA_id: get_all_RNA_id,
  get_one_RNA_all_column_values: get_one_RNA_all_column_values,
  create_RNA: create_RNA,
};
