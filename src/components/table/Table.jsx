import { Table } from "antd";
import moment from "moment/moment";
import { addComma, addCommaWithToFixed, addSpace } from "../addComma";
import { productDeleteConfirm } from "../delete_modal/delete_modal";
import NoData from "../noData/NoData";
import {
  CirclesThreePlus,
  DotsThreeCircleVertical,
  DotsThreeVertical,
  FilePlus,
  FolderNotchPlus,
  ListPlus,
  PencilSimple,
  Plus,
  PlusCircle,
  PlusSquare,
  StackMinus,
  Star,
  Trash,
} from "@phosphor-icons/react";
import { useState } from "react";
import { subtractModal } from "../pay_modal/pay_modal";

const AntTable = ({
  data,
  deleteItem,
  sidebar,
  userRole,
  showDropdown,
  setshowDropdown,
  editProduct,
  setAddModalVisible,
  setAddModalDisplay,
  addOnTop,
  darkMode,
  currentPage,
  limit,
  temporaryFunction,
  handleSubtract,
}) => {
  const [loc, setLoc] = useState(true);

  const handleClick = (e, id) => {
    showDropdown === id ? setshowDropdown("") : setshowDropdown(id);
    e.stopPropagation();
    setLoc(window.innerHeight - e.clientY > 110 ? false : true);
  };

  let arr2 =
    data?.length &&
    data?.map((item, idx) => {
      return {
        key: idx + 1 + (currentPage - 1) * limit,
        id: item?.products_id,
        deliver_id: item?.deliver_id?.deliver_name,
        store_id: item?.store_id?.store_name,
        store: item?.store_id?.store_id,
        goods_code: item?.goods_id?.goods_code,
        goods_name: item?.goods_id?.goods_name,
        dead_limit:
          item?.goods_id?.dead_limit === 0 || item?.goods_id?.dead_limit
            ? Number(item?.goods_id?.dead_limit)
            : null,
        products_box_count: isNaN(item?.products_box_count)
          ? 0
          : Math.ceil(item?.products_box_count),
        per_box: item?.each_box_count,
        products_count: Math.ceil(+item?.products_count),
        img: item?.img_url,
        products_count_cost:
          item?.currency_id?.currency_symbol === "$"
            ? item?.currency_id?.currency_symbol +
              addCommaWithToFixed(item?.products_count_cost) +
              " - " +
              addComma(
                item?.products_count_cost * item?.currency_id?.currency_amount
              )
            : addComma(item?.products_count_cost) + " so'm",
        actual_count: item?.actual_count,
        products_count_price:
          addComma(
            item?.products_count_price * item?.currency_id?.currency_amount
          ) + " so'm",
        total_price:
          addComma(
            item?.products_count *
              item?.products_count_cost *
              item?.currency_id?.currency_amount
          ) + " so'm",
        total_price_value:
          item?.products_count_price * item?.currency_id?.currency_amount,
        // prevCost: addComma(item?.products_prev_cost),
        product_date: `${moment(item?.products_updatedat).format(
          "YYYY/MM/DD HH:mm"
        )}`,
      };
    });

  const columns = [
    {
      title: "No̱",
      dataIndex: "key",
    },
    {
      title: "Rasm",
      height: "40px",
      width: "40px",
      render: (text, record) => (
        <div className="table-img-col">
          <img
            src={`${record?.img}`}
            height={40}
            onClick={() => window.open(record?.img)}
          />
        </div>
      ),
    },
    {
      title: "Ombor",
      dataIndex: "store_id",
    },
    {
      title: "Mahsulot",
      dataIndex: "goods_name",
    },
    {
      title: "Kod",
      dataIndex: "goods_code",
    },
    {
      title: "Ta'minotchi",
      dataIndex: "deliver_id",
    },
    {
      title: <nobr>Quti</nobr>,
      dataIndex: "products_box_count",
    },
    {
      title: <nobr>Har bir qutida</nobr>,
      dataIndex: "per_box",
    },
    {
      title: "Jami",
      dataIndex: "products_count",
    },
    {
      title: userRole === 1 ? <nobr>Narx</nobr> : null,
      render: (text, record) =>
        userRole === 1 ? record?.products_count_cost : null,
    },
    {
      title: <nobr>Sotuv narxi</nobr>,
      dataIndex: "products_count_price",
    },
    {
      title: <nobr>Umumiy narx</nobr>,
      dataIndex: "total_price",
    },
    {
      title: "Sana",
      dataIndex: "product_date",
    },
    {
      title: "",
      width: "50px",
      render: (text, record) =>
        userRole === 1 ? (
          <div className="table-item-edit-holder">
            <button type="button" onClick={(e) => handleClick(e, record?.id)}>
              <DotsThreeVertical size={24} />
            </button>
            <div
              className={`table-item-edit-wrapper extra product ${
                showDropdown === record?.id || "hidden"
              } ${loc && "top"} ${darkMode ? "dark" : null}`}
            >
              <div className="table-item-scroll">
                <button
                  type="button"
                  className="table-item-edit-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    addOnTop(record?.id);
                  }}
                >
                  Qo'shish <CirclesThreePlus size={20} />
                </button>
                <button
                  type="button"
                  className="table-item-edit-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    editProduct(record?.id);
                  }}
                >
                  Tahrirlash <PencilSimple size={20} />
                </button>
                <button
                  type="button"
                  className="table-item-edit-item"
                  onClick={() =>
                    temporaryFunction(record?.id, record?.actual_count)
                  }
                >
                  Saqlash
                  {record?.actual_count > 2 ? (
                    <Star size={20} color="yellow" />
                  ) : (
                    <Star size={20} />
                  )}
                </button>
                <button
                  type="button"
                  className="table-item-edit-item"
                  onClick={(e) =>
                    subtractModal(
                      e,
                      handleSubtract,
                      record?.products_count,
                      record?.id,
                      record?.store,
                      record?.total_price_value,
                      darkMode
                    )
                  }
                >
                  Ayirish
                  <StackMinus size={20} />
                </button>
                <button
                  type="button"
                  className="table-item-edit-item"
                  onClick={(e) =>
                    productDeleteConfirm(
                      e,
                      <>
                        Mahsulot <span>{record?.goods_name}</span>ni
                      </>,
                      deleteItem,
                      record?.id,
                      darkMode
                    )
                  }
                >
                  O'chirish
                  <Trash size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : null,
    },
  ];

  return (
    <div
      className={`ant-d-table ${darkMode ? "dark" : ""}`}
      style={{
        width: sidebar && "calc(100dvw - 309px)",
      }}
    >
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        locale={{
          emptyText: <NoData />,
        }}
        dataSource={arr2}
        pagination={false}
        rowClassName={(record) => {
          const classes = ["product-row"];
          if (
            record?.dead_limit !== null &&
            record?.dead_limit !== undefined &&
            record?.products_count <= record?.dead_limit
          ) {
            classes.push("product-row-dead-limit");
          }
          return classes.join(" ");
        }}
      />
    </div>
  );
};

export default AntTable;
