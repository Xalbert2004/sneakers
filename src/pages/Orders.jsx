import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from "../components/Card/Card";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('https://6348738e0b382d796c71f850.mockapi.io/orders');
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
          alert("Ошибка при запросе заказов");
          console.error(error)
      }
    })();
  }, [])
  return (
    <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>Мои заказы</h1>
          
        </div>


        <div className="d-flex flex-wrap">
        {
           (isLoading ? [...Array(8)] : orders).map((item, index) => (
            <Card
            key={index}
            loading={isLoading}
            {...item}
            />)
          )
         }
        </div>


      </div>
  )
}


