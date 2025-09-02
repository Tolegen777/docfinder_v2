'use client';

import { MessageCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

export const FloatingWhatsApp = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState("+77009990108");

    // const {currentCity} = useCityStore()
    //
    // useEffect(() => {
    //     if (currentCity?.title === 'Алматы') {
    //         setWhatsappNumber("+77070000103")
    //     } else if (currentCity?.title === 'Астана') {
    //         setWhatsappNumber("+77470000103")
    //     }
    // }, [currentCity?.title]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer');
    };

    if (!isVisible) return null;

    const buttonStyle: React.CSSProperties = {
        position: 'relative',
        backgroundColor: isHovered ? '#128C7E' : '#25D366',
        color: 'white',
        padding: '16px',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        animation: isHovered ? 'none' : 'whatsappPulse 2s infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px'
    };

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999
    };

    const tooltipStyle: React.CSSProperties = {
        position: 'absolute',
        right: '100%',
        marginRight: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
        backgroundColor: '#374151',
        color: 'white',
        fontSize: '14px',
        padding: '8px 12px',
        borderRadius: '8px',
        whiteSpace: 'nowrap'
    };

    const tooltipArrowStyle: React.CSSProperties = {
        position: 'absolute',
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid #374151',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent'
    };

    const ring1Style: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '50%',
        backgroundColor: '#25D366',
        animation: 'whatsappPing 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        opacity: 0.2
    };

    const ring2Style: React.CSSProperties = {
        ...ring1Style,
        animationDelay: '0.2s'
    };

    return (
        <>
            <style jsx>{`
                @keyframes whatsappPulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                
                @keyframes whatsappPing {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>

            <div style={containerStyle}>
                <button
                    id="float-whatsapp-button"
                    onClick={handleWhatsAppClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={buttonStyle}
                    aria-label="Написать в WhatsApp"
                >
                    <MessageCircle size={24} />

                    {/* Tooltip */}
                    <div style={tooltipStyle}>
                        Написать в WhatsApp
                        <div style={tooltipArrowStyle}></div>
                    </div>

                    {/* Пульсирующие кольца */}
                    <div style={ring1Style}></div>
                    <div style={ring2Style}></div>
                </button>
            </div>
        </>
    );
};
