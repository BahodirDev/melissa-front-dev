import React from "react";
import { Table } from "antd";
import { formatSumma, addSpace } from "../../components/addComma";
import NoData from "../../components/noData/NoData";
import moment from "moment";
import "./employee-performance.css";

const EmployeePerformanceList = ({
  data,
  employees,
  onEmployeeClick,
  darkMode,
  sidebar,
}) => {
  // Debug logging
  console.log("EmployeePerformanceList received data:", data, "Type:", typeof data, "Is Array:", Array.isArray(data));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      width: 60,
    },
    {
      title: "Xodim ismi",
      dataIndex: "user_name",
      key: "user_name",
      render: (text) => text,
    },
    {
      title: "Savdolar soni",
      dataIndex: "total_sales_count",
      key: "total_sales_count",
      render: (value) => formatCurrency(value || 0),
    },
    {
      title: "Sotilgan mahsulotlar",
      dataIndex: "total_products_sold",
      key: "total_products_sold",
      render: (value) => formatCurrency(value || 0),
    },
    {
      title: "Daromad",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (value) => formatCurrency(value || 0) + " so'm",
    },
    {
      title: "Foyda",
      dataIndex: "total_profit",
      key: "total_profit",
      render: (value) => formatCurrency(value || 0) + " so'm",
    },
    {
      title: "Mijozlar soni",
      dataIndex: "unique_clients_count",
      key: "unique_clients_count",
      render: (value) => formatCurrency(value || 0),
    },
    {
      title: "O'rtacha savdo",
      dataIndex: "average_sale_amount",
      key: "average_sale_amount",
      render: (value) => formatCurrency(value || 0) + " so'm",
    },
  ];

  // Safety check: ensure data is an array
  if (!Array.isArray(data)) {
    console.error("EmployeePerformanceList: data is not an array", data);
    return (
      <div className={`ant-d-table employee-performance-table ${darkMode ? "dark" : null}`}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Ma'lumotlar formati noto'g'ri
        </div>
      </div>
    );
  }

  const tableData = data.map((item, index) => {
    console.log("Processing item:", item, "Index:", index);
    return {
      key: item.user_id || `emp-${index}`,
      index: index + 1,
      ...item,
    };
  });

  console.log("Table data prepared:", tableData);

  return (
    <div
      className={`ant-d-table employee-performance-table ${darkMode ? "dark" : null}`}
      style={{
        width: sidebar && "calc(100dvw - 309px)",
      }}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: "max-content" }}
        locale={{
          emptyText: <NoData />,
        }}
        className={darkMode ? "dark" : null}
        onRow={(record) => {
          return {
            onClick: () => {
              onEmployeeClick(record.user_id);
            },
            style: {
              cursor: "pointer",
            },
          };
        }}
      />
    </div>
  );
};

export default EmployeePerformanceList;

