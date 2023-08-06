import React, { useEffect } from "react";
import SertifikatConfirm from "../../components/Sertifikat/SertifikatConfirm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";
import Layout from "../Layout";

const SertifikatFormConfirm = () => {
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
            <SertifikatConfirm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SertifikatFormConfirm;
