import React, { useEffect } from "react";
import Layout from "../../pages/Layout";
import IjazahCreate from "../../components/Ijazah/IjazahCreate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/AuthSlices";

const IjazahFormCreate = () => {
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
      <IjazahCreate />
    </Layout>
  );
};

export default IjazahFormCreate;