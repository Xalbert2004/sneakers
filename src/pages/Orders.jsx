import React from 'react';
import Card from "../components/Card/Card";

export default function Orders() {

  return (
    <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>Мои заказы</h1>
          
        </div>


        <div className="d-flex flex-wrap">
        {
          [].map((item, index) => (
            <Card/>)
          )
         }
        </div>


      </div>
  )
}


