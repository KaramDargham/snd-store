import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertComponent = ({ status, message }) => {
  useEffect(() => {
    if (status === "success") {
      toast.success(message || "Operation successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { background: "#4CAF50", color: "white" },
      });
    } else if (status === "error") {
      toast.error(message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { background: "#F44336", color: "white" },
      });
    }
    else if (status === "admin") {
      toast.error(message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { background: "#F44336", color: "white" },
      });
    }
  }, [status, message]); // Re-run when status or message changes

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default AlertComponent;