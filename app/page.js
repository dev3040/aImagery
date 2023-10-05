'use client';
import { useEffect, useRef, useState } from 'react';
import './styles.css'
import { getCaption, logout, validateUser } from './services/caption.service';
import _ from "lodash"
import { useRouter } from 'next/navigation'
import { LuRefreshCcw, LuLayoutDashboard, LuLayers, LuLogOut } from 'react-icons/lu';


export default function Home() {
  const hiddenFileInput = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState({});
  const [user, setUser] = useState({});
  const router = useRouter()
  useEffect(() => {
    // validateUser().then(user => {
    //   if (_.isEmpty(user)) {
    //     logout();
    //     router.push("/login")
    //   }
    //   setUser(user);
    // }).catch(err => {
    //   logout();
    //   router.push("/login")
    // })
  }, [])
  const uploadImage = () => {
    hiddenFileInput.current.click();
  };

  const handleRefresh = () => {
    // setLoading(true)
  }

  const handleChange = event => {

    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      console.log(formData);
      setLoading(true)
      getCaption(formData).then((response) => {
        setCaptions(response.data.captions)
        setLoading(false)
      })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };


  return (
    <main className='body-main'>
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
              <span style={{ color: "white" }}><LuLayers style={{ fontSize: "20px" }} /></span>
              <span className="nav_logo-name">Image Caption</span>
            </a>
            <div className="nav_list">
              <a href="#" className="nav_link active">
                <span style={{ color: "white" }}><LuLayoutDashboard style={{ fontSize: "20px" }} /></span>
                <span className="nav_name">Dashboard</span>
              </a>
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
                <img style={{ maxWidth: "10%", marginTop:"10px"}} src='https://i.ibb.co/6DWKXZL/logo-light.png' />
              </div>
              <div className="col-4">
                <button
                  className={`main-btn ${loading ? 'disabled-button' : ''}`}
                  disabled={loading}
                  onClick={uploadImage}
                >Upload</button>
                <input id="uploadFile"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  name="image"
                  class="img" />

              </div>
            </div>
          </div>

          <div className='center'>
            <div className="row">
              <div className="col-6">
                <div className="clipped" style={{
                  background: `url(${selectedImage ? URL.createObjectURL(selectedImage) : "https://s27363.pcdn.co/wp-content/uploads/2020/05/Best-Things-to-do-in-London-1200x900.jpg.optimal.jpg"})`,
                  backgroundRepeat: "no-repeat !important",
                  backgroundSize: "cover"
                }}></div>
              </div>
              <div className="col-6 caption-section card">
                <div className="card-header caption-header">
                  <div style={{ color: "white" }}>Captions</div>
                  <div>
                    <span className='icon' disabled={loading} onClick={handleRefresh}><LuRefreshCcw className={`icon ${loading ? 'refresh-start' : ''}`} /></span>
                  </div>
                </div>
                <div className="card-body">
                  <div className=''>
                    {
                      (!loading && !_.isEmpty(captions)) && <div className="row">
                        <div className="col-12" style={{ whiteSpace: "pre-wrap" }}>
                          <div className='typewriter monospace big-caret lorem'>
                            <p>
                              {captions}
                            </p>
                          </div>
                        </div>
                        {/* <div className="col-1">
                          <span>1</span>
                        </div>
                        <div className="col-10">
                          <div className='typewriter monospace big-caret lorem'>
                            <p>This will be some caption and here we will show,
                              This will be some caption and here we will show,
                              This will be some caption and here we will show
                              This will be some caption and here we will show
                            </p>
                          </div>
                        </div>
                        <div className="col-1">
                          <span className='icon'><i data-feather="copy"></i></span>
                        </div> */}
                      </div>
                    }
                    {
                      loading && <div className="row">
                        <div className="col-12">
                          <div class="preloader">
                            <div class="lines">
                              <div class="line line-1"></div>
                              <div class="line line-2"></div>
                              <div class="line line-3"></div>
                            </div>

                            <div class="loading-text">LOADING</div>
                          </div>
                        </div>
                      </div>
                    }
                    {
                      (_.isEmpty(captions) && !loading) && <div className="row">
                        <div className="col-12">
                          <span class="box">Please upload image for generating captions......</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}