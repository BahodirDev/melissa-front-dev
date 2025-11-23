import React from "react";
import { Table } from "antd";
import moment from "moment";
import NoData from "../../components/noData/NoData";
import { formatSumma } from "../../components/addComma";

const EmployeeSalesTable = ({ data, darkMode, sidebar }) => {
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
      title: "Sana",
      dataIndex: "reports_createdat",
      key: "reports_createdat",
      render: (date) =>
        moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Mijoz",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Mahsulot",
      dataIndex: "goods_name",
      key: "goods_name",
    },
    {
      title: "Kod",
      dataIndex: "goods_code",
      key: "goods_code",
    },
    {
      title: "Miqdor",
      dataIndex: "reports_count",
      key: "reports_count",
      render: (value) => formatCurrency(value || 0),
    },
    {
      title: "Narx",
      dataIndex: "reports_count_price",
      key: "reports_count_price",
      render: (value) => formatCurrency(value || 0) + " so'm",
    },
    {
      title: "Jami",
      dataIndex: "reports_total_cost",
      key: "reports_total_cost",
      render: (value) => formatCurrency(value || 0) + " so'm",
    },
    {
      title: "Foyda",
      dataIndex: "profit",
      key: "profit",
      render: (value) => formatCurrency(value || 0) + " so'm",
    },
  ];

  const tableData = data.map((item, index) => ({
    key: item.reports_id || index,
    index: index + 1,
    ...item,
  }));

  return (
    <div 
      className={`ant-d-table employee-sales-table ${darkMode ? "dark" : null}`}
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
      />
    </div>
  );
};

export default EmployeeSalesTable;

