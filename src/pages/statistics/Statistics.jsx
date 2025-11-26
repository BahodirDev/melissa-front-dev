import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Table, Select, Checkbox } from "antd";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FilePdf } from "@phosphor-icons/react";
import { addComma } from "../../components/addComma";
import NoData from "../../components/noData/NoData";
import Pagination from "../../components/pagination/Pagination";
import Search from "../../components/search/Search";
import "./statistics.css";
import Loader from "../../components/loader/Loader";
import { get } from "../../customHook/api";
import { toast } from "react-toastify";
import { setData, setQuantity } from "../../components/reducers/stats";

const USE_MOCK = process.env.REACT_APP_USE_MOCK_STATS === "true";

const MOCK_STORES = [
  { store_id: 1, store_name: "Asosiy ombor", main: true },
  { store_id: 2, store_name: "Filial ombor" },
];

const MOCK_DELIVERIES = [
  { deliver_id: 101, deliver_name: "Texno Supplier" },
  { deliver_id: 102, deliver_name: "Mobile Market" },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "HP Pavilion 15",
    code: "HP-15",
    min: 120,
    price: 2500000,
    deliver: MOCK_DELIVERIES[0],
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    code: "APL-15P",
    min: 60,
    price: 15000000,
    deliver: MOCK_DELIVERIES[1],
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    code: "SMG-S24",
    min: 80,
    price: 9000000,
    deliver: MOCK_DELIVERIES[1],
  },
  {
    id: 4,
    name: "MacBook Air M2",
    code: "APL-M2",
    min: 50,
    price: 14000000,
    deliver: MOCK_DELIVERIES[1],
  },
  {
    id: 5,
    name: "Logitech MX Master 3",
    code: "LOG-MX3",
    min: 90,
    price: 1200000,
    deliver: MOCK_DELIVERIES[0],
  },
];

const isMainStore = (store) =>
  Boolean(
    store &&
      (store.main === true ||
        store.is_main === true ||
        store.dominant === true ||
        store?.store_main === true)
  );

const generateMockStats = () => {
  const list = [];
  let idx = 1;

  for (let cycle = 0; cycle < 30 && list.length < 120; cycle++) {
    MOCK_PRODUCTS.forEach((product) => {
      MOCK_STORES.forEach((store) => {
        const main = isMainStore(store);
        const shouldBeLow = main && (cycle + product.id) % 3 !== 0;
        const lowStockValue = Math.max(
          0,
          Math.floor(product.min * 0.2 + Math.random() * product.min * 0.3)
        );
        const healthyStockValue = Math.floor(
          product.min + Math.random() * product.min * 1.5
        );

        list.push({
          products_id: idx,
          goods_id: {
            goods_id: product.id * 100 + cycle,
            goods_name: `${product.name} ${cycle + 1}`,
            goods_code: `${product.code}-${cycle + 1}`,
            dead_limit: product.min,
          },
          store_id: store,
          deliver_id: product.deliver,
          products_count: shouldBeLow ? lowStockValue : healthyStockValue,
          products_count_price: product.price,
          currency_id: { currency_amount: 1 },
          img_url: "/assets/img/no data.png",
        });

        idx += 1;
      });
    });
  }

  return list.slice(0, 100);
};

const MOCK_STATS = generateMockStats();

const getWarningColor = () => ({
  backgroundColor: "#fff3cd",
  color: "#856404",
});

const getWarningColorDark = () => ({
  backgroundColor: "#664d03",
  color: "#ffc107",
});

