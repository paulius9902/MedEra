import React from 'react';
import { Breadcrumb, } from 'antd';
import "./styles.css";
import { useLocation } from 'react-router-dom'

const Breadcrumbs = (props) => {
    const url = window.location.href;
    const { pathname } = useLocation()
    if(pathname.includes('/visit')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/visit'>Vizitai</Breadcrumb.Item>
            </Breadcrumb> )

    } else if(pathname.includes('/doctor')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/doctor'>Gydytojai</Breadcrumb.Item>
            </Breadcrumb> )

    }else if(pathname.includes('/patient')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/patient'>Pacientai</Breadcrumb.Item>
            </Breadcrumb> )
     }else if(pathname.includes('/diagnosis')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/diagnosis'>Diagnozės</Breadcrumb.Item>
            </Breadcrumb> )
     }else if(pathname.includes('/laboratory_test')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/laboratory_test'>Lab. tyrimai</Breadcrumb.Item>
            </Breadcrumb> )
     }else if(pathname.includes('/prescription')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/prescription'>Receptai</Breadcrumb.Item>
            </Breadcrumb> )
     }else if(pathname.includes('/user')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/user'>Vartotojai</Breadcrumb.Item>
            </Breadcrumb> )
    } else {
        return null;
    }

};

export default Breadcrumbs;