import React, { useEffect } from "react";
import Layout from "../Layout";
import SertifikatList from "../../components/Sertifikat/SertifikatList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";

const SertifikatFormList = () => {
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
      <SertifikatList />
    </Layout>
  );
};

export default SertifikatFormList;
