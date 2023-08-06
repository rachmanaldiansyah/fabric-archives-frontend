import React, { useEffect } from "react";
import Layout from "../../pages/Layout";
import IjazahConfirm from "../../components/Ijazah/IjazahConfirm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";

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
      <IjazahConfirm />
    </Layout>
  );
};

export default IjazahFormConfirm;
