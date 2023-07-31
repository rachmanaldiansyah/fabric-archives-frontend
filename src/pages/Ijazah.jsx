import React, { useEffect } from "react";
import Layout from "./Layout"
import IjazahList from "../components/Ijazah/IjazahList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/AuthSlices";

const Ijazah = () => {
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
          <div className="column is-11">
            <IjazahList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ijazah;