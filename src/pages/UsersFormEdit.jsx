import React, { useEffect } from "react";
import Layout from "./Layout";
import UsersEdit from "../components/Users/UsersEdit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlices";

const UsersFormEdit = () => {
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
      <UsersEdit />
    </Layout>
  );
};

export default UsersFormEdit;