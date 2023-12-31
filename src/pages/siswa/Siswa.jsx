import React, { useEffect } from "react";
import Layout from "../Layout";
import SiswaList from "../../components/Siswa/SiswaList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";

const SiswaFormList = () => {
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
      <SiswaList />
    </Layout>
  );
};

export default SiswaFormList;
