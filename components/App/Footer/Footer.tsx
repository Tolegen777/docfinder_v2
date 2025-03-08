const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Desktop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 place-items-center">
                    {/* Patients */}
                    <div>
                        <h3 className="text-xl font-medium mb-4">Пациентам</h3>
                        <ul className="space-y-2">
                            {Array(6).fill("Пункт для меню").map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Doctors */}
                    <div>
                        <h3 className="text-xl font-medium mb-4">Врачам</h3>
                        <ul className="space-y-2">
                            {Array(6).fill("Пункт для меню").map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div className="-mr-12">
                        <h3 className="text-xl font-medium mb-4">Контакты</h3>
                        <div className="space-y-2 text-gray-400">
                            <a href="tel:+7 (000) 000-00-00" className="block hover:text-white text-green-500">+7 (000) 000-00-00</a>
                            <p>Консультации и расчёт</p>
                            <p className="pt-2">Электронная почта:</p>
                            <a href="mailto:info@sitename.ru" className="block hover:text-white">info@sitename.ru</a>
                            <p className="pt-2">Адрес:</p>
                            <p>г. Алматы, ул. Манаса</p>
                        </div>
                    </div>

                    {/* Social Networks and Company Info */}
                    <div className="-mr-20">
                        <h3 className="text-xl font-medium mb-4">Соц. сети</h3>
                        <div className="flex space-x-4 mb-6">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">VKontakte</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2m3.08 14.27h-1.46c-.55 0-.72-.44-1.71-1.44-1.32-1.22-1.82-1.38-2.13-1.38-.43 0-.56.12-.56.73v1.31c0 .52-.16.78-1.47.78-2.17 0-4.57-1.31-6.26-3.76-2.54-3.61-3.23-6.32-3.23-6.87 0-.3.12-.57.73-.57h1.46c.55 0 .75.25.96.83.86 2.48 2.29 4.66 2.88 4.66.22 0 .32-.1.32-.67V8.35c-.07-1.19-.69-1.29-.69-1.71 0-.21.17-.41.45-.41h2.3c.39 0 .53.13.53.66v3.54c0 .38.14.51.23.51.22 0 .41-.13.81-.54 1.33-1.47 2.28-3.75 2.28-3.75.12-.26.33-.51.84-.51h1.46c.44 0 .67.23.54.68-.23 1.02-2.41 4.12-2.41 4.12-.19.32-.27.45 0 .81.19.26.83.81 1.26 1.3.79.89 1.37 1.63 1.54 2.14.17.5-.1.75-.58.75"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">YouTube</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                                </svg>
                            </a>
                        </div>
                        <div className="text-gray-400">
                            <p>Название компании или ИП</p>
                            <p>© nazvaniesaita.ru, 2034</p>
                            <p>ОГРН 000000000000</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Links */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex flex-wrap gap-4 justify-center text-gray-400 text-sm">
                        <a href="#" className="hover:text-white">Согласие на обработку данных</a>
                        <a href="#" className="hover:text-white">Служба поддержки</a>
                        <a href="#" className="hover:text-white">Политика конфиденциальности</a>
                        <a href="#" className="hover:text-white">Карта сайта</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
