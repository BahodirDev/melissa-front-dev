import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  addData,
  editData,
  removeStore,
  setData,
  setLoading,
  setQuantity,
} from "../../components/reducers/store";
import { stringCheck } from "../../components/validation";
import { get, patch, post, remove } from "../../customHook/api";
import StoreList from "./StoreList";
import "./store.css";
import { toast } from "react-toastify";
import AddModal from "../../components/add/AddModal";
import { Factory, Info } from "@phosphor-icons/react";
import InfoItem from "../../components/info_item/InfoItem";
import Search from "../../components/search/Search";
import Pagination from "../../components/pagination/Pagination";
import { Select } from "antd";

export default function Store() {
  const navigate = useNavigate();
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
  const state = useSelector((state) => state.store);
  const dispatch = useDispatch();

  const [btn_loading, setBtn_loading] = useState(false);
  const [objId, setObjId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPage, setTotalPage] = useState(1);
  const didMount = useRef(false);

  // new data
  const [storeName, setStoreName] = useState("");

  const getData = () => {
    dispatch(setLoading(true));
    if (inputRef.current?.value.length > 0) {
      handleSearch();
    } else {
      get(`/store/store-list?limit=${limit}&page=${currentPage}`).then(
        (data) => {
          console.log("data store", data);
          if (data?.status === 200 || data?.status === 201) {
            // setTotalPage(Math.ceil(data?.data?.stores / limit))
            setTotalPage(Math.ceil(data?.data?.length / limit));
            // dispatch(setData(data?.data?.data))
            dispatch(setData(data?.data || []));
            // dispatch(setQuantity(data?.data?.stores))
            dispatch(setQuantity(data?.data?.length));
          } else {
            setTotalPage(1);
            toast.error("Nomalum server xatolik");
          }
          dispatch(setLoading(false));
        }
      );
    }
  };

  useEffect(() => {
    if (localStorage.getItem("role") !== "1") navigate("/*");
    getData();
  }, []);

  useEffect(getData, [currentPage]);

  const handleSearch = () => {
    dispatch(setLoading(true));
    setSearchSubmitted(true);

    post(`/store/store-search?limit=${limit}&page=${currentPage}`, {
      search: inputRef.current?.value,
    }).then((response) => {
      if (response.status === 200) {
        const { data } = response;

        // setTotalPage(Math.ceil(data?.stores / limit))
        setTotalPage(Math.ceil(data?.length / limit));
        // setFilteredData(data?.data)
        setFilteredData(data || []);
        // dispatch(setQuantity(data?.stores))
        dispatch(setQuantity(data?.length));

        if (!data?.data?.length) setCurrentPage(1);
      } else {
        setTotalPage(1);
        toast.error("Nomalum server xatolik");
      }
      dispatch(setLoading(false));
    });
  };

  const clearSearch = () => {
    // setSearchSubmitted(false)
    // setFilteredData([])
    inputRef.current.value = "";
  };

  useEffect(() => {
    setCurrentPage(1);
    if (didMount.current) {
      handleSearch();
    } else {
      didMount.current = true;
    }
  }, [limit]);

  const addNewStore = () => {
    setSubmitted(true);
    if (storeName.length) {
      setBtn_loading(true);
      if (objId) {
        patch(`/store/store-patch/${objId}`, {
          store_name: storeName.trim(),
        }).then((data) => {
          if (data?.status === 201) {
            dispatch(editData(data?.data));
            clearAndClose();
            toast.success("Malumot muvoffaqiyatli o'zgartirildi");
          } else if (data?.response?.data?.error === "STORE_ALREADY_EXIST") {
            toast.warn("Bunday ombor allaqachon mavjud");
          } else {
            toast.error("Nomalum server xatolik");
          }
          setBtn_loading(false);
        });
      } else {
        post("/store/store-post", { store_name: storeName }).then((data) => {
          if (data?.status === 201) {
            dispatch(addData(data?.data));
            dispatch(setQuantity());
            clearAndClose();
            toast.success("Ombor muvoffaqiyatli qo'shildi");
          } else if (data?.response?.data?.error === "STORE_ALREADY_EXIST") {
            toast.warn("Bunday ombor allaqachon mavjud");
          } else {
            toast.error("Nomalum server xatolik");
          }
          setBtn_loading(false);
        });
      }
    }
  };

  const deleteStore = (id) => {
    dispatch(setLoading(true));
    remove(`/store/store-delete/${id}`).then((data) => {
      if (data?.status === 200) {
        dispatch(removeStore(id));
        dispatch(setQuantity());
        toast.success("Ombor muvoffaqiyatli o'chirildi");
        clearAndClose();
      } else if (data?.response?.data?.error === "PRODUCT_FOUND") {
        toast.warn("Omborda maxsulot borligi uchun o'chirilmadi");
      } else {
        toast.error("Nomalum server xatolik");
      }
      dispatch(setLoading(false));
    });
  };

  const editStore = (id) => {
    const index = state?.data.findIndex((item) => item.store_id === id);
    if (index !== -1) {
      setStoreName(state?.data[index]?.store_name);
      setObjId(id);
      setAddModalDisplay("block");
      setAddModalVisible(true);
    } else {
      toast.error("Nomalum server xatolik");
    }
  };

  const clearAndClose = () => {
    setStoreName("");
    setObjId("");
    setSubmitted(false);
    setBtn_loading(false);
    setAddModalVisible(false);
    setTimeout(() => {
      setAddModalDisplay("none");
    }, 300);
  };

  const clearOnly = () => {
    setStoreName("");
    setObjId("");
    setSubmitted(false);
    setBtn_loading(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (inputRef.current.value === "") {
      setSearchSubmitted(false);
    }
  };

  return (
    <>
      <AddModal name={objId ? "Ombor tahrirlash" : "Ombor qo'shish"}>
        <div
          className={`input-wrapper modal-form regular 
					${submitted && stringCheck(storeName.trim()) !== null && "error"} ${
            darkMode ? "dark" : null
          }`}
        >
          <label>Ombor nomi</label>
          <input
            type="text"
            placeholder="Ombor nomini kiriting"
            className="input"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          {submitted && stringCheck(storeName.trim()) !== null && (
            <Info size={20} />
          )}
          <div className="validation-field">
            <span>
              {submitted &&
                stringCheck(storeName.trim(), "Nom kiritish majburiy")}
            </span>
          </div>
        </div>
        <div className="modal-btn-group">
          <button
            className={`primary-btn ${darkMode ? "dark" : null}`}
            disabled={btn_loading}
            onClick={addNewStore}
          >
            {objId ? "Saqlash" : "Qo'shish"}{" "}
            {btn_loading && (
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
                style={{ marginLeft: "5px" }}
              ></span>
            )}
          </button>
          <button
            className={`secondary-btn ${darkMode ? "dark" : null}`}
            onClick={clearAndClose}
          >
            Bekor qilish
          </button>
        </div>
      </AddModal>

      <div className="info-wrapper">
        <InfoItem
          value={state?.quantity}
          name="Omborlar soni"
          icon={<Factory size={24} color="var(--color-primary)" />}
          iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
          darkMode={darkMode}
        />
      </div>

      <Search
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        clearOnly={clearOnly}
        darkMode={darkMode}
      />

      {state?.loading ? (
        <Loader />
      ) : (
        <>
          <StoreList
            data={searchSubmitted ? filteredData : state?.data}
            deleteStore={deleteStore}
            editStore={editStore}
            showDropdown={showDropdown}
            setshowDropdown={setshowDropdown}
            darkMode={darkMode}
          />

          {totalPage > 1 ? (
            <>
              <Pagination
                pages={totalPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                darkMode={darkMode}
              />

              <div
                className={`input-wrapper ${
                  darkMode ? "dark" : null
                } pagination-limit`}
              >
                <Select
                  placeholder="Miqdor"
                  className="select"
                  value={limit}
                  onChange={(e) => {
                    setLimit(e);
                    setCurrentPage(1);
                  }}
                >
                  <Select.Option
                    value="10"
                    className={`${darkMode ? "dark" : null}`}
                  >
                    <div>
                      <span>10</span>
                    </div>
                  </Select.Option>
                  <Select.Option
                    value="25"
                    className={`${darkMode ? "dark" : null}`}
                  >
                    <div>
                      <span>25</span>
                    </div>
                  </Select.Option>
                  <Select.Option
                    value="50"
                    className={`${darkMode ? "dark" : null}`}
                  >
                    <div>
                      <span>50</span>
                    </div>
                  </Select.Option>
                  <Select.Option
                    value="100"
                    className={`${darkMode ? "dark" : null}`}
                  >
                    <div>
                      <span>100</span>
                    </div>
                  </Select.Option>
                </Select>
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
}
