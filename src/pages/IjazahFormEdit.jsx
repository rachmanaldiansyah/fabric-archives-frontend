import React, { useEffect } from "react";
import Layout from "./Layout";
import IjazahEdit from "../components/Ijazah/IjazahEdit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlices";

const IjazahFormEdit = () => {
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
      <IjazahEdit />
    </Layout>
  );
};

export default IjazahFormEdit;