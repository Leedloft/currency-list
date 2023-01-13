import React, {useEffect, useState} from 'react';
import Select from "react-select";
import styles from './style.module.css'
import {TextField} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import getSymbolFromCurrency from "currency-symbol-map";

const BASE_URL = 'https://api.apilayer.com/fixer/symbols'
const CONVERT_URL = (to, from, amount) => `https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`
const API_KEY = '7sL7KRXD7I4BoNaWVPVdu5xaoLFQR6wz'

const REQUEST_HEADERS = {
    method: 'GET',
    headers: new Headers({
        apikey: API_KEY
    })
}

const Content = () => {
    const [input, setInput] = useState('')
    const [res, setRes] = useState({
        result: '',
        symbols: ''
    })
    const [rates, setRates] = useState([])
    const [fromRates, setFromRates] = useState(null)
    const [toRates, setToRates] = useState(null)
console.log(rates, 'rates')
console.log(fromRates, 'fromRates')

    const handleInputChange = (ev) => setInput(ev.target.value)

    const handleChangeFrom = (options) =>  setFromRates(options)

    const handleChangeTo = (options) => setToRates(options)

    const handleSwitchCurrency = () => {
        setFromRates(toRates)
        setToRates(fromRates)
    }
    const handleClickConvert = async () => {
        try {
            console.log('convert')
            const res = await fetch(CONVERT_URL(toRates.value, fromRates.value, input), REQUEST_HEADERS)
            const data = await res.json()
            setRes( {
                result: Math.round(data.result),
                symbols:getSymbolFromCurrency(toRates)
            })
        } catch (e) {
            console.log(e)
        }
    }

    const fetchRates = async () => {
        try {
            const res = await fetch(BASE_URL, REQUEST_HEADERS)
            const data = await res.json()
            return data
        } catch (e) {
            console.log(e, 'error')
        }
    }
    useEffect(() => {
        (async () => {
            const data = await fetchRates()
            const rates = Object.keys(data.symbols).map(item => ({
                label: item,
                value: item
            }))
            setRates(rates)
        })()
    }, [])

    return (
        <div className={styles.global_div}>
            <div className={styles.main_block}>
                <h2 className={styles.title}>
                    Simple Currency Converter
                </h2>
                <section className={styles.card_section}>
                    <div className={styles.card_block}>
                        <span className='color_line'></span>
                        <h3 className='rate'>
                            Exchange Rate
                        </h3>
                        <span className='price'>
                            {res.result} {res.symbols}
                        </span>
                        <div className={styles.amount_div}>
                            <TextField
                                fullWidth
                                value={input}
                                onChange={handleInputChange}
                                label={'Amount'}
                                type='number'
                            />
                        </div>
                        <span className={styles.select_span}>From <span className={styles.to_span}>To</span></span>
                        <div className={styles.select_parent}>
                            <div className={styles.select_div}>
                                <Select
                                    className={styles.select_one}
                                    value={fromRates}
                                    options={rates}
                                    onChange={handleChangeFrom}
                                />
                                <button className={styles.icon_button} onClick={handleSwitchCurrency}>
                                    <SwapHorizIcon/>
                                </button>
                                <Select
                                    className={styles.select_two}
                                    value={toRates}
                                    options={rates}
                                    onChange={handleChangeTo}
                                />
                            </div>
                        </div>
                        <div className={styles.button}>
                            <button onClick={handleClickConvert} className={styles.convert_button}>
                                Convert
                            </button>
                            </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Content;