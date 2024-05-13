
import alanBtn from '@alan-ai/alan-sdk-web';
import { useCallback, useRef, useEffect, useState } from 'react';
import { useCart } from '~/context/CartConText'

function useAlan() {
    const [alan, setAlan] = useState()
    const { test, handleOrderAdd1, handleSearch } = useCart()

    const COMMANDS = {
        OPEN_CART: 'open-cart',
        CLOSE_CART: 'close-cart',
        SEARCH: 'search'
    }

    const openCart = useCallback(() => {
        alan.playText('Opening cart')
        // window.location.href = '/order';
        // handleOrderAdd()
        handleOrderAdd1()
        test('abc')


    }, [alan])
    const closeCart = useCallback(() => {
        alan.playText('Close cart')
        window.location.href = '/';


    }, [alan])
    const search = useCallback(async (value) => {
        let result

        if (value) {
            result = await handleSearch(value);
            window.location.href = `/product/${result.id}`;

        }
    })
    useEffect(() => {
        window.addEventListener(COMMANDS.OPEN_CART, openCart)
        window.addEventListener(COMMANDS.CLOSE_CART, closeCart)
        window.addEventListener(COMMANDS.SEARCH, search)

  

        return () => {
            window.removeEventListener(COMMANDS.OPEN_CART, openCart)
            window.removeEventListener(COMMANDS.CLOSE_CART, closeCart)
            window.removeEventListener(COMMANDS.SEARCH, search)


        }
    }, [openCart, closeCart, search])

    useEffect(() => {
        if (alan != null) return
        setAlan(
            alanBtn({
                bottom: '100px',
                key: 'b96b222e61a0e86404eb252714da6c3e2e956eca572e1d8b807a3e2338fdd0dc/stage',
                onCommand: commandData => {
                    // alert('âhjj')
                    window.dispatchEvent(new CustomEvent(commandData.command))
                    // search(commandData.payload.name)
                    alan.sendText('hi');


                }
            })
        )
    }, [])
    return null;
}

export default useAlan;