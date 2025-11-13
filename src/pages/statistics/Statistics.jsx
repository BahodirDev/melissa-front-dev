import React, { useMemo, useState, useEffect } from "react";
import { Table, Select } from "antd";
import { useOutletContext } from "react-router-dom";
import { addComma } from "../../components/addComma";
import NoData from "../../components/noData/NoData";
import Pagination from "../../components/pagination/Pagination";
import Search from "../../components/search/Search";
import "./statistics.css";

// Fake stores data - this will come from backend
const generateFakeStores = () => {
  return [
    { store_id: 1, store_name: "Home" },
    { store_id: 2, store_name: "Store" },
    { store_id: 3, store_name: "Bazzar" },
  ];
};

// Fake data for products statistics
const generateFakeData = (stores) => {
  const productNames = [
    "Laptop HP Pavilion",
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "MacBook Air M2",
    "iPad Pro 12.9",
    "AirPods Pro",
    "Monitor LG 27inch",
    "Keyboard Mechanical",
    "Mouse Logitech MX",
    "Webcam Logitech C920",
    "SSD Samsung 1TB",
    "RAM Corsair 16GB",
    "Graphics Card RTX 4070",
    "Motherboard ASUS",
    "Power Supply 750W",
    "Laptop HP Pavilion",
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "MacBook Air M2",
    "iPad Pro 12.9",
    "AirPods Pro",
    "Monitor LG 27inch",
    "Keyboard Mechanical",
    "Mouse Logitech MX",
    "Webcam Logitech C920",
    "SSD Samsung 1TB",
    "RAM Corsair 16GB",
    "Graphics Card RTX 4070",
    "Motherboard ASUS",
    "Power Supply 750W",
  ];

  return productNames.map((name, index) => {
    const pricePerUnit = Math.floor(Math.random() * 5000000) + 1000000;

    // Generate stock for each store
    const storeStocks = {};
    let totalStockLeft = 0;
    let totalSoldQuantity = 0;

    stores.forEach((store) => {
      const storeStock = Math.floor(Math.random() * 200) + 10;
      const storeSold = Math.floor(Math.random() * storeStock * 0.6);
      const storeLeft = storeStock - storeSold;

      storeStocks[`store_${store.store_id}`] = storeLeft;
      totalStockLeft += storeLeft;
      totalSoldQuantity += storeSold;
    });

    const totalRevenue = totalSoldQuantity * pricePerUnit;

    return {
      key: index + 1,
      id: index + 1,
      productName: name,
      storeStocks: storeStocks,
      totalStockLeft: totalStockLeft,
      soldQuantity: totalSoldQuantity,
      pricePerUnit: pricePerUnit,
      totalRevenue: totalRevenue,
    };
  });
};

// Function to get warning color based on stock left
const getWarningColor = (stockLeft) => {
  if (stockLeft < 80) {
    return {
      backgroundColor: "#fff3cd",
      color: "#856404",
    };
  }
  return {};
};

// Function to get warning color for dark mode
const getWarningColorDark = (stockLeft) => {
  if (stockLeft < 80) {
    return {
      backgroundColor: "#664d03",
      color: "#ffc107",
    };
  }
  return {};
};

