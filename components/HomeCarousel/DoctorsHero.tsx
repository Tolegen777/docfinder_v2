import Image from 'next/image'
import doctorImg from '@/shared/assets/images/home_doctors.png'

export const DoctorsHero = () => {
    return (
        <section className="bg-primary pt-4 md:h-[480px] md:p-6 rounded-md">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-6 md:-mt-12">
                        <h1 className="h2-40-56-600 lg:text-5xl xl:text-6xl font-bold leading-tight md:w-[1000px]">
                            ЛУЧШИЕ ВРАЧИ КАЗАХСТАНА<br />
                            В ОДНОМ МЕСТЕ
                        </h1>

                        <div className="space-y-4">
                            <h2 className="text-2xl lg:text-3xl font-semibold text-yellow-300">
                                1000+ СПЕЦИАЛИСТОВ
                                <div>
                                    с опытом ждут вас
                                </div>
                            </h2>
                        </div>

                        <p className="text-lg text-white/90 max-w-sm leading-relaxed">
                            Реальные отзывы, честные рейтинги,
                            удобная запись онлайн. Начните выбор
                            врача прямо сейчас - найдите своего
                            специалиста за минуту по городу или
                            специализации.
                        </p>
                    </div>

                    {/* Right Content - Doctors Image */}
                    <div className="relative flex justify-center lg:justify-end md:h-[450px] md:-bottom-20">
                        <div className="relative w-full max-w-lg">
                            <Image
                                src={doctorImg}
                                alt="Лучшие врачи Казахстана"
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            {/*<div className="absolute inset-0 pointer-events-none">*/}
            {/*    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/10 rounded-full"></div>*/}
            {/*    <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/10 rounded-full"></div>*/}
            {/*    <div className="absolute top-32 right-32 w-24 h-24 border-2 border-white/10 rounded-full"></div>*/}

            {/*    /!* Medical cross pattern *!/*/}
            {/*    <div className="absolute top-1/4 left-1/4 opacity-5">*/}
            {/*        <div className="w-8 h-32 bg-white rounded"></div>*/}
            {/*        <div className="w-32 h-8 bg-white rounded absolute top-3 -left-3"></div>*/}
            {/*    </div>*/}

            {/*    <div className="absolute bottom-1/4 right-1/4 opacity-5 rotate-12">*/}
            {/*        <div className="w-6 h-24 bg-white rounded"></div>*/}
            {/*        <div className="w-24 h-6 bg-white rounded absolute top-2 -left-2"></div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </section>
    )
}
