import { FC, useState, CSSProperties } from "react";
import { PuffLoader } from "react-spinners";
import ClipLoader from "react-spinners/ClipLoader";

type Loader = {
  message: string | undefined;
};

export const Loader: FC<Loader> = ({ message }) => {

  const override: CSSProperties = {
    display: "flex",
    margin: "0 auto",
    borderColor: "#0c45e6",
  };

  return (
    <div className="flex justify-content-center align-items-center">
      {message && <p className="text-center">{message}</p>}
      <PuffLoader
        cssOverride={override}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />      
  </div>
  );
};