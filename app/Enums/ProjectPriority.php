<?php

namespace App\Enums;

enum ProjectPriority: string
{
    case LOW = 'Low';
    case MEDIUM = 'Medium';
    case HIGH = 'High';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
