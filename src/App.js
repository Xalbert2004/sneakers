import { useEffect, useState } from "react";
import {Route, Routes} from "react-router-dom";
import React from "react";
import AppContext from "./context";
import axios from "axios";
import Drawer from "./components/Drawer/Drawer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";


function App() {

  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCardOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://6348738e0b382d796c71f850.mockapi.io/Cart'),
          axios.get('https://6348738e0b382d796c71f850.mockapi.io/favorites'),
          axios.get('https://6348738e0b382d796c71f850.mockapi.io/items')
        ])
        // const cartResponse = await axios.get('https://6348738e0b382d796c71f850.mockapi.io/Cart');  
        // const favoritesResponse = await axios.get('https://6348738e0b382d796c71f850.mockapi.io/favorites');
        // const itemsResponse = await axios.get('https://6348738e0b382d796c71f850.mockapi.io/items');
        
        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при загрузке данных :(')
      }
    }

    fetchData();

  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id))
      if(findItem){
        setCartItems((prev) => prev.filter(item => Number(item.parentId) !== Number(obj.id) ));
        await axios.delete(`https://6348738e0b382d796c71f850.mockapi.io/Cart/${findItem.id}`);
      }else {
        setCartItems((prev) => [...prev, obj])
        const { data } = await axios.post('https://6348738e0b382d796c71f850.mockapi.io/Cart', obj);
        setCartItems((prev) => prev.map((item) => {
          if (item.parentId === data.parentId){
            return{
              ...item,
              id: data.id
            };  
          }
          return item;
        }))
    }
    } catch (error) {
      alert('Ошибка при добавлении в корзину')
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://6348738e0b382d796c71f850.mockapi.io/Cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)))
    } catch (error) {
      alert("Ошибка при удалении из корзины");
      console.error(error);
    }
  }

  const onAddToFavorite = async (obj) => {
    try {
      if(favorites.find((favObj) => Number(favObj.id) === Number(obj.id))){
        axios.delete(`https://6348738e0b382d796c71f850.mockapi.io/favorites/${obj.id}`); 
        setFavorites((prev) => prev.filter(item => Number(item.id) !== Number(obj.id) ));
      }else{
        const { data } = await axios.post('https://6348738e0b382d796c71f850.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
      console.error(error);
    }

  };

  const onChangeSearchInput = (event) => {
    console.log(searchValue)
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return  cartItems.some((obj) => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart, setCardOpened, setCartItems }}>
      <div className="wrappper clear">
        <Drawer 
        onClose={() => setCardOpened(false)}
        items={cartItems}
        onRemove={onRemoveItem}
        opened={cartOpened}
        />
        <Header onClickCart={() => setCardOpened(true)} />
        
        <Routes>
          <Route exact path="" element={<Home 
            items={items} 
            cartItems={cartItems}
            searchValue={searchValue} 
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput} 
            onAddToFavorite={onAddToFavorite} 
            onAddToCart={onAddToCart}
            isLoading={isLoading} 
            
            />} >
            
          </Route>

          <Route exact path="favorites" 
              element={<Favorites />}>
          </Route>

          <Route exact path="orders" 
              element={<Orders/>}>
          </Route>
        </Routes>
      
      </div>
    </AppContext.Provider>
  );
}

export default App;
