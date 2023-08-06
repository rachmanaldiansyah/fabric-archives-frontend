import React, { useEffect } from "react";
import Layout from "../../pages/Layout";
import IjazahRejected from "../../components/Ijazah/IjazahRejected";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";

const IjazahFormRejected = () => {
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
      <IjazahRejected />
    </Layout>
  );
};

export default IjazahFormRejected;
