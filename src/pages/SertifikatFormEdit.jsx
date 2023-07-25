import React, { useEffect } from "react";
import Layout from "./Layout";
import SertifikatEdit from "../components/Sertifikat/SertifikatEdit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlices";

const SertifikatFormEdit = () => {
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
  }, [isError, navigate]);

  return (
    <Layout>
      <SertifikatEdit />
    </Layout>
  );
};

export default SertifikatFormEdit;