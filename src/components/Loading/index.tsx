import { Dialog } from "@mui/material";
import React from "react";

interface Props {
  open: boolean;
}

export const LoadingDialog: React.FC<Props> = ({ open }) => {
  // if (!open) return null; // Render nothing if the modal is not open

  return (
    <Dialog open={open}>
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-70" >
      <div className="p-0 rounded-lg shadow-lg flex items-center justify-center bg-transparent">
        <div className="w-24 h-24 border-4 border-[#F1592A] bg-white border-solid border-t-transparent rounded-full animate-spin flex items-center justify-center">
          <img
            src="/assets/image/loadding.png"
            alt="Loading..."
            className="w-25 h-25 rounded-full"
          />
        </div>
      </div>
    </div>
  </Dialog>
  );
};
