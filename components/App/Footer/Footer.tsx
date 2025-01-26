import React from 'react';

const Footer = () => {
    const footerSections = {
        patients: {
            title: 'Пациентам',
            links: ['Пункт для меню', 'Пункт для меню', 'Пункт для меню', 'Пункт для меню']
        },
        doctors: {
            title: 'Врачам',
            links: ['Пункт для меню', 'Пункт для меню', 'Пункт для меню', 'Пункт для меню']
        },
        contacts: {
            title: 'Контакты',
            phone: '+7 (000) 000-00-00',
            email: 'example@mail.ru',
            address: ['Электронная почта', 'info@medpomosh.ru', 'г. Нижний Новгород, просп.', 'Ленина, ул. Нижняя']
        },
        social: {
            title: 'Соц. сети',
            links: ['Название компании или ИП', 'ИНН ХХХХХХХХХХХ', 'ОГРН ХХХХХХХХХХХХХ']
        }
    };

    // Footer link component
    const FooterLink = ({ href = '#', children }) => (
        <a href={href} className="text-gray-400 hover:text-white transition-colors">
            {children}
        </a>
    );

    // Footer section component
    const FooterSection = ({ title, children }) => (
        <div className="space-y-4">
            <h3 className="text-white font-medium">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );

    return (
        <footer className="bg-[#121923] text-sm">
            {/* Desktop Layout */}
            <div className="hidden md:block max-w-7xl mx-auto">
                <div className="grid grid-cols-4 gap-8 px-8 py-12">
                    {/* Patients Section */}
                    <FooterSection title={footerSections.patients.title}>
                        {footerSections.patients.links.map((link, index) => (
                            <div key={index}>
                                <FooterLink>{link}</FooterLink>
                            </div>
                        ))}
                    </FooterSection>

                    {/* Doctors Section */}
                    <FooterSection title={footerSections.doctors.title}>
                        {footerSections.doctors.links.map((link, index) => (
                            <div key={index}>
                                <FooterLink>{link}</FooterLink>
                            </div>
                        ))}
                    </FooterSection>

                    {/* Contacts Section */}
                    <FooterSection title={footerSections.contacts.title}>
                        <div className="text-green-500">
                            <FooterLink href={`tel:${footerSections.contacts.phone}`}>
                                {footerSections.contacts.phone}
                            </FooterLink>
                        </div>
                        <div className="text-gray-400">
                            {footerSections.contacts.address.map((line, index) => (
                                <div key={index}>{line}</div>
                            ))}
                        </div>
                    </FooterSection>

                    {/* Social Section */}
                    <FooterSection title={footerSections.social.title}>
                        {footerSections.social.links.map((link, index) => (
                            <div key={index} className="text-gray-400">
                                {link}
                            </div>
                        ))}
                    </FooterSection>
                </div>

                {/* Bottom Links */}
                <div className="border-t border-gray-800 px-8 py-4">
                    <div className="flex space-x-4 text-gray-400 text-xs">
                        <FooterLink>Условия на обработку данных</FooterLink>
                        <FooterLink>Оплата и возможные способы</FooterLink>
                        <FooterLink>Правила пользования сайтом</FooterLink>
                        <FooterLink>Карта сайта</FooterLink>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden px-4 py-8 space-y-8">
                {/* Patients Section */}
                <FooterSection title={footerSections.patients.title}>
                    {footerSections.patients.links.map((link, index) => (
                        <div key={index}>
                            <FooterLink>{link}</FooterLink>
                        </div>
                    ))}
                </FooterSection>

                {/* Doctors Section */}
                <FooterSection title={footerSections.doctors.title}>
                    {footerSections.doctors.links.map((link, index) => (
                        <div key={index}>
                            <FooterLink>{link}</FooterLink>
                        </div>
                    ))}
                </FooterSection>

                {/* Contacts Section */}
                <FooterSection title={footerSections.contacts.title}>
                    <div className="text-green-500">
                        <FooterLink href={`tel:${footerSections.contacts.phone}`}>
                            {footerSections.contacts.phone}
                        </FooterLink>
                    </div>
                    <div className="text-gray-400">
                        {footerSections.contacts.address.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                </FooterSection>

                {/* Social Section */}
                <FooterSection title={footerSections.social.title}>
                    {footerSections.social.links.map((link, index) => (
                        <div key={index} className="text-gray-400">
                            {link}
                        </div>
                    ))}
                </FooterSection>

                {/* Bottom Links */}
                <div className="space-y-2 text-gray-400 text-xs pt-4 border-t border-gray-800">
                    <FooterLink>Условия на обработку данных</FooterLink>
                    <FooterLink>Оплата и возможные способы</FooterLink>
                    <FooterLink>Правила пользования сайтом</FooterLink>
                    <FooterLink>Карта сайта</FooterLink>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