const formatPrice = (value) => `${addComma(Math.round(value || 0))} so'm`;
const formatCount = (value) => `${addComma(Math.max(value || 0, 0))} dona`;

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
  const dispatch = useDispatch();
  const statsSelection = useSelector((state) => state.stats?.data || []);

  const [statsRaw, setStatsRaw] = useState(USE_MOCK ? MOCK_STATS : []);
  const [stores, setStores] = useState(USE_MOCK ? MOCK_STORES : []);
  const [deliveries, setDeliveries] = useState(USE_MOCK ? MOCK_DELIVERIES : []);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedStoreIds, setSelectedStoreIds] = useState([]);
  const [selectedDeliverIds, setSelectedDeliverIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(
    USE_MOCK ? MOCK_STATS.length : 0
  );
  const [serverPaginated, setServerPaginated] = useState(!USE_MOCK);
  const didMount = useRef(false);

  const normalizeStatsResponse = useCallback((payload) => {
    if (!payload) {
      return { rows: [], total: 0, serverSide: false };
    }

    if (Array.isArray(payload)) {
      return { rows: payload, total: payload.length, serverSide: false };
    }

    if (Array.isArray(payload?.data)) {
      const fromData = payload.data;
      const totalValue =
        Number(payload.total ?? fromData?.[0]?.full_count) ??
        fromData.length;
      return {
        rows: fromData,
        total: Number.isFinite(totalValue) ? totalValue : fromData.length,
        serverSide: true,
      };
    }

    return { rows: [], total: 0, serverSide: false };
  }, []);

  const fetchStores = useCallback(() => {
    if (USE_MOCK) {
      setStores(MOCK_STORES);
      return;
    }
    get(`/store/store-list?limit=1000&page=1`)
      .then((response) => {
        const data = response?.data || response;
        if (
          (response?.status === 200 || response?.status === 201) &&
          Array.isArray(data) &&
          data.length
        ) {
          setStores(data);
        } else {
          setStores([]);
        }
      })
      .catch(() => setStores([]));
  }, []);

  const fetchDeliveries = useCallback(() => {
    if (USE_MOCK) {
      setDeliveries(MOCK_DELIVERIES);
      return;
    }
    get(`/deliver/deliver-list?limit=1000&page=1`)
      .then((response) => {
        const data = response?.data || response;
        if (
          (response?.status === 200 || response?.status === 201) &&
          Array.isArray(data) &&
          data.length
        ) {
          setDeliveries(data);
        } else {
          setDeliveries([]);
        }
      })
      .catch(() => setDeliveries([]));
  }, []);

  // Debounce timer ref
  const searchDebounceRef = useRef(null);

  const handleSearch = useCallback(
    (pageOverride = null, skipDebounce = false) => {
      // Clear existing debounce timer
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }

      const executeSearch = () => {
        setLoading(true);
        setSearchSubmitted(true);
        const searchValue = inputRef.current?.value?.trim() || "";
        const pageToUse = pageOverride !== null ? pageOverride : currentPage;

        const params = new URLSearchParams();
        params.append("limit", limit);
        params.append("page", pageToUse);

        if (searchValue) {
          params.append("search", searchValue);
        }

        if (
          selectedStoreIds.length &&
          stores.length &&
          selectedStoreIds.length !== stores.length
        ) {
          params.append("store_id", selectedStoreIds.join(","));
        }

        if (selectedDeliverIds.length) {
          params.append("deliver_id", selectedDeliverIds.join(","));
        }

        if (USE_MOCK) {
          setStatsRaw(MOCK_STATS);
          setTotalCount(MOCK_STATS.length);
          setServerPaginated(false);
          setLoading(false);
          return;
        }

        const endpoint = params.toString()
          ? `/products/products-low-stock?${params.toString()}`
          : `/products/products-low-stock`;

        get(endpoint)
          .then((response) => {
            const data = response?.data ?? response;
            if (response?.status === 200 || !response?.status) {
              const { rows, total, serverSide } =
                normalizeStatsResponse(data);
              setStatsRaw(rows);
              setTotalCount(total);
              setServerPaginated(serverSide);
              if (!rows.length) {
                setCurrentPage(1);
              }
            } else {
              toast.error("Nomalum server xatolik");
              setStatsRaw([]);
              setTotalCount(0);
            }
          })
          .catch(() => {
            toast.error("Nomalum server xatolik");
            setStatsRaw([]);
            setTotalCount(0);
          })
          .finally(() => setLoading(false));
      };

      // Debounce search requests (except for page changes)
      if (skipDebounce || pageOverride !== null) {
        executeSearch();
      } else {
        searchDebounceRef.current = setTimeout(executeSearch, 300);
      }
    },
    [
      currentPage,
      limit,
      selectedStoreIds,
      selectedDeliverIds,
      stores.length,
      normalizeStatsResponse,
    ]
  );

  const getData = useCallback(() => {
    setLoading(true);
    if (USE_MOCK) {
      setStatsRaw(MOCK_STATS);
      setTotalCount(MOCK_STATS.length);
      setServerPaginated(false);
      setLoading(false);
      return;
    }

    // Check if any filters are active
    const hasActiveFilters =
      (selectedStoreIds.length &&
        stores.length &&
        selectedStoreIds.length !== stores.length) ||
      selectedDeliverIds.length > 0 ||
      (searchSubmitted && inputRef.current?.value?.trim().length > 0);

    if (hasActiveFilters) {
      handleSearch();
    } else {
      // No filters, fetch default data
      get(`/products/products-low-stock?limit=${limit}&page=${currentPage}`)
        .then((response) => {
          const data = response?.data ?? response;
          if (response?.status === 200 || !response?.status) {
            const { rows, total, serverSide } =
              normalizeStatsResponse(data);
            setStatsRaw(rows);
            setTotalCount(total);
            setServerPaginated(serverSide);
          } else {
            toast.error("Nomalum server xatolik");
            setStatsRaw([]);
            setTotalCount(0);
          }
        })
        .catch(() => {
          toast.error("Nomalum server xatolik");
          setStatsRaw([]);
          setTotalCount(0);
        })
        .finally(() => setLoading(false));
    }
  }, [
    currentPage,
    limit,
    selectedStoreIds,
    selectedDeliverIds,
    stores.length,
    searchSubmitted,
    handleSearch,
    normalizeStatsResponse,
  ]);

  useEffect(() => {
    fetchStores();
    fetchDeliveries();
  }, [fetchStores, fetchDeliveries]);

  useEffect(() => {
    if (stores.length && !selectedStoreIds.length) {
      setSelectedStoreIds(stores.map((store) => store.store_id));
    }
  }, [stores, selectedStoreIds.length]);

  // Fetch data when page changes
  useEffect(() => {
    getData();
  }, [currentPage]);

  // When filters change, reset page and trigger search (following Products.jsx pattern)
  useEffect(() => {
    setCurrentPage(1);
    if (didMount.current) {
      handleSearch(1, false); // Skip debounce for filter changes
    } else {
      didMount.current = true;
    }
  }, [selectedStoreIds, selectedDeliverIds, limit, handleSearch]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Clear searchSubmitted if no filters are active (following Products.jsx pattern)
    if (
      selectedStoreIds.length === stores.length &&
      !selectedDeliverIds.length &&
      !inputRef.current?.value?.trim()
    ) {
      setSearchSubmitted(false);
    }
  };

  const handleSearchClick = () => {
    const searchValue = inputRef.current?.value?.trim() || "";
    setSearchText(searchValue);
    setSearchSubmitted(true);
    setCurrentPage(1);
    // Trigger the actual search with page 1, skip debounce for explicit search
    handleSearch(1, true);
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearchText("");
    setSearchSubmitted(false);
    setCurrentPage(1);
    getData();
  };

  const clearFilters = () => {
    setSelectedStoreIds(stores.map((store) => store.store_id));
    setSelectedDeliverIds([]);
    setSearchSubmitted(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearchText("");
    setCurrentPage(1);
    getData();
  };

  const handleStoreSelection = (selectedIds) => {
    if (selectedIds.length) {
      setSelectedStoreIds(selectedIds);
    } else {
      setSelectedStoreIds(stores.map((store) => store.store_id));
    }
  };

  const handleSupplierSelection = (selectedId) => {
    // Only allow single selection for supplier
    setSelectedDeliverIds(selectedId ? [selectedId] : []);
  };

  const storesOptions = useMemo(
    () =>
      stores.map((store) => ({
        label: store.store_name,
        value: store.store_id,
      })),
    [stores]
  );

  const deliverOptions = useMemo(
    () =>
      deliveries.map((item) => ({
        label: item?.deliver_name,
        value: item?.deliver_id,
      })),
    [deliveries]
  );

  const aggregatedData = useMemo(() => {
    if (!statsRaw?.length) return [];

    if (statsRaw[0]?.storeStocks) {
      return statsRaw;
    }

    const grouped = new Map();

    statsRaw.forEach((item) => {
      const productId = item?.goods_id?.goods_id;
      if (!productId) return;
      const storeId = item?.store_id?.store_id;
      const storeKey = `store_${storeId}`;
      const existing = grouped.get(productId) || {
        id: productId,
        productName: item?.goods_id?.goods_name || "",
        productCode: item?.goods_id?.goods_code || "",
        minimalStockCount: Number(item?.goods_id?.dead_limit) || 0,
        deliver: item?.deliver_id,
        storeStocks: {},
        storeMeta: {},
        totalStockLeft: 0,
        pricePerUnit: 0,
        image: item?.img_url,
        totalBoxes: 0,
        perBox: item?.each_box_count || 0,
      };

      const stockValue = Math.ceil(Number(item?.products_count) || 0);

      existing.storeStocks[storeKey] =
        (existing.storeStocks[storeKey] || 0) + stockValue;
      existing.storeMeta[storeKey] = item?.store_id;
      existing.totalStockLeft += stockValue;
      const boxCount = Math.ceil(Number(item?.products_box_count) || 0);
      existing.totalBoxes += boxCount;
      if (!existing.perBox && item?.each_box_count) {
        existing.perBox = item?.each_box_count;
      }

      const pricePerUnit =
        Number(item?.products_count_price || 0) *
        Number(item?.currency_id?.currency_amount || 1);
      if (pricePerUnit) {
        existing.pricePerUnit = pricePerUnit;
      }

      if (!existing.deliver && item?.deliver_id) {
        existing.deliver = item?.deliver_id;
      }

      if (!existing.image && item?.img_url) {
        existing.image = item?.img_url;
      }

      grouped.set(productId, existing);
    });

    return Array.from(grouped.values()).map((item) => {
      const mainStoreStock = Object.entries(item.storeMeta || {}).reduce(
        (sum, [key, store]) =>
          isMainStore(store) ? sum + (item.storeStocks?.[key] || 0) : sum,
        0
      );
      const baseline = mainStoreStock || item.totalStockLeft;

      const recommendedPurchase =
        item.minimalStockCount > 0
          ? Math.max(item.minimalStockCount - baseline, 0)
          : 0;

      const storeSummary = Object.values(item.storeMeta || {})
        .map((store) => store?.store_name)
        .filter(Boolean)
        .join(", ");

      return {
        ...item,
        mainStoreStock: baseline,
        recommendedPurchase,
        totalBoxes: item.totalBoxes,
        perBox: item.perBox,
        storeSummary,
      };
    });
  }, [statsRaw]);

  const filteredData = useMemo(() => {
    if (USE_MOCK) {
      return aggregatedData.filter((item) => {
        if (!item.minimalStockCount) {
          return false;
        }

        const baselineStock =
          typeof item.mainStoreStock === "number"
            ? item.mainStoreStock
            : item.totalStockLeft;

        if (baselineStock > item.minimalStockCount) {
          return false;
        }

        if (searchSubmitted && searchText) {
          const term = searchText.toLowerCase();
          const target =
            `${item.productName} ${item.productCode}`.toLowerCase();
          if (!target.includes(term)) {
            return false;
          }
        }

        if (selectedDeliverIds.length) {
          const deliverId = item?.deliver?.deliver_id;
          if (!deliverId || !selectedDeliverIds.includes(deliverId)) {
            return false;
          }
        }

        if (
          selectedStoreIds.length &&
          stores.length &&
          selectedStoreIds.length !== stores.length
        ) {
          const hasStore = selectedStoreIds.some(
            (storeId) => item.storeStocks?.[`store_${storeId}`]
          );
          if (!hasStore) {
            return false;
          }
        }

        return true;
      });
    }
    return aggregatedData;
  }, [
    aggregatedData,
    searchSubmitted,
    searchText,
    selectedDeliverIds,
    selectedStoreIds,
    stores.length,
  ]);

  const totalPages = useMemo(() => {
    if (serverPaginated && !USE_MOCK) {
      const pages = Math.ceil((totalCount || 0) / limit) || 1;
      return Math.max(pages, 1);
    }
    const pages = Math.ceil(filteredData.length / limit) || 1;
    return Math.max(pages, 1);
  }, [filteredData, limit, serverPaginated, totalCount]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const shouldSliceLocally = USE_MOCK || !serverPaginated;
    const sourceData = shouldSliceLocally
      ? filteredData.slice(startIndex, startIndex + limit)
      : filteredData;

    return sourceData.map((item, index) => ({
      ...item,
      key: startIndex + index + 1,
      selectionId: `statistics-${item.id}`,
    }));
  }, [filteredData, currentPage, limit, serverPaginated]);

  const visibleStores = useMemo(() => {
    const selectedSet = new Set(selectedStoreIds);
    const filtered = stores.filter(
      (store) => !selectedSet.size || selectedSet.has(store.store_id)
    );
    return filtered.sort((a, b) => {
      const aIsMain = isMainStore(a);
      const bIsMain = isMainStore(b);
      if (aIsMain && !bIsMain) return -1;
      if (!aIsMain && bIsMain) return 1;
      return 0;
    });
  }, [stores, selectedStoreIds]);

  const isRowSelected = useCallback(
    (selectionId) => statsSelection.some((item) => item.id === selectionId),
    [statsSelection]
  );

  const handleRowSelect = useCallback(
    (record, shouldSelect) => {
      if (shouldSelect) {
        const prepared = {
          id: record.selectionId,
          deliver_id: record?.deliver?.deliver_name || "",
          store_id: { store_name: record.storeSummary || "Barcha omborlar" },
          price: formatPrice(record.pricePerUnit),
          img: record.image,
          goods_name: record.productName,
          goods_code: record.productCode,
          products_count:
            record.recommendedPurchase > 0 ? record.recommendedPurchase : 1,
        };
        const filteredSelection = statsSelection.filter(
          (item) => item.id !== record.selectionId
        );
        dispatch(setData([...filteredSelection, prepared]));
      } else {
        dispatch(
          setData(
            statsSelection.filter((item) => item.id !== record.selectionId)
          )
        );
      }
    },
    [statsSelection, dispatch]
  );

  const handleQuantityChange = useCallback(
    (id, quantity) => {
      const numeric = Number(quantity);
      if (Number.isNaN(numeric) || numeric < 0) {
        return;
      }
      // Allow any positive number, no maximum cap
      dispatch(setQuantity({ id, q: numeric }));
    },
    [dispatch]
  );

  const handleDownload = async () => {
    if (!statsSelection.length) {
      toast.warn("Mahsulot tanlang");
      return;
    }

    try {
      // Dynamically load jsPDF and jspdf-autotable from CDN
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      // Load jsPDF if not already loaded
      if (!window.jspdf) {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        );
      }
      // Load autoTable plugin if not already loaded
      if (!window.jspdf.plugins || !window.jspdf.plugins.autotable) {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"
        );
      }

      const { jsPDF } = window.jspdf;

      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Prepare data with proper column order: No, Ombor, Mahsulot, Kod, Ta'minotchi, narx, zakaz miqdori
      const tableData = statsSelection.map((item, index) => [
        index + 1,
        item?.store_id?.store_name || "Barcha omborlar",
        item?.goods_name || "",
        item?.goods_code || "",
        item?.deliver_id || "",
        item?.price || "",
        item?.products_count || 0,
      ]);

      // Add title
      doc.setFontSize(18);
      doc.text("Statistika", 14, 15);

      // Add date
      const now = new Date();
      const dateStr = now.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Sana: ${dateStr}`, 14, 22);

      // Add table using autoTable
      doc.autoTable({
        startY: 28,
        head: [
          [
            "No",
            "Ombor",
            "Mahsulot",
            "Kod",
            "Ta'minotchi",
            "Narx",
            "Zakaz miqdori",
          ],
        ],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          halign: "center",
          cellPadding: 3,
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 }, // No
          1: { cellWidth: 30 }, // Ombor
          2: { cellWidth: 40 }, // Mahsulot
          3: { cellWidth: 25 }, // Kod
          4: { cellWidth: 30 }, // Ta'minotchi
          5: { halign: "center", cellWidth: 25 }, // Narx
          6: { halign: "center", cellWidth: 20 }, // Zakaz miqdori
        },
        styles: {
          fontSize: 9,
          font: "helvetica",
          overflow: "linebreak",
          cellWidth: "wrap",
        },
        margin: { top: 28, left: 10, right: 10 },
      });

      // Generate filename with timestamp
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
      const filename = `Statistika_${timestamp}.pdf`;

      // Save PDF
      doc.save(filename);
      toast.success("PDF muvaffaqiyatli yuklab olindi");
    } catch (error) {
      console.error("PDF yaratishda xatolik:", error);
      toast.error("PDF yaratishda xatolik yuz berdi");
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "No̱",
        dataIndex: "key",
        width: 60,
        fixed: "left",
      },
      {
        title: "Rasm",
        width: 80,
        fixed: "left",
        render: (_, record) => (
          <div className="table-img-col">
            <img
              src={record?.image || "/assets/img/no data.png"}
              alt={record?.productName || ""}
              height={40}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (record?.image) {
                  window.open(record.image);
                }
              }}
            />
          </div>
        ),
      },
      {
        title: "Mahsulot",
        dataIndex: "productName",
        width: 220,
        fixed: "left",
      },
      {
        title: "Kod",
        dataIndex: "productCode",
        width: 160,
        fixed: "left",
      },
      {
        title: "Ta'minotchi",
        width: 180,
        render: (_, record) => record?.deliver?.deliver_name || "-",
      },
    ];

    const storeColumns = visibleStores.map((store) => {
      const isMain = isMainStore(store);
      return {
        title: (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>{store.store_name}</span>
            {isMain && (
              <span
                style={{
                  fontSize: "10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                Asosiy
              </span>
            )}
          </div>
        ),
        dataIndex: `store_${store.store_id}`,
        width: 160,
        render: (_, record) => {
          const value = record.storeStocks?.[`store_${store.store_id}`] || 0;
          const isLowStock =
            record.minimalStockCount && value <= record.minimalStockCount;
          const isMainStoreLow =
            isMain &&
            record.minimalStockCount &&
            record.mainStoreStock <= record.minimalStockCount;

          const cellStyle = {
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: isMainStoreLow
              ? darkMode
                ? "rgba(255, 193, 7, 0.2)"
                : "rgba(255, 193, 7, 0.15)"
              : isLowStock
              ? darkMode
                ? "rgba(255, 193, 7, 0.1)"
                : "rgba(255, 193, 7, 0.08)"
              : "transparent",
            border: isMain
              ? darkMode
                ? "1px solid rgba(255, 193, 7, 0.4)"
                : "1px solid rgba(255, 193, 7, 0.3)"
              : "1px solid transparent",
            fontWeight: isMainStoreLow ? "bold" : isLowStock ? "600" : "normal",
            color:
              isMainStoreLow || isLowStock
                ? "#ffc107"
                : darkMode
                ? "#e0e0e0"
                : "#333",
          };

          return (
            <div style={cellStyle}>
              <div style={{ fontSize: "13px", marginBottom: "2px" }}>
                {formatCount(value)}
              </div>
              {isMain && record.minimalStockCount > 0 && (
                <div
                  style={{
                    fontSize: "10px",
                    opacity: 0.7,
                    color: isMainStoreLow ? "#ffc107" : "inherit",
                  }}
                >
                  Min: {formatCount(record.minimalStockCount)}
                </div>
              )}
            </div>
          );
        },
      };
    });

    const otherColumns = [
      {
        title: "Jami qolgan",
        dataIndex: "totalStockLeft",
        width: 140,
        render: (_, record) => {
          const warningStyle =
            record.minimalStockCount &&
            record.totalStockLeft <= record.minimalStockCount
              ? { color: "#ffc107", fontWeight: "bold" }
              : {};

          return (
            <span style={warningStyle}>
              {formatCount(record.totalStockLeft)}
            </span>
          );
        },
      },
      {
        title: "Minimal",
        dataIndex: "minimalStockCount",
        width: 120,
        render: (text) => formatCount(text),
      },
      {
        title: "Quti",
        dataIndex: "totalBoxes",
        width: 110,
        render: (_, record) =>
          formatCount(record.totalBoxes ?? record.products_box_count ?? 0),
      },
      {
        title: "Har bir qutida",
        dataIndex: "perBox",
        width: 140,
        render: (_, record) =>
          formatCount(record.perBox ?? record.each_box_count ?? 0),
      },
      {
        title: "Narx (dona)",
        dataIndex: "pricePerUnit",
        width: 170,
        render: (text) => formatPrice(text),
      },
      {
        title: "Zakaz miqdori",
        width: 190,
        render: (_, record) => {
          const selectedItem = statsSelection.find(
            (item) => item.id === record.selectionId
          );
          if (!selectedItem) {
            return (
              <span className="statistics-qty-placeholder">
                {record.recommendedPurchase
                  ? `${addComma(record.recommendedPurchase)} dona`
                  : "—"}
              </span>
            );
          }

          const quantity =
            Number(selectedItem.products_count) > 0
              ? selectedItem.products_count
              : 1;

          return (
            <div className={`quantityWrapper ${darkMode ? "dark" : ""}`}>
              <button
                className="quantityBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(
                    selectedItem.id,
                    Math.max(Number(quantity) - 1, 0)
                  );
                }}
              >
                -
              </button>
              <input
                type="text"
                className="quantityInput"
                value={quantity}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  handleQuantityChange(selectedItem.id, e.target.value)
                }
                onKeyPress={(e) => {
                  if (isNaN(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <button
                className="quantityBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(selectedItem.id, Number(quantity) + 1);
                }}
              >
                +
              </button>
            </div>
          );
        },
      },
      {
        title: "Belgilash",
        width: 120,
        fixed: "right",
        render: (_, record) => (
          <Checkbox
            checked={isRowSelected(record.selectionId)}
            onChange={(e) => handleRowSelect(record, e.target.checked)}
          />
        ),
      },
    ];

    return [...baseColumns, ...storeColumns, ...otherColumns];
  }, [
    visibleStores,
    isRowSelected,
    darkMode,
    statsSelection,
    handleQuantityChange,
    handleRowSelect,
  ]);

  const totalWidth = useMemo(
    () => columns.reduce((sum, col) => sum + (col.width || 100), 0),
    [columns]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`statistics-page ${darkMode ? "dark" : null}`}>
      <div className={`filter-wrapper statistics ${darkMode ? "dark" : null}`}>
        <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
          <Select
            mode="multiple"
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Omborni tanlang"
            className="select"
            value={selectedStoreIds}
            onChange={handleStoreSelection}
            maxTagCount="responsive"
            options={storesOptions}
          />
        </div>
        <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Ta'minotchi"
            className="select"
            value={selectedDeliverIds.length > 0 ? selectedDeliverIds[0] : null}
            onChange={handleSupplierSelection}
            options={deliverOptions}
          />
        </div>

        <div className="filter-btn-group">
          <button type="button" className="filter-btn" onClick={clearFilters}>
            Tozalash
          </button>
        </div>
      </div>

      <Search
        handleSearch={handleSearchClick}
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
          dataSource={paginatedData}
          pagination={false}
          rowClassName={(record) =>
            isRowSelected(record.selectionId) ? "statistics-row-selected" : ""
          }
          onRow={(record) => {
            const isSelected = isRowSelected(record.selectionId);
            const isLowStock =
              record.minimalStockCount &&
              record.totalStockLeft <= record.minimalStockCount;

            // If selected, use dark-blue background with white text
            if (isSelected) {
              return {
                style: {
                  backgroundColor: "#0d47a1",
                  color: "#ffffff",
                },
              };
            }

            // Otherwise, apply warning style for low stock
            const warningStyle = isLowStock
              ? darkMode
                ? getWarningColorDark()
                : getWarningColor()
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

      <div className="statistics-download">
        <button
          className={`primary-btn low-height ${darkMode ? "dark" : null}`}
          onClick={handleDownload}
          disabled={!statsSelection.length}
        >
          Yuklab olish <FilePdf size={16} style={{ marginTop: "-4px" }} />
        </button>
      </div>
    </div>
  );
}
