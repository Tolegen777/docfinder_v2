'use client'
import { HTMLAttributes } from 'react';

import { IconSvgType } from '../../types/iconTypes';

interface IconProps extends HTMLAttributes<SVGSVGElement> {
    icon: IconSvgType;
}

export const Icon = ({ icon: IconComponent, ...props }: IconProps) => (
    <IconComponent {...props} />
);