export default function Statistics() {
  const [
    inputRef,
    showDropdown,
    setshowDropdown,
    addModalVisible,
    setAddModalVisible,
    addModalDisplay,
    setAddModalDisplay,
    miniModal,
    setMiniModal,
    sidebar,
    userInfo,
    darkMode,
  ] = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [stockFilter, setStockFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Stores will come from backend - using fake data for now
  const [stores, setStores] = useState(generateFakeStores());
  // Selected stores to display - default to all stores
  const [selectedStoreIds, setSelectedStoreIds] = useState(
    stores.map((store) => store.store_id)
  );
  // TODO: Replace with API call when backend is ready
  // Uncomment the following when backend is ready:
  // import { get } from "../../customHook/api";
  // useEffect(() => {
  //   get('/store/store-list').then((data) => {
  //     if (data?.status === 200) {
  //       setStores(data?.data || []);
  //     }
  //   });
  // }, []);

  const allFakeData = useMemo(() => generateFakeData(stores), [stores]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let data = [...allFakeData];

    // Search filter
    if (searchText) {
      data = data.filter((item) =>
        item.productName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Stock filter (based on total stock left)
    if (stockFilter === "low") {
      data = data.filter((item) => item.totalStockLeft < 80);
    } else if (stockFilter === "medium") {
      data = data.filter(
        (item) => item.totalStockLeft >= 80 && item.totalStockLeft < 200
      );
    } else if (stockFilter === "high") {
      data = data.filter((item) => item.totalStockLeft >= 200);
    }

    // Price filter
    if (priceFilter === "low") {
      data = [...data].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (priceFilter === "high") {
      data = [...data].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    }

    return data;
  }, [allFakeData, searchText, stockFilter, priceFilter]);

  // Get filtered stores based on selection
  const visibleStores = useMemo(() => {
    return stores.filter((store) => selectedStoreIds.includes(store.store_id));
  }, [stores, selectedStoreIds]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const fakeData = filteredData
    .slice(startIndex, endIndex)
    .map((item, index) => {
      // Flatten store stocks for table columns
      const flattenedItem = {
        ...item,
        key: startIndex + index + 1,
      };

      // Add store columns to the item (only for visible stores)
      visibleStores.forEach((store) => {
        flattenedItem[`store_${store.store_id}`] =
          item.storeStocks?.[`store_${store.store_id}`] || 0;
      });

      return flattenedItem;
    });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    setSearchText(inputRef.current?.value || "");
    setSearchSubmitted(true);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearchText("");
    setSearchSubmitted(false);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStockFilter(null);
    setPriceFilter(null);
    setSelectedStoreIds(stores.map((store) => store.store_id));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearchText("");
    setSearchSubmitted(false);
    setCurrentPage(1);
  };

  const handleStoreSelection = (selectedIds) => {
    setSelectedStoreIds(
      selectedIds.length > 0
        ? selectedIds
        : stores.map((store) => store.store_id)
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [stockFilter, priceFilter, selectedStoreIds]);

  // Update selected stores when stores list changes
  useEffect(() => {
    setSelectedStoreIds(stores.map((store) => store.store_id));
  }, [stores]);

  // Generate columns dynamically based on visible stores
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "No̱",
        dataIndex: "key",
        width: 60,
        fixed: "left",
      },
      {
        title: "Mahsulot nomi",
        dataIndex: "productName",
        width: 220,
        fixed: "left",
      },
    ];

    // Add store columns dynamically only for selected stores
    const storeColumns = visibleStores.map((store) => ({
      title: `Qolgan (${store.store_name})`,
      dataIndex: `store_${store.store_id}`,
      width: 150,
      render: (text, record) => {
        const stockValue = record.storeStocks?.[`store_${store.store_id}`] || 0;
        const warningStyle =
          stockValue < 80 ? { color: "#ffc107", fontWeight: "bold" } : {};
        return <span style={warningStyle}>{addComma(stockValue)} dona</span>;
      },
    }));

    // Add other columns
    const otherColumns = [
      {
        title: "Jami qolgan",
        dataIndex: "totalStockLeft",
        width: 140,
        render: (text) => {
          const warningStyle =
            text < 80 ? { color: "#ffc107", fontWeight: "bold" } : {};
          return <span style={warningStyle}>{addComma(text)} dona</span>;
        },
      },
    //   {
    //     title: "Sotilgan miqdor",
    //     dataIndex: "soldQuantity",
    //     width: 140,
    //     render: (text) => `${addComma(text)} dona`,
    //   },
      {
        title: "Narx (birlik)",
        dataIndex: "pricePerUnit",
        width: 170,
        render: (text) => `${addComma(text)} so'm`,
      },
    //   {
    //     title: "Jami daromad",
    //     dataIndex: "totalRevenue",
    //     width: 180,
    //     render: (text) => (
    //       <span style={{ fontWeight: "bold", color: "#4caf50" }}>
    //         {addComma(text)} so'm
    //       </span>
    //     ),
    //   },
    ];

    return [...baseColumns, ...storeColumns, ...otherColumns];
  }, [visibleStores]);

  // Calculate total width for scroll
  const totalWidth = useMemo(() => {
    return columns.reduce((sum, col) => sum + (col.width || 100), 0);
  }, [columns]);

  return (
    <div className={`statistics-page ${darkMode ? "dark" : null}`}>
      <div className={`filter-wrapper statistics ${darkMode ? "dark" : null}`}>
        <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="Omborni tanlang"
            className="select"
            value={selectedStoreIds}
            onChange={handleStoreSelection}
            maxTagCount="responsive"
            filterOption={(input, option) =>
              option.children?.props?.children?.props?.children
                ?.toLowerCase()
                ?.includes(input.toLowerCase())
            }
          >
            {stores.map((store) => (
              <Select.Option
                key={store.store_id}
                value={store.store_id}
                className={`${darkMode ? "dark" : null}`}
              >
                <div>
                  <span>{store.store_name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
          <Select
            allowClear
            placeholder="Qolgan miqdor"
            className="select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e)}
          >
            <Select.Option
              value="low"
              className={`${darkMode ? "dark" : null}`}
            >
              <div>
                <span>Kam (80 dan kam)</span>
              </div>
            </Select.Option>
            <Select.Option
              value="medium"
              className={`${darkMode ? "dark" : null}`}
            >
              <div>
                <span>O'rtacha (80-200)</span>
              </div>
            </Select.Option>
            <Select.Option
              value="high"
              className={`${darkMode ? "dark" : null}`}
            >
              <div>
                <span>Ko'p (200 dan ko'p)</span>
              </div>
            </Select.Option>
          </Select>
        </div>
        <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
          <Select
            allowClear
            placeholder="Narx"
            className="select"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e)}
          >
            <Select.Option
              value="low"
              className={`${darkMode ? "dark" : null}`}
            >
              <div>
                <span>Arzon</span>
              </div>
            </Select.Option>
            <Select.Option
              value="high"
              className={`${darkMode ? "dark" : null}`}
            >
              <div>
                <span>Qimmat</span>
              </div>
            </Select.Option>
          </Select>
        </div>
        <div className="filter-btn-group">
          <button type="button" className="filter-btn" onClick={clearFilters}>
            Tozalash
          </button>
        </div>
      </div>

      <Search
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        showAddBtn={false}
        darkMode={darkMode}
      />

      <div
        className="ant-d-table"
        style={{
          width: sidebar && "calc(100dvw - 309px)",
        }}
      >
        <Table
          scroll={{ x: totalWidth + 100, y: "calc(100vh - 350px)" }}
          columns={columns}
          locale={{
            emptyText: <NoData />,
          }}
          dataSource={fakeData}
          pagination={false}
          onRow={(record) => {
            const warningStyle =
              record.totalStockLeft < 80
                ? darkMode
                  ? getWarningColorDark(record.totalStockLeft)
                  : getWarningColor(record.totalStockLeft)
                : {};
            return {
              style: warningStyle,
            };
          }}
        />
      </div>
      {totalPages > 1 && (
        <Pagination
          pages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
