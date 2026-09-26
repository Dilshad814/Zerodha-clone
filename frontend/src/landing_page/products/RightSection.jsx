import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
}) {
  return (
    <div className="conatainer mt-5">
      <div className="row ">
    
        <div className="col-6 p-5 mt-5 ">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div>
            <a href={learnMore}s>
              Learn More
            </a>
          </div>
        </div>
            <div className="col-6 ">
          <img src={imageURL} style={{ marginLeft: "100px" }} />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
