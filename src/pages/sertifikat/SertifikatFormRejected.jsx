import React, { useEffect } from "react";
import Layout from "../Layout";
import SertifikatRejected from "../../components/Sertifikat/SertifikatRejected";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";

const SertifikatFormRejected = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.roles !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <SertifikatRejected />
    </Layout>
  );
};

export default SertifikatFormRejected;