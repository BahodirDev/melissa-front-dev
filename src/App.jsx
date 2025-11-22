import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  BoshSahifa,
  Clients,
  Currency,
  Debts,
  Deliver,
  Employees,
  Goods,
  Home,
  Login,
  MainPage,
  PageNotFound,
  Products,
  Reports,
  Return,
  Settings,
  Store,
  ClientsInfo,
  EmployeePerformance,
} from "./components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Monitoring from "./pages/monitoring/Monitoring";
import SocketHandle from "./io/client.io";
import contextTriggerHandler from "./io/handler/contextTrigger-Handler";
import { useDispatch } from "react-redux";
import Statistics from "./pages/statistics/Statistics";

export default function App(url) {
  const dispatch = useDispatch();
  const sockethandler = new SocketHandle(url.url);
  useEffect(() => {
    sockethandler
      .initialize()
      .then(() => {
        console.log("socket ready ✅");
        reportSocketDatahandler("report_event");
      })
      .catch(console.error);
  }, []);

  function reportSocketDatahandler(trigger) {
    console.log("Trigger", trigger);
    sockethandler.consumer(trigger, (data) => {
      console.log("Yangi hisobot keldi:", data);
      // return data;
      contextTriggerHandler(trigger, data, dispatch);
    });
  }

  return (
    <>
      <ToastContainer
        autoClose={3000}
        position="top-center"
        hideProgressBar
        pauseOnFocusLoss={false}
      />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainPage />}>
          <Route index element={<Statistics />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/products" element={<Products />} />
          <Route path="/goods" element={<Goods />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/store" element={<Store />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deliver" element={<Deliver />} />
          <Route path="/clients">
            <Route index element={<Clients />} />
            <Route path=":id" element={<ClientsInfo />} />
          </Route>
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/return" element={<Return />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/employee-performance">
            <Route index element={<EmployeePerformance />} />
            <Route path=":employeeId" element={<EmployeePerformance />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
