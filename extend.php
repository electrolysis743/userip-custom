<?php

/*
 * This file is part of electrolysis743/userip-custom.
 *
 * Copyright (c) 2025 electrolysis743.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace UseripCustom\CustomIpApi;

use Flarum\Extend;

return [
    
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
        
    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Routes('api'))
        ->post('/my-extension/settings', 'myextension.save-settings', Api\Controller\SaveSettingsController::class),

    (new Extend\Settings())
        ->serializeToAdmin('userip_custom_api_url', 'userip-custom.api_url')
        ->serializeToAdmin('userip_custom_country_code', 'userip-custom.country_code')
        ->serializeToAdmin('userip_custom_region', 'userip-custom.region')
        ->serializeToAdmin('userip_custom_isp', 'userip-custom.isp')
        // 为设置键设置默认值
        ->default('userip-custom.api_url', 'https://api.example.com/v1/ip/{ip}')
];
