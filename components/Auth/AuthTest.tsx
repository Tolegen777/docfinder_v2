'use client'
import React, {useState} from 'react';
import {Button} from "../shadcn/button";
// import LoginModal from "./AuthModal/LoginModal";
import RegisterModal from "./AuthModal/RegisterModal";

const AuthTest = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    return (
        <div>
            {/*<LoginModal*/}
            {/*    isOpen={isAuthModalOpen}*/}
            {/*    onClose={() => setIsAuthModalOpen(false)}*/}
            {/*/>*/}
            <RegisterModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <Button onClick={() => setIsAuthModalOpen(true)}>открыть модалку</Button>
        </div>
    );
};

export default AuthTest;
