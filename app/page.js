"use client";
import { useEffect, useRef, useState } from "react";
import "./styles.css";
import {
  checkServer,
  getCaption,
  getEmotionCaption,
  logout,
  regenerateCaption,
  validateUser,
} from "./services/caption.service";
import _ from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LuRefreshCcw,
  LuLayoutDashboard,
  LuLayers,
  LuSettings2,
  LuLogOut,
} from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const hiddenFileInput = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState(null);
  const [emotionCaption, setEmotionCaption] = useState("");
  const [genericCaption, setGenericCaption] = useState("");
  const [selectedVal, setSelectedVal] = useState("Generic");
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const pathname = usePathname();
  useEffect(() => {
    setLoading(true);
    validateUser()
      .then((res) => {
        if (!_.isEmpty(res)) {
          checkServer()
            .then(() => {
              toast.success("Server Connected 😄!");
              setLoading(false);
            })
            .catch((error) => {
              toast.error("It seems like there's an issue with the server 😕");
              setLoading(false);
            });
        } else {
          toast.error("Something wrong!");
          setLoading(false);
          router.push("/login");
          localStorage.clear();
        }
      })
      .catch((error) => {
        toast.error("Something wrong!");
        setLoading(false);
        router.push("/login");
        localStorage.clear();
      });
  }, []);
  const uploadImage = () => {
    hiddenFileInput.current.click();
  };

  const handleRefresh = () => {
    const formData = new FormData();
    console.log("Imagee", selectedImage);
    formData.append("file", selectedImage);
    setLoading(true);
    regenerateCaption(formData)
      .then((response) => {
        setEmotionCaption(response.data["image-description"]);
        console.log('ressponse', response.data.caption)
        setCaptions(response.data.caption);
        setGenericCaption(response.data.caption);
        setLoading(false);
      })
      .catch((error) => {
        setSelectedImage(null);
        toast.error(error.message || "Something wents wrong!");
        setLoading(false);
      });
    setCaptions(null);
  };

  const handleChange = (event) => {
    const fileInput = event.target;
    setSelectedVal("Generic");
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      setLoading(true);
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      radioButtons.forEach((radioButton) => {
        radioButton.checked = false;
      });
      getCaption(formData)
        .then((response) => {
          setEmotionCaption(response.data["image-description"]);
          setCaptions(response.data.captions);
          setGenericCaption(response.data.captions);
          setLoading(false);
        })
        .catch((error) => {
          setSelectedImage(null);
          toast.error(error.message || "Something wents wrong!");
          setLoading(false);
        });
      fileInput.value = "";
      setCaptions(null);
    }
  };

  const handleOptionChange = (changeEvent) => {
    setSelectedVal(changeEvent.target.value);
    const payload = {
      image_description: emotionCaption,
      emotion: changeEvent.target.value,
    };
    if (changeEvent.target.value == "Generic") {
      setCaptions(genericCaption);
    } else {
      setLoading(true);
      getEmotionCaption(payload)
        .then((response) => {
          setCaptions(response.data.emotion_caption);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message || "Something wents wrong!");
          setLoading(false);
        });
    }
  };

  return (
    <main className="body-main">
      <ToastContainer />
      <header className="header" id="header">
        <div className="header_toggle">
          {/* <span style={{ color: "white" }} id="header-toggle"><i data-feather="menu"></i></span> */}
        </div>
        <div className="header_img">
          <img src="https://i.imgur.com/hczKIze.jpg" alt="" />
        </div>
      </header>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <a href="#" className="nav_logo">
              <span style={{ color: "white" }}>
                <LuLayers style={{ fontSize: "20px" }} />
              </span>
              <span className="nav_logo-name">Image Caption</span>
            </a>
            <div className="nav_list">
              <Link href="/" className="nav_link active">
                <span style={{ color: "white" }}>
                  <LuLayoutDashboard style={{ fontSize: "20px" }} />
                </span>
              </Link>
              <Link href="/setting" className="nav_link">
                <span style={{ color: "white" }}>
                  <LuSettings2 style={{ fontSize: "20px" }} />
                </span>
              </Link>
              <Link
                href="/login"
                onClick={() => {
                  localStorage.clear();
                }}
                className="nav_link"
              >
                <span style={{ color: "white" }}>
                  <RxExit style={{ fontSize: "20px" }} />
                </span>
              </Link>
            </div>
          </div>
          {/* <a className="nav_link" onClick={() => {
            logout();
            router.push("/login");
          }}>
            <span style={{ color: "white" }}><LuLogOut style={{ fontSize: "20px" }} /></span>
            <span className="nav_name">SignOut</span>
          </a> */}
        </nav>
      </div>
      <div className="height-100 main-section">
        <div className="main-card">
          <div className="header-section">
            <div className="row">
              <div className="col-8">
                <img
                  style={{ maxWidth: "10%", marginTop: "10px" }}
                  src="https://i.ibb.co/6DWKXZL/logo-light.png"
                />
              </div>
              <div className="col-4">
                <button
                  className={`main-btn ${loading ? "disabled-button" : ""}`}
                  disabled={loading}
                  onClick={uploadImage}
                >
                  Upload
                </button>
                <input
                  id="uploadFile"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  name="image"
                  className="img"
                />
              </div>
            </div>
          </div>

          <div
            className="center"
            style={{
              margin: mode == "ppt" ? "0" : "",
              padding:
                mode == "ppt" &&
                captions &&
                mode == "ppt" &&
                (!loading || (loading && captions))
                  ? "0px 40px"
                  : "40px",
            }}
          >
            <div className="row">
              <div
                className={mode == "ppt" ? "col-xxl-12" : "col-xxl-4"}
                style={{
                  visibility:
                    mode == "ppt" &&
                    captions &&
                    mode == "ppt" &&
                    (!loading || (loading && captions))
                      ? "hidden"
                      : "visible",
                  opacity:
                    mode == "ppt" &&
                    captions &&
                    mode == "ppt" &&
                    (!loading || (loading && captions))
                      ? "0"
                      : "1",
                  transition: "opacity 2s, visibility 2s",
                }}
              >
                <div
                  className="clipped"
                  style={{
                    background: `url(${
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : "https://s27363.pcdn.co/wp-content/uploads/2020/05/Best-Things-to-do-in-London-1200x900.jpg.optimal.jpg"
                    })`,
                    backgroundRepeat: "no-repeat !important",
                    backgroundSize: "cover",
                    // filter: loading && !captions ? 'blur(5px)' : 'none',
                    height:
                      captions &&
                      mode == "ppt" &&
                      (!loading || (loading && captions))
                        ? "0"
                        : "50vh",
                    margin: mode == "ppt" ? "0% 0%" : "none",
                    transition: "margin 2s, height 2s",
                  }}
                >
                  {loading && !captions && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgb(17 17 17 / 70%)",
                        display: "flex",
                        color: "black",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="scroller">
                        <div className="inner">
                          <p>Please wait...</p>
                          <p>We are currently processing your image...</p>
                          <p>You can also generate caption with emotions</p>
                          <p>Take a breath we are close enough...</p>
                          <p>It won&apos;t be much longer...</p>
                          <p>We&apos;re making progress, stay tuned...</p>
                          <p>Your image is in good hands...</p>
                          <p>Hang tight while we do the heavy lifting...</p>
                          <p>Hold on for just a moment...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={mode == "ppt" ? "col-xxl-12" : "col-xxl-8"}>
                <table style={{ width: "100%", margin: "3.5% 0%" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "0px" }}>
                        <div
                          className="clipped"
                          style={{
                            visibility:
                              mode == "ppt" &&
                              captions &&
                              mode == "ppt" &&
                              (!loading || (loading && captions))
                                ? "visible"
                                : "hidden",
                            opacity:
                              mode == "ppt" &&
                              captions &&
                              mode == "ppt" &&
                              (!loading || (loading && captions))
                                ? "1"
                                : "0",
                            background: `url(${
                              selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : "https://s27363.pcdn.co/wp-content/uploads/2020/05/Best-Things-to-do-in-London-1200x900.jpg.optimal.jpg"
                            })`,
                            backgroundRepeat: "no-repeat !important",
                            backgroundSize: "cover",
                            height:
                              mode == "ppt" &&
                              captions &&
                              mode == "ppt" &&
                              (!loading || (loading && captions))
                                ? "15vh"
                                : 0,
                            width:
                              mode == "ppt" &&
                              captions &&
                              mode == "ppt" &&
                              (!loading || (loading && captions))
                                ? "90%"
                                : 0,
                            marginLeft: "10px",
                            transition: "opacity 2s, visibility 2s, height 2s",
                          }}
                        ></div>
                        <div className="emotions">
                          <div className="loadbox">
                            <form>
                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Generic"
                                  checked={selectedVal == "Generic"}
                                  disabled={loading || !emotionCaption}
                                  id="a21"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a21"
                                >
                                  💻 Generic
                                </label>
                              </div>

                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Serious"
                                  checked={selectedVal == "Serious"}
                                  disabled={loading || !emotionCaption}
                                  id="a25"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a25"
                                >
                                  &#128528; Serious
                                </label>
                              </div>

                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Cool"
                                  checked={selectedVal == "Cool"}
                                  disabled={loading || !emotionCaption}
                                  id="a50"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a50"
                                >
                                  &#x1F60E; Cool
                                </label>
                              </div>

                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Funny"
                                  checked={selectedVal == "Funny"}
                                  disabled={loading || !emotionCaption}
                                  id="a75"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a75"
                                >
                                  &#128514; Funny
                                </label>
                              </div>

                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Informative"
                                  checked={selectedVal == "Informative"}
                                  disabled={loading || !emotionCaption}
                                  id="a76"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a76"
                                >
                                  📄 Informative
                                </label>
                              </div>

                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Ecstatic"
                                  checked={selectedVal == "Ecstatic"}
                                  disabled={loading || !emotionCaption}
                                  id="a77"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a77"
                                >
                                  🙌🏻 Ecstatic
                                </label>
                              </div>

                              <div className="buttonx">
                                <input
                                  type="radio"
                                  value="Controversial"
                                  checked={selectedVal == "Controversial"}
                                  disabled={loading || !emotionCaption}
                                  id="a80"
                                  name="check-substitution-2"
                                  onChange={handleOptionChange}
                                />
                                <label
                                  className={`btn btn-default`}
                                  htmlFor="a80"
                                >
                                  😲 Controversial
                                </label>
                              </div>
                            </form>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className="caption-section card"
                          style={{
                            width: mode == "ppt" ? "100%" : "",
                            transition: "width 0.05s",
                            height: mode == "ppt" ? "75vh" : "",
                            margin: mode == "ppt" ? "0% 0%" : "0",
                          }}
                        >
                          <div className="card-header caption-header">
                            <div style={{ color: "white" }}>Captions</div>
                            <div>
                              <button
                                className="icon"
                                disabled={loading}
                                onClick={handleRefresh}
                              >
                                <LuRefreshCcw
                                  className={`icon ${
                                    loading ? "refresh-start" : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="">
                              {!loading && !_.isEmpty(captions) && (
                                <div className="row">
                                  <div
                                    className="col-12"
                                    style={{ whiteSpace: "pre-wrap" }}
                                  >
                                    <div
                                      className={`${
                                        captions && mode == "ppt"
                                          ? "typewriter2"
                                          : "typewriter"
                                      }  monospace big-caret lorem`}
                                    >
                                      <p>{captions}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {loading && (
                                <div className="row">
                                  <div className="col-12">
                                    <div className="preloader">
                                      <div className="lines">
                                        <div className="line line-1"></div>
                                        <div className="line line-2"></div>
                                        <div className="line line-3"></div>
                                      </div>

                                      <div className="loading-text">
                                        LOADING
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {_.isEmpty(captions) && !loading && (
                                <div className="row">
                                  <div className="col-12">
                                    <span className="box">
                                      Please upload image htmlFor generating
                                      captions......
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
