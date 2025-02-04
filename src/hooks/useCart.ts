import { useEffect, useState } from "react"
import { useMemo } from 'react';
import { db } from "../data/db.js"
import type {CartItem, Guitar} from "../types";

const useCart = () => {
  
  const initialCart : CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
  
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
   }, [cart])

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  function addToCart(item: Guitar){
    const itemExists = cart.findIndex( guitar => guitar.id === item.id)
    if(itemExists >= 0 ){
      const updatedCart = [...cart]
      if(updatedCart[itemExists].quantity < MAX_ITEMS){
        updatedCart[itemExists].quantity++
        setCart(updatedCart)
      }
    }else{
      const newItem : CartItem = {...item, quantity : 1}
      setCart([...cart, newItem])
    }

  }

  function removeFromCart (id: number) {
    setCart( (prevCart) => prevCart.filter( guitar => guitar.id !== id ) )
    
  }

  function increaseQuantity(id: number){
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity < MAX_ITEMS){
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id: number){
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity > MIN_ITEMS ){
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function clearCart(){
    setCart([])
  }

  const isEmpty = useMemo( () => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => cart.reduce( (total, item) => total + (item.quantity * item.price), 0 ), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  }

    
}

export default useCart;