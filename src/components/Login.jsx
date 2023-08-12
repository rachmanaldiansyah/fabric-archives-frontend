import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser, reset } from "../features/AuthSlices";
import { FaEnvelope, FaUnlock } from "react-icons/fa";
import Logo from "../img/logo-mtc.png";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const handleInputChange = (e, setterFunction) => {
    const inputValue = e.target.value;

    // Menghilangkan spasi dari input value
    const sanitizedValue = inputValue.replace(/\s/g, "");

    // Update state hanya jika nilai sudah dihilangkan spasi
    if (sanitizedValue !== inputValue) {
      setterFunction(sanitizedValue);
    } else {
      setterFunction(inputValue);
    }
  };

  const showSuccessNotification = () => {
    Toastify({
      text: "Login berhasil, selamat datang " + email,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff0000, #940000)",
      },
    }).showToast();
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const Auth = (e) => {
    e.preventDefault();

    if (!email || !password) {
      showErrorNotification("Masukkan email dan password anda.");
      return;
    } else if (!validateEmail(email)) {
      showErrorNotification(
        "Format email tidak valid, silahkan periksa kembali."
      );
      return;
    }

    showSuccessNotification();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <section className="hero has-background-grey-lighter is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              <form onSubmit={Auth} className="box">
                <p className="title has-text-centered has-text-weight-semibold is-uppercase mt-2">
                  Login Pengguna
                </p>
                <div className="columns is-centered">
                  <div className="column is-half">
                    <img
                      src={Logo}
                      width="250"
                      height="250"
                      className="center"
                      alt="logo"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      value={email}
                      onChange={(e) => handleInputChange(e, setEmail)}
                      placeholder="Email"
                    />
                    <span class="icon is-small is-left">
                      <FaEnvelope />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => handleInputChange(e, setPassword)}
                      placeholder="Password"
                    />
                    <span className="icon is-small is-left">
                      <FaUnlock />
                    </span>
                  </div>
                </div>
                <div className="field mt-5">
                  <button
                    type="submit"
                    className="button is-primary is-fullwidth"
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </button>
                </div>
                <div className="field mt-5 has-text-centered">
                  Tidak Punya Akun? <Link to={"/register"} className="is-underlined">Registrasi</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
