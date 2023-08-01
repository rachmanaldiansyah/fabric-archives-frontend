import React, { useEffect } from "react";
import Layout from "./Layout";
import IjazahConfirm from "../components/Ijazah/IjazahConfirm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlices";

const IjazahFormConfirm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-12">
            <IjazahConfirm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IjazahFormConfirm;