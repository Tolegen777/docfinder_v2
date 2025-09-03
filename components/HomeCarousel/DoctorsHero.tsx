import Image from 'next/image'
import doctorImg from '@/shared/assets/images/home_doctors.png'

export const DoctorsHero = () => {
    return (
        <section className="bg-primary pt-4 md:h-[480px] md:p-6 rounded-md font-roboto">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-3 md:space-y-6 md:-mt-20 text-center md:text-left">
                        <h1 className="h2-40-56-600 lg:text-5xl xl:text-6xl font-black leading-tight md:w-[1000px]">
                            ЛУЧШИЕ ВРАЧИ КАЗАХСТАНА<br />
                            В ОДНОМ МЕСТЕ
                        </h1>

                        <div className="space-y-4">
                            <h2 className="text-2xl lg:text-3xl font-black text-yellow-300">
                                1000+ СПЕЦИАЛИСТОВ
                                <div>
                                    с опытом ждут вас
                                </div>
                            </h2>
                        </div>

                        <p className="text-sm md:text-lg text-white/90 md:max-w-md leading-relaxed">
                            Реальные отзывы, честные рейтинги,
                            удобная запись онлайн. Начните выбор
                            врача прямо сейчас - найдите своего
                            специалиста за минуту по городу или
                            специализации.
                        </p>
                    </div>

                    {/* Right Content - Doctors Image */}
                    <div className="relative flex justify-center lg:justify-end md:h-[450px] md:-bottom-20 -m-6 md:m-auto">
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
        </section>
    )
}
