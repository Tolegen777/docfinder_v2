// shared/constants/specialtyIcons.ts
import doctorIcon from '@/shared/assets/icon/doctor.svg';
import neurologyIcon from '@/shared/assets/icon/neurology.svg';
import gastroIcon from '@/shared/assets/icon/gastro.svg';
import dentistIcon from '@/shared/assets/icon/dentist.svg';
import gynecologyIcon from '@/shared/assets/icon/gynecology.svg';
import cardiologyIcon from '@/shared/assets/icon/cardiology.svg';
import ophthalmologyIcon from '@/shared/assets/icon/eye.svg';
import dermatologyIcon from '@/shared/assets/icon/skin.svg';
import psychiatryIcon from '@/shared/assets/icon/brain.svg';
import pediatricsIcon from '@/shared/assets/icon/pediatrics.svg';
import surgeryIcon from '@/shared/assets/icon/surgery.svg';
import orthoIcon from '@/shared/assets/icon/orthopedics.svg';
import allergyIcon from '@/shared/assets/icon/allergy.svg';
import endocrineIcon from '@/shared/assets/icon/endocrine.svg';
import urologyIcon from '@/shared/assets/icon/urology.svg';
import diagnosticsIcon from '@/shared/assets/icon/diagnostics.svg';
import therapyIcon from '@/shared/assets/icon/therapy.svg';
import oncologyIcon from '@/shared/assets/icon/oncology.svg';
import { StaticImageData } from 'next/image';

// Маппинг слагов к иконкам
export const specialtyIconsMap: Record<string, any> = {
    // Неврология и мозг
    'nevrolog': neurologyIcon,
    'neirokhirurg': neurologyIcon,
    'epileptolog': neurologyIcon,

    // Гастроэнтерология
    'gastroenterolog': gastroIcon,
    'dietolog': gastroIcon,
    'proktolog': gastroIcon,

    // Стоматология
    'stomatolog': dentistIcon,
    'gnatolog': dentistIcon,
    'cheliustno-litsevoi-khirurg': dentistIcon,

    // Гинекология
    'ginekolog': gynecologyIcon,
    'akusher': gynecologyIcon,
    'mammolog': gynecologyIcon,

    // Кардиология
    'kardiolog': cardiologyIcon,
    'kardiokhirurg': cardiologyIcon,

    // Офтальмология
    'okulist': ophthalmologyIcon,
    'oftalmokhirurg': ophthalmologyIcon,

    // Дерматология
    'dermatolog': dermatologyIcon,
    'kosmetolog': dermatologyIcon,
    'trikholog': dermatologyIcon,

    // Психиатрия и психология
    'psikhiatr': psychiatryIcon,
    'psikholog': psychiatryIcon,
    'psikhoterapevt': psychiatryIcon,

    // Педиатрия
    'pediatr': pediatricsIcon,
    'neonatolog': pediatricsIcon,

    // Хирургия
    'khirurg': surgeryIcon,
    'plasticheskii-khirurg': surgeryIcon,
    'lazernyi-khirurg': surgeryIcon,

    // Ортопедия
    'travmatolog-ortoped': orthoIcon,
    'artrolog': orthoIcon,

    // Аллергология
    'allergolog': allergyIcon,
    'immunolog': allergyIcon,

    // Эндокринология
    'endokrinolog': endocrineIcon,

    // Урология
    'urolog': urologyIcon,
    'androlog': urologyIcon,

    // Диагностика
    'uzi_spetsialist': diagnosticsIcon,
    'rentgenolog': diagnosticsIcon,
    'vrach_funktsionalnoi_diagnostiki': diagnosticsIcon,
    'endoskopist': diagnosticsIcon,

    // Терапия
    'terapevt': therapyIcon,
    'fizioterapevt': therapyIcon,
    'manualnyi-terapevt': therapyIcon,
    'refleksoterapevt': therapyIcon,

    // Онкология
    'onkolog': oncologyIcon,
    'khimioterapevt': oncologyIcon,

    // Все остальные специальности используют стандартную иконку доктора
    'default': doctorIcon,
};

export const getSpecialtyIcon = (slug: string): StaticImageData => {
    return specialtyIconsMap[slug] || specialtyIconsMap.default;
};
