import { useMemo, useState } from "react";
import { read, utils } from "xlsx";
import "./App.css";

function fakeValue() {
  const result = [...Array(200)].map((index) => ({
    name: `user_${index}`,
    email: `user_${index} email`,
    dob: `user_${index} dob`,
    phoneNumber: `user_${index} phoneNumber`,
  }));

  return result;
}

function App() {
  const headers = ["Name", "email", "dob", "phone number"];

  const tableRowData = useMemo(() => fakeValue(), []);

  const [data, setData] = useState([]);

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        setData(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <>
      <label htmlFor="upload">Upload File</label>
      <input type="file" name="upload" id="upload" onChange={readUploadFile} />
      <div className="App">
        <table className="table">
          <TableHeader data={data[0] || []} />

          <tbody className="table-body-wrapper">
            {data.map((_data, rowIndex) => {
              return (
                <TableRow
                  key={`row-${rowIndex}`}
                  rowIndex={rowIndex}
                  rowData={_data}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ height: "200px", width: "300px" }} />
    </>
  );
}

const TableHeader = ({ data }) => {
  const values = Object.keys(data);

  return (
    <thead className="table-head-wrapper">
      <tr>
        {values.map((_headerTitle, headerRowIndex) => {
          return (
            <th key={`header-row-index-${headerRowIndex}`}>{_headerTitle}</th>
          );
        })}
      </tr>
    </thead>
  );
};

const useValidation = (templateName, columnName, value, rowIndex, rowData) => {
  function templateOne() {
    const result = {
      status: "NORMAL",
      message: "",
    };
    if (columnName === "Full Name") {
      // console.log("Full Name")
      if (value.length < 11) {
        result.status = "ERROR";
        result.message = "Name should not be less that 11";
      }
    } else if (columnName === "Department") {
      if (parseInt(rowData["Age"]) > 50 && rowData["Department"] === "IT") {
        result.status = "ERROR";
        result.message = "Max age 50 in IT";
      }
    } else if (columnName === "Age") {
      if (rowData["Department"] === "IT" && parseInt(rowData["Age"]) > 50) {
        result.status = "ERROR";
        result.message = "Max age 50 in IT";
      }
    }

    return result;
  }

  switch (templateName) {
    case "TEMPLATE_1":
      return templateOne();

    default:
      return {
        status: "NORMAL",
        message: "",
      };
  }
};

const TableData = ({
  rowIndex,
  name,
  placeholder,
  defaultValue,
  onChange,
  rowData,
}) => {
  const { status, message } = useValidation(
    "TEMPLATE_1",
    name,
    defaultValue,
    rowIndex,
    rowData
  );

  const style = status === "ERROR" ? { border: "1px solid red" } : {};

  return (
    <td key={`table-data-4-${rowIndex}`}>
      <input
        name={name}
        placeholder={placeholder}
        // value={_data.phoneNumber}
        defaultValue={defaultValue}
        onChange={onChange}
        style={style}
      />
      <p style={{ color: "red", fontSize: "12px" }}>&#160;{message}&#160;</p>
    </td>
  );
};

const TableRow = ({ rowData, rowIndex }) => {
  const [tableRowData, setTableRowData] = useState({ ...rowData });

  const values = Object.entries(tableRowData);

  function onChange(key, value) {
    setTableRowData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  }

  return (
    <tr className="table-row-wrapper">
      {values.map((_value, index) => {
        return (
          <TableData
            key={`table-data-${index}`}
            rowIndex={rowIndex}
            name={_value[0]}
            placeholder={_value[0]}
            defaultValue={_value[1]}
            onChange={(event) => onChange(_value[0], event.target.value)}
            rowData={tableRowData}
          />
        );
      })}

      {/* 
      <TableData
        rowIndex={rowIndex}
        name={"email"}
        placeholder={tableRowData.email}
        defaultValue={tableRowData.email}
        onChange={(event) => onChange("email", event.target.value)}
      />

      <TableData
        rowIndex={rowIndex}
        name={"dob"}
        placeholder={tableRowData.dob}
        defaultValue={tableRowData.dob}
        onChange={(event) => onChange("dob", event.target.value)}
      />

      <TableData
        rowIndex={rowIndex}
        name={"phoneNumber"}
        placeholder={tableRowData.phoneNumber}
        defaultValue={tableRowData.phoneNumber}
        onChange={(event) => onChange("phoneNumber", event.target.value)}
      /> */}
    </tr>
  );
};

export default App;
