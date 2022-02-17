import React from "react";

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="https://images.hindustantimes.com/img/2021/07/01/550x309/333e1192-da1e-11eb-b1f5-4d7a6862d03d_1625115198767_1625115210291.jpg"
              alt=""
            />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">MedEra</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;