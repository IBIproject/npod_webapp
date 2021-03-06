import React, { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";

export default function useRetrieveCaseColumns(caseId, columnList) {
  const [result, setResult] = useState([]);
  useEffect(() => {
    if (caseId !== "") {
      retrieve(caseId, columnList);
    }
  }, [caseId]);
  async function retrieve(id, columns) {
    return await API.post("dbapi", "/db/get_one_case_all_column_values", {
      body: {
        case_id: id,
        columns: columns,
      },
    })
      .then((res) => {
        let valueArray = [];
        for (let i = 0; i < columnList.length; i++) {
          valueArray.push(res[0][columnList[i]]);
        }
        console.log("Retrieved existing case column values", valueArray);
        setResult(valueArray);
      })
      .catch((error) => {
        console.log("Retrieve case columns failed.");
        console.log("Failed case id", id);
        console.log("Failed columnList", columns);
        console.log("Amplify API call error", error);
      });
  }

  return result;
}
