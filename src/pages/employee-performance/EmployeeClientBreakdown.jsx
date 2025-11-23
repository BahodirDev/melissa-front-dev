import React from "react";
import { Table } from "antd";
import moment from "moment";
import NoData from "../../components/noData/NoData";

const EmployeeClientBreakdown = ({ data, darkMode, sidebar }) => {
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
      title: "Mijoz",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "Savdolar soni",
      dataIndex: "sale_count",
      key: "sale_count",
      render: (value) => formatCurrency(value || 0),
    },
    {
      title: "Sotilgan miqdor",
      dataIndex: "total_quantity_sold",
      key: "total_quantity_sold",
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
      title: "Oxirgi savdo",
      dataIndex: "last_sale_date",
      key: "last_sale_date",
      render: (date) =>
        date ? moment(date).format("YYYY-MM-DD HH:mm") : "-",
    },
  ];

  const tableData = data.map((item, index) => ({
    key: `${item.client}-${index}`,
    index: index + 1,
    ...item,
  }));

  return (
    <div 
      className={`ant-d-table employee-client-breakdown ${darkMode ? "dark" : null}`}
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

export default EmployeeClientBreakdown;

